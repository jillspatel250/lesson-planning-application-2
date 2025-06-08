create table public.timetable (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null,
  type text not null,
  subject uuid not null,
  faculty uuid not null,
  department uuid not null,
  "to" timestamptz not null,
  "from" timestamptz not null,
  division text not null,
  batch text not null
);