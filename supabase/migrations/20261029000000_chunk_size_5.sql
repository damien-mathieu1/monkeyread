-- The reader now shows up to 5 words at once.
alter table public.reading_sessions drop constraint reading_sessions_chunk_size_check;
alter table public.reading_sessions
  add constraint reading_sessions_chunk_size_check check (chunk_size between 1 and 5);
