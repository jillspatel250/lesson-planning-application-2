create table
  public.users (
    id uuid not null default gen_random_uuid(),
    auth_id uuid not null,
    name character varying not null,
    email character varying not null,
    profile_photo text null,
    constraint users_pkey primary key (id),
    constraint users_auth_id_key unique (auth_id),
    constraint users_email_key unique (email),
    constraint users_auth_id_fkey foreign key (auth_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;