create table public.faculty_subjects (
  id uuid not null default extensions.uuid_generate_v4(),
  faculty_id uuid not null,
  depart_id uuid not null,
  subject_id uuid not null,
  academic_year text not null,
  division text not null,
  constraint faculty_subjects_pkey primary key (id),
  constraint faculty_subjects_faculty_id_fkey foreign key (faculty_id) references public.users (id) on delete cascade,
  constraint faculty_subjects_depart_id_fkey foreign key (depart_id) references public.departments (id) on delete cascade,
  constraint faculty_subjects_subject_id_fkey foreign key (subject_id) references public.subjects (id) on delete cascade,
  constraint faculty_subjects_unique unique (faculty_id, subject_id, academic_year, division)
) tablespace pg_default;

create index if not exists idx_faculty_subjects_faculty_id on public.faculty_subjects using btree (faculty_id) tablespace pg_default;
create index if not exists idx_faculty_subjects_subject_id on public.faculty_subjects using btree (subject_id) tablespace pg_default;
create index if not exists idx_faculty_subjects_depart_id on public.faculty_subjects using btree (depart_id) tablespace pg_default;
create index if not exists idx_faculty_subjects_academic_year on public.faculty_subjects using btree (academic_year) tablespace pg_default;
create index if not exists idx_faculty_subjects_division on public.faculty_subjects using btree (division) tablespace pg_default;