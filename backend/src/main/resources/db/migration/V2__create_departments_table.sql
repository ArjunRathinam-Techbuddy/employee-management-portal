-- V2__create_departments_table.sql
CREATE TABLE departments (
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100)    NOT NULL UNIQUE,
    description      TEXT,
    head_employee_id BIGINT,         -- FK added in V4 after employees table exists
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_departments_name ON departments(name);
