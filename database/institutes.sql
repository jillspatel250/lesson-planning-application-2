create table public.institutes (
  id uuid not null default extensions.uuid_generate_v4(),
  name text not null,
  abbreviation_insti text not null,
  constraint institutes_pkey primary key (id),
  constraint institutes_name_key unique (name),
  constraint institutes_abbreviation_insti_key unique (abbreviation_insti)
) tablespace pg_default;

create index if not exists idx_institutes_name on public.institutes using btree (name) tablespace pg_default;
create index if not exists idx_institutes_abbreviation on public.institutes using btree (abbreviation_insti) tablespace pg_default;