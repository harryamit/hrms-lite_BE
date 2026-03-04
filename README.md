# HRMS Lite

Employee and attendance management frontend (React + Vite).

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your API URL
npm run dev
```

## Production

### API URL

The app talks to the backend API. Allowed API IP ranges:

- **74.220.48.0/24** (e.g. `74.220.48.1`)
- **74.220.56.0/24** (e.g. `74.220.56.1`)

Set the API base URL via environment:

```bash
cp .env.production.example .env.production
# Edit .env.production:
# VITE_API_BASE_URL=https://74.220.48.1/api
```

If `VITE_API_BASE_URL` is not set in production, the build defaults to `https://74.220.48.1/api`.

### Build and preview

```bash
npm run build
npm run preview
```

Serve the `dist/` folder with any static host (Nginx, S3, Vercel, etc.). Ensure your API server allows CORS from the frontend origin and is reachable at the configured URL.

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `https://74.220.48.1/api`) |
