-- V4__add_department_head_fk_and_remaining_tables.sql

-- Now that employees exists, we can add the FK for department head
ALTER TABLE departments
    ADD CONSTRAINT fk_dept_head
    FOREIGN KEY (head_employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- Leave requests
CREATE TYPE leave_type   AS ENUM ('SICK', 'CASUAL', 'ANNUAL');
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE leave_requests (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT          NOT NULL REFERENCES employees(id),
    leave_type      leave_type      NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    reason          TEXT,
    status          leave_status    NOT NULL DEFAULT 'PENDING',
    reviewed_by     BIGINT          REFERENCES users(id),
    reviewed_at     TIMESTAMPTZ,
    reject_reason   TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_dates        CHECK (end_date >= start_date),
    CONSTRAINT chk_duration     CHECK ((end_date - start_date) <= 30)
);

CREATE INDEX idx_leave_employee    ON leave_requests(employee_id);
CREATE INDEX idx_leave_status      ON leave_requests(status);
CREATE INDEX idx_leave_dates       ON leave_requests(start_date, end_date);

-- Audit logs
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT          REFERENCES users(id),
    action      VARCHAR(100)    NOT NULL,
    entity_type VARCHAR(50)     NOT NULL,
    entity_id   BIGINT,
    old_value   JSONB,
    new_value   JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user       ON audit_logs(user_id);
CREATE INDEX idx_audit_created    ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_entity     ON audit_logs(entity_type, entity_id);
