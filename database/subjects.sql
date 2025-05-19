create table public.subjects (
  id uuid not null default extensions.uuid_generate_v4(),
  code text not null,
  name text not null,
  semester integer not null,
  lecture_hours integer not null,
  lab_hours integer not null,
  abbreviation_name text not null,
  credits integer not null,
  department_id uuid null,
  is_practical boolean null default false,
  is_theory boolean null default true,
  constraint subjects_pkey primary key (id),
  constraint subjects_code_key unique (code),
  constraint subjects_department_id_fkey foreign key (department_id) references public.departments (id) on delete cascade
) tablespace pg_default;

create index if not exists idx_subjects_department_id on public.subjects using btree (department_id) tablespace pg_default;
create index if not exists idx_subjects_semester on public.subjects using btree (semester) tablespace pg_default;
create index if not exists idx_subjects_is_practical on public.subjects using btree (is_practical) tablespace pg_default;
create index if not exists idx_subjects_is_theory on public.subjects using btree (is_theory) tablespace pg_default;