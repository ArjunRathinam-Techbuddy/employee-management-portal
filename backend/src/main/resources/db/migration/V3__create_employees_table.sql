-- V3__create_employees_table.sql
CREATE TABLE employees (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT          REFERENCES users(id) ON DELETE SET NULL,
    employee_code       VARCHAR(20)     NOT NULL UNIQUE,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    department_id       BIGINT          NOT NULL REFERENCES departments(id),
    designation         VARCHAR(100)    NOT NULL,
    date_of_joining     DATE            NOT NULL,
    salary              NUMERIC(12,2)   NOT NULL CHECK (salary > 0),
    phone               VARCHAR(20),
    address             TEXT,
    profile_photo_url   TEXT,
    manager_id          BIGINT          REFERENCES employees(id),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_manager_not_self CHECK (manager_id != id)
);

CREATE INDEX idx_employees_code          ON employees(employee_code);
CREATE INDEX idx_employees_department    ON employees(department_id);
CREATE INDEX idx_employees_manager       ON employees(manager_id);
CREATE INDEX idx_employees_is_active     ON employees(is_active);
CREATE INDEX idx_employees_user_id       ON employees(user_id);
