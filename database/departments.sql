create table public.departments (
  id uuid not null default extensions.uuid_generate_v4(),
  name text not null,
  abbreviation_depart text not null,
  institute_id uuid null,
  constraint departments_pkey primary key (id),
  constraint departments_name_institute_unique unique (name, institute_id),
  constraint departments_abbreviation_institute_unique unique (abbreviation_depart, institute_id),
  constraint departments_institute_id_fkey foreign key (institute_id) references public.institutes (id) on delete cascade
) tablespace pg_default;

create index if not exists idx_departments_institute_id on public.departments using btree (institute_id) tablespace pg_default;
create index if not exists idx_departments_name on public.departments using btree (name) tablespace pg_default;
create index if not exists idx_departments_abbreviation on public.departments using btree (abbreviation_depart) tablespace pg_default;