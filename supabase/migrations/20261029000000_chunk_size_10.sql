-- The reader now shows up to 10 words at once (5 presets plus a custom value).
alter table public.reading_sessions drop constraint reading_sessions_chunk_size_check;
alter table public.reading_sessions
  add constraint reading_sessions_chunk_size_check check (chunk_size between 1 and 10);
