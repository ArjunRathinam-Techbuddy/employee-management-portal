# Employee Management Portal

A full-stack HRMS-style application for managing employees, departments, leave requests, and audit trails, with role-based access control (Admin / Employee).

**Stack:** Spring Boot (Java 21) · React (Vite) · PostgreSQL · Flyway · Docker Compose · JWT Auth

---

## Table of Contents

- [Stack Choice & Justification](#stack-choice--justification)
- [Quick Start](#quick-start)
- [Seed Data / Default Logins](#seed-data--default-logins)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Business Rules Implemented](#business-rules-implemented)
- [curl Examples](#curl-examples)
- [Known Limitations & Deliberate Deviations](#known-limitations--deliberate-deviations)
- [Tech Decisions Worth Knowing](#tech-decisions-worth-knowing)

---

## Stack Choice & Justification

**Backend: Spring Boot over .NET** — chosen for ecosystem maturity around the exact requirements here: Spring Security's `@PreAuthorize` gives clean declarative RBAC, Spring Data JPA + Specifications handle dynamic filtering/pagination without hand-rolled SQL, and Flyway integrates natively via `spring-boot-starter`. JJWT for token handling is a stable, widely-used library with no licensing friction.

**Frontend: React + MUI** — MUI was chosen over Tailwind/Ant for this specifically because the brief calls for a lot of structured data UI (tables, forms, dialogs, paginated lists) where a component library with built-in `Table`, `TablePagination`, `Dialog`, and form primitives meaningfully reduces boilerplate versus utility-first CSS.

**Database: PostgreSQL + Flyway** — native enum types (`user_role`, `leave_type`, `leave_status`) enforce valid states at the schema level, not just in application code. Flyway migrations are version-controlled, sequential, and re-run deterministically — required for the "DB migrations" deliverable.

**Auth: JWT access (15 min) + refresh (7 day), refresh tokens stored hashed (SHA-256) server-side** — this makes refresh tokens revocable (logout actually invalidates them, unlike a pure stateless JWT scheme) while keeping the access token fully stateless for fast request validation.

---

## Quick Start

**Prerequisites:** Docker Desktop installed and running. Nothing else required — Java, Maven, Node, and PostgreSQL all run inside containers.

```bash
git clone https://github.com/ArjunRathinam-Techbuddy/employee-management-portal.git
cd employee-management-portal
docker compose up --build
```

First run takes 5–10 minutes (downloading base images + compiling). Subsequent runs are much faster due to Docker layer caching.

Once started:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **PostgreSQL:** localhost:5432 (`employee_portal` / `emp_user` / `emp_pass`)

To stop:
```bash
docker compose down
```

To stop and wipe the database (forces migrations + seed data to re-run from scratch):
```bash
docker compose down -v
```

### Frontend dependency note
If you modify `frontend/package.json` (e.g. adding a library), run `npm install` inside `frontend/` once before `docker compose up --build` — Docker's build uses `npm ci`, which requires `package-lock.json` to already be in sync.

---

## Seed Data / Default Logins

Seed data (Flyway `V5__seed_data.sql`) creates 1 admin + 10 employees across 3 departments on first startup.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@company.com` | `Admin@123` |
| Employee (any of 10) | e.g. `alice@company.com` | `Employee@1` |

Departments: Engineering, Human Resources, Sales — each with a department head and a manager hierarchy already assigned.

---

## Project Structure

```
employee-portal/
├── docker-compose.yml
├── backend/                          (Spring Boot)
│   └── src/main/java/com/employeeportal/
│       ├── controller/   — REST endpoints
│       ├── service/      — business logic, validation rules
│       ├── repository/   — Spring Data JPA + Specifications
│       ├── entity/       — JPA entities
│       ├── dto/           — request/response records
│       ├── security/     — JWT filter, UserDetails, access guards
│       ├── aspect/       — AOP-based audit logging
│       ├── config/       — Security config, request logging filter
│       └── exception/    — global exception handler
│   └── src/main/resources/db/migration/   — Flyway V1–V7
└── frontend/                          (React + Vite + MUI)
    └── src/
        ├── pages/        — route-level screens
        ├── components/   — reusable UI pieces, grouped by feature
        ├── services/     — Axios API clients
        ├── context/       — AuthContext (JWT session state)
        └── hooks/         — useAuth
```

76 backend Java files, 50 frontend JS/JSX files, 7 versioned migrations.

---

## Database Schema

| Table | Purpose | Key constraints |
|---|---|---|
| `users` | Login credentials, role, lockout state | `email` unique; `role` native enum (ADMIN/EMPLOYEE) |
| `employees` | Employee records | `employee_code` unique, auto-generated; self-referencing `manager_id`; `salary > 0` CHECK; `manager_id != id` CHECK |
| `departments` | Org departments | `name` unique; `head_employee_id` FK to employees |
| `leave_requests` | Leave applications | `status` native enum; `end_date >= start_date` and `duration <= 30 days` CHECK constraints |
| `audit_logs` | Append-only action trail | indexed on `user_id`, `created_at`, `(entity_type, entity_id)` |
| `refresh_tokens` | Hashed refresh tokens | enables logout/revocation (not in original spec table list — added because stateless-only JWT can't support real logout) |

Indexes: `users.email`, `employees.employee_code`, `employees.department_id`, `employees.manager_id`, `leave_requests.status`, `audit_logs(user_id, created_at)` — all present per spec requirement.

---

## API Reference

All endpoints are prefixed `/api`. Protected endpoints require `Authorization: Bearer <accessToken>`.

### Auth
| Method | Path | Access |
|---|---|---|
| POST | `/auth/login` | public |
| POST | `/auth/refresh` | public |
| POST | `/auth/logout` | public |
| GET | `/auth/me` | authenticated |

### Self-Service
| Method | Path | Access |
|---|---|---|
| GET | `/me/profile` | authenticated |
| PUT | `/me/profile` | authenticated (phone/address only) |
| POST | `/leaves` | authenticated |
| GET | `/leaves/my` | authenticated |
| POST | `/leaves/{id}/cancel` | owner or admin |

### Employees (Admin)
| Method | Path |
|---|---|
| GET | `/employees` (paginated, filterable: `departmentId`, `designation`, `active`, `search`) |
| GET | `/employees/{id}` |
| POST | `/employees` |
| PUT | `/employees/{id}` |
| DELETE | `/employees/{id}` (soft delete) |
| POST | `/employees/{id}/reactivate` |
| GET | `/employees/{id}/leave-history` |

### Departments
| Method | Path | Access |
|---|---|---|
| GET | `/departments` | authenticated |
| GET | `/departments/{id}` | authenticated |
| POST `/PUT`/`DELETE` | `/departments` | admin |

### Leave Management (Admin)
| Method | Path |
|---|---|
| GET | `/leaves` (filter, paginate) |
| POST | `/leaves/{id}/approve` |
| POST | `/leaves/{id}/reject` |

### Reports (Admin)
`/reports/headcount` · `/reports/salary-stats` · `/reports/salary-band` · `/reports/leave-summary` · `/reports/new-joiners?from=&to=` · `/reports/upcoming-leaves?days=`

### Audit
`GET /audit-logs` (filter by `entityType`, `userId`, `from`, `to`; paginated)

**Paginated response envelope:**
```json
{ "data": [...], "page": 0, "size": 10, "totalElements": 247, "totalPages": 25 }
```

**Error envelope:**
```json
{ "status": 422, "error": "VALIDATION_ERROR", "message": "...", "timestamp": "2026-06-21T10:00:00Z", "path": "/api/employees" }
```

---

## Business Rules Implemented

- Employee code auto-generated (`EMP001…`), never editable post-creation
- Salary must be positive (DB CHECK + service-layer validation)
- Employee cannot be their own manager (DB CHECK + service-layer validation)
- Department head must be an active employee of that department
- Soft-deleting an employee revokes their login (`users.is_active = false`) and auto-rejects their pending leave requests
- Leave: no overlapping PENDING/APPROVED requests, future-dated only, max 30 consecutive days, only PENDING requests cancellable
- Account lockout after 5 failed login attempts (15-minute lock)
- Department deletion blocked if any **active** employee is still assigned
- Every state-changing action (create/update/delete/approve/reject/login/logout) is recorded in `audit_logs` via an AOP aspect — no service method manually writes audit entries
- Every HTTP request is logged as a structured JSON line (method, path, status, duration, user ID)

---

## curl Examples

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin@123"}'
```

**List employees (paginated, with token):**
```bash
curl http://localhost:8080/api/employees?page=0&size=10 \
  -H "Authorization: Bearer <accessToken>"
```

**Create a leave request:**
```bash
curl -X POST http://localhost:8080/api/leaves \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"leaveType":"CASUAL","startDate":"2026-08-01","endDate":"2026-08-03","reason":"Family event"}'
```

**Refresh token:**
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

A full Postman collection covering every endpoint is included: `Employee-Portal.postman_collection.json`.

---

## Known Limitations & Deliberate Deviations

Documented honestly rather than hidden — these are conscious tradeoffs given the project scope, not oversights:

- **Leave status includes a 4th `CANCELLED` value** beyond the original PENDING/APPROVED/REJECTED set. Cancelling a leave request changes its status rather than deleting the row, preserving the audit trail ("audit every state-changing action" would be unsatisfiable for a hard-deleted record). Considered the stronger engineering choice over spec-literal compliance.
- **Audit log `old_value` is not yet populated** — `new_value` (full post-state snapshot) is captured for every action via AOP; true before/after diffs would require a pre-fetch-by-ID step in the aspect, which was judged unnecessary complexity for current scope. Straightforward to add if needed.
- **"Welcome email" on employee creation is a structured console log line**, not an actual sent email — no mail infrastructure was in scope for this assignment.
- **Manager/department-head selection in the UI is a raw numeric Employee ID input**, not a searchable autocomplete picker — functional but not polished; flagged as a UX shortcut under time constraints.
- **CSV export fetches the full filtered result set in one request** (`size=10000`) rather than streaming — acceptable at this dataset scale, would need revisiting for a much larger org.
- **No automated test suite** — all verification was manual (Docker run, login, click-through of all 8 screens). Given more time, would prioritize unit tests on the leave-overlap and salary/manager validation rules first, per the bonus criteria.

---

## Tech Decisions Worth Knowing

- **Native Postgres enums** (`user_role`, `leave_type`, `leave_status`) are mapped via Hibernate's `@JdbcTypeCode(SqlTypes.NAMED_ENUM)` — without this, Hibernate sends enum values as plain strings and Postgres rejects the implicit cast on UPDATE statements.
- **Refresh tokens are stored as SHA-256 hashes**, never in plaintext, and rotated on every use (old token revoked, new one issued) — limits the blast radius of a leaked refresh token.
- **Audit writes run in `REQUIRES_NEW` transactions**, isolated from the business transaction they're logging — an audit-write failure never blocks or rolls back the actual operation.
