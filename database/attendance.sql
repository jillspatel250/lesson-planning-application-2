create table public.attendance (
  taken_at timestamp with time zone not null default now(),
  lecture uuid null,
  faculty_id uuid null,
  is_present boolean null default false,
  id uuid not null default gen_random_uuid (),
  "Date" timestamp with time zone null,
  student_id uuid null,
  constraint attendance_pkey primary key (id),
  constraint attendance_faculty_id_fkey foreign KEY (faculty_id) references users (id),
  constraint attendance_lecture_fkey foreign KEY (lecture) references timetable (id),
  constraint attendance_student_id_fkey foreign KEY (student_id) references student_data (student_id)
) TABLESPACE pg_default;