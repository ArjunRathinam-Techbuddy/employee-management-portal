-- V1__create_users_table.sql
CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   TEXT            NOT NULL,
    role            user_role       NOT NULL DEFAULT 'EMPLOYEE',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    failed_attempts INTEGER         NOT NULL DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);
