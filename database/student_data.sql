-- student_data.sql
-- Schema for the student_data table based on the ERD

CREATE TABLE IF NOT EXISTS student_data (
    student_id uuid not null default gen_random_uuid(),
    student_id_number varchar not null,
    created_at timestamp not null default now(),
    gender text,
    date_of_birth date,
    ph_number varchar,
    dept_id uuid REFERENCES departments(id),
    sem int4,
    batch_councellor uuid REFERENCES users(id),
    father_number varchar,
    father_email varchar,
    mother_number varchar,
    first_name text,
    last_name text,
    email varchar,
    division text,
    batch text,
);
