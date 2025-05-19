create table public.user_role (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  role_name character varying not null,
  depart_id uuid null,
  constraint user_role_pkey primary key (id),
  constraint user_role_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade,
  constraint user_role_depart_id_fkey foreign key (depart_id) references public.departments (id) on delete cascade
) tablespace pg_default;

create index if not exists idx_user_role_user_id on public.user_role using btree (user_id) tablespace pg_default;
create index if not exists idx_user_role_role_name on public.user_role using btree (role_name) tablespace pg_default;
create index if not exists idx_user_role_depart_id on public.user_role using btree (depart_id) tablespace pg_default;