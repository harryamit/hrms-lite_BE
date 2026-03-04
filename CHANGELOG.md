# Changelog

## [1.1.0] – API improvements

### Added
- **Error format**: All errors now return `{ message, code?, errors? }`. Use `code` for client handling (e.g. `EMPLOYEE_ID_EXISTS`, `VALIDATION`).
- **List responses**: List endpoints return `{ data: T[], total }` for future pagination.
- **GET /api/employees/:id**: Fetch a single employee by `_id`.
- **PATCH /api/employees/:id**: Update employee (fullName, email, department). Requires auth when `REQUIRE_AUTH=true`.
- **GET /api/attendance?date=YYYY-MM-DD**: Filter attendance by date.
- **Health**: `GET /health` and `GET /api/health` for load balancers/monitoring. Response includes `status`, `db`, `timestamp`.
- **Request ID**: `x-request-id` header on responses and in logs for 4xx/5xx.
- **Rate limiting**: General (100/min) and stricter for POST/PATCH/DELETE (30/min). Returns `RATE_LIMIT_EXCEEDED` when exceeded.
- **Auth**: Optional JWT auth via `Authorization: Bearer <token>`. Set `REQUIRE_AUTH=true` and `JWT_SECRET`. Delete employee restricted to roles `admin` or `hr` when auth is required.
- **Validation**: employeeId format (EMP + digits); valid YYYY-MM-DD date; attendance requires existing employee. Search query min 2 chars, max 100.
- **Attendance upsert**: POST attendance with same (employeeId, date) updates existing record (200) instead of duplicate error.
- **Indexes**: employees (department); attendance (employeeId, date, compound unique).
- **OpenAPI**: `openapi.yaml` for paths, query params, and body/response shapes.

### Changed
- **DELETE /api/employees/:id**: Soft delete only. Sets `deletedAt` on the employee; document remains in DB but is excluded from list, get, dashboard count, and attendance checks. Returns 204 on success, 404 if not found.
- **Employees list**: Response shape is now `{ data: Employee[], total }` instead of a bare array.
- **Attendance list**: Response shape is now `{ data: Attendance[], total }` instead of a bare array.
- **Dashboard**: `todayPresentCount` uses server date (documented). No response change.
- **CORS**: Added `PATCH` to allowed methods.

### Security
- CORS uses `FRONTEND_ORIGIN` (no `*` in production).
- Rate limiting and optional JWT documented in README.
