-- Accounts, reading sessions, synced settings, public stats and leaderboards.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (name ~ '^[A-Za-z0-9_.-]{3,20}$'),
  avatar_url text,
  bio text not null default '' check (char_length(bio) <= 250),
  github text not null default '' check (github ~ '^[A-Za-z0-9-]{0,39}$'),
  twitter text not null default '' check (twitter ~ '^[A-Za-z0-9_]{0,15}$'),
  website text not null default '' check (website = '' or website ~ '^https?://' and char_length(website) <= 200),
  show_activity boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index profiles_name_lower_idx on public.profiles (lower(name));

create table public.reading_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  started_at timestamptz not null,
  duration_ms integer not null check (duration_ms between 1000 and 21600000),
  words_read integer not null check (words_read >= 1),
  total_words integer not null check (total_words >= words_read),
  wpm integer not null check (wpm between 50 and 2000),
  chunk_size smallint not null check (chunk_size between 1 and 3),
  completed boolean not null,
  created_at timestamptz not null default now(),
  -- Words can't be shown faster than the configured speed allows (+ one chunk of slack).
  check (words_read <= ceil(duration_ms::numeric * wpm / 60000) + chunk_size)
);

create index reading_sessions_user_started_idx on public.reading_sessions (user_id, started_at);
create index reading_sessions_started_idx on public.reading_sessions (started_at);

-- Sessions must be recent and can't overlap, so totals are bounded by real elapsed time.
create function public.check_reading_session() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.started_at < now() - interval '1 day' then
    raise exception 'session too old';
  end if;
  if new.started_at + new.duration_ms * interval '1 millisecond' > now() + interval '1 minute' then
    raise exception 'session ends in the future';
  end if;
  -- Serializes a user's inserts so two concurrent requests can't both pass the overlap check.
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if exists (
    select 1 from public.reading_sessions s
    where s.user_id = new.user_id
      and s.started_at < new.started_at + new.duration_ms * interval '1 millisecond'
      and new.started_at < s.started_at + s.duration_ms * interval '1 millisecond'
  ) then
    raise exception 'session overlaps another one';
  end if;
  return new;
end $$;

create trigger check_reading_session before insert on public.reading_sessions
  for each row execute function public.check_reading_session();

