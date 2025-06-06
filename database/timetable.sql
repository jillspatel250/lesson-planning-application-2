create table public.timetable (
  id uuid not null default gen_random_uuid (),
  day text null,
  type text null,
  subject uuid null,
  faculty uuid null,
  department uuid null,
  "to" timestamp with time zone null,
  "from" timestamp with time zone null,
  division text null,
  batch text null,
  sem integer null,
  constraint Time Table_pkey primary key (id),
  constraint Time Table_subject_fkey foreign KEY (subject) references subjects (id),
  constraint Time Table_faculty_fkey foreign KEY (faculty) references users (id),
  constraint Time Table_department_fkey foreign KEY (department) references departments (id)
) TABLESPACE pg_default;