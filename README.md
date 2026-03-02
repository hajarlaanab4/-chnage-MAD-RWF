# Exchange MAD ⇄ RWF

A full-stack currency exchange app with:

- **Frontend**: React + Vite (`frontend/`)
- **Backend**: ASP.NET Core Web API + SQLite (`backend/`)

## Project Structure

- `frontend/` → UI, routes, screens, API calls
- `backend/` → REST API, auth, user profile, data models
- `backend/ApplicationEchange.sln` → Backend solution file

## Quick Start

### 1) Run backend

```bash
cd backend
dotnet run
```

Backend runs on `http://localhost:5229`.

### 2) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite local URL (typically `http://localhost:5173`).

## Notes

- Backend is organized under `backend/` as requested.
- Development currently recreates SQLite schema on startup.

---

Thanks to **defaltastra** for the work.