create table public.user_settings (
  user_id uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.user_settings enable row level security;

-- Profiles are public; only the owner can edit (name, avatar and created_at excluded below).
create policy "profiles are public" on public.profiles for select using (true);
create policy "owners update their profile" on public.profiles for update
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

revoke update on public.profiles from anon, authenticated;
grant update (bio, github, twitter, website, show_activity) on public.profiles to authenticated;

create policy "owners read their sessions" on public.reading_sessions for select
  using (user_id = (select auth.uid()));
create policy "owners add their sessions" on public.reading_sessions for insert
  with check (user_id = (select auth.uid()));

create policy "owners manage their settings" on public.user_settings for all
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- New auth user -> profile with a unique, valid name derived from the sign-up data.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  meta jsonb := new.raw_user_meta_data;
  base text;
  candidate text;
  n int := 0;
begin
  base := coalesce(meta ->> 'name', meta ->> 'user_name', meta ->> 'preferred_username',
                   meta ->> 'full_name', split_part(new.email, '@', 1), 'reader');
  base := left(regexp_replace(base, '[^A-Za-z0-9_.-]', '', 'g'), 16);
  if char_length(base) < 3 then base := 'reader'; end if;
  candidate := base;
  while exists (select 1 from public.profiles where lower(name) = lower(candidate)) loop
    n := n + 1;
    candidate := base || n;
  end loop;
  insert into public.profiles (id, name, avatar_url)
  values (new.id, candidate, coalesce(meta ->> 'avatar_url', meta ->> 'picture'));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.name_available(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select p_name ~ '^[A-Za-z0-9_.-]{3,20}$'
     and not exists (select 1 from public.profiles where lower(name) = lower(p_name));
$$;

create function public.rename_me(p_name text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not public.name_available(p_name) then raise exception 'name unavailable'; end if;
  update public.profiles set name = p_name where id = auth.uid();
end $$;

create function public.delete_me() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;

-- shortcut: leaderboards aggregate raw sessions on every call; add a rollup table once traffic grows.
create function public.leaderboard(p_metric text, p_period text, p_limit int default 50, p_offset int default 0)
returns table (rank bigint, name text, avatar_url text, words_read bigint, time_ms bigint, sessions bigint, last_read timestamptz)
language sql stable security definer set search_path = '' as $$
  with totals as (
    select s.user_id, sum(s.words_read)::bigint as words_read, sum(s.duration_ms)::bigint as time_ms,
           count(*) as sessions, max(s.started_at) as last_read
    from public.reading_sessions s
    where p_period = 'all'
       or (p_period = 'week' and s.started_at >= now() - interval '7 days')
       or (p_period = 'day' and s.started_at >= now() - interval '1 day')
    group by s.user_id
  )
  select rank() over (order by case when p_metric = 'time' then t.time_ms else t.words_read end desc),
         p.name, p.avatar_url, t.words_read, t.time_ms, t.sessions, t.last_read
  from totals t join public.profiles p on p.id = t.user_id
  order by 1, p.name
  limit least(p_limit, 100) offset p_offset;
$$;

create function public.leaderboard_rank(p_metric text, p_period text, p_name text)
returns table (rank bigint, total bigint, words_read bigint, time_ms bigint, sessions bigint, last_read timestamptz)
language sql stable security definer set search_path = '' as $$
  with ranked as (
    select l.*, count(*) over () as total from public.leaderboard(p_metric, p_period, 2147483647, 0) l
  )
  select r.rank, r.total, r.words_read, r.time_ms, r.sessions, r.last_read
  from ranked r where lower(r.name) = lower(p_name);
$$;

-- Daily activity in UTC; hidden for other people when the owner turned it off.
create function public.activity(p_name text, p_days int default 371)
returns table (day date, words_read bigint, time_ms bigint, sessions bigint)
language sql stable security definer set search_path = '' as $$
  select (s.started_at at time zone 'utc')::date, sum(s.words_read)::bigint, sum(s.duration_ms)::bigint, count(*)
  from public.reading_sessions s join public.profiles p on p.id = s.user_id
  where lower(p.name) = lower(p_name)
    and (p.show_activity or p.id = auth.uid())
    and s.started_at >= now() - make_interval(days => least(p_days, 3660))
  group by 1 order by 1;
$$;

create function public.public_profile(p_name text)
returns table (
  name text, avatar_url text, bio text, github text, twitter text, website text, show_activity boolean,
  created_at timestamptz, sessions_started bigint, sessions_completed bigint, words_read bigint, time_ms bigint,
  longest_session_words integer, longest_session_ms integer, usual_wpm integer, active_days bigint,
  current_streak integer, best_streak integer
)
language sql stable security definer set search_path = '' as $$
  with p as (select * from public.profiles where lower(name) = lower(p_name)),
  s as (select r.* from public.reading_sessions r join p on p.id = r.user_id),
  days as (select distinct (started_at at time zone 'utc')::date as d from s),
  islands as (select d, d - (row_number() over (order by d))::int as grp from days),
  streaks as (select max(d) as last_day, count(*)::int as len from islands group by grp)
  select p.name, p.avatar_url, p.bio, p.github, p.twitter, p.website, p.show_activity, p.created_at,
    (select count(*) from s),
    (select count(*) from s where completed),
    (select coalesce(sum(words_read), 0)::bigint from s),
    (select coalesce(sum(duration_ms), 0)::bigint from s),
    (select max(words_read) from s),
    (select max(duration_ms) from s),
    (select mode() within group (order by wpm) from s),
    (select count(*) from days),
    coalesce((select len from streaks
              where last_day >= (now() at time zone 'utc')::date - 1
              order by last_day desc limit 1), 0),
    coalesce((select max(len) from streaks), 0)
  from p;
$$;

revoke execute on function public.delete_me(), public.rename_me(text) from anon, public;
grant execute on function public.delete_me(), public.rename_me(text) to authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated, public;
