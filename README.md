# HRMS Lite API

REST API for HRMS Lite (TypeScript + Express + MongoDB). Matches the frontend contract for employees, attendance, and dashboard stats.

## Setup

1. **MongoDB**  
   Ensure MongoDB is running locally, or set `MONGODB_URI` to your connection string.

2. **Environment**  
   Copy `.env.example` to `.env` and adjust if needed:
   - `PORT` – server port (default: 3001)
   - `MONGODB_URI` – MongoDB connection string (default: `mongodb://localhost:27017/hrms-lite`)
   - `FRONTEND_ORIGIN` – CORS origin (default: `http://localhost:5173`). In production, set to your frontend origin (not `*`).
   - `REQUIRE_AUTH` – set to `true` to enable JWT auth for PATCH/DELETE (default: false)
   - `JWT_SECRET` – secret for verifying JWTs (required when `REQUIRE_AUTH=true`)

3. **Install and run**
   ```bash
   npm install
   npm run dev    # development (ts-node-dev)
   # or
   npm run build && npm start
   ```

Base URL: `http://localhost:3001/api`

## Endpoints

- **Employees:** `GET /api/employees` (optional `?search=`), `GET /api/employees/:id`, `POST /api/employees`, `PATCH /api/employees/:id`, `DELETE /api/employees/:id`
- **Attendance:** `GET /api/attendance?employeeId=...&date=YYYY-MM-DD`, `POST /api/attendance`
- **Dashboard:** `GET /api/dashboard/stats` (server date used for “today”)
- **Health:** `GET /health` or `GET /api/health`

List responses use a wrapper: `{ data: T[], total }`. Errors use `{ message, code?, errors? }` with appropriate 4xx/5xx.

## Auth (optional)

When `REQUIRE_AUTH=true`, send `Authorization: Bearer <JWT>`. JWT payload can include `sub` and `role`. `DELETE /api/employees/:id` requires `role` `admin` or `hr`. See `openapi.yaml` and `CHANGELOG.md` for details.

## Rate limiting

- General: 100 requests/minute per IP.
- Create/update/delete: 30 requests/minute per IP. Responses include `Retry-After` when limited.

## API docs

OpenAPI 3 spec: `openapi.yaml`. Use it for client generation or Swagger UI. Changelog: `CHANGELOG.md`.
