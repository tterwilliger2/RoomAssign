## Room Wizard

Assign members to rooms via CP-SAT optimization, then refine on a drag-and-drop blueprint. Built for annual handoff and transparency.

### Monorepo
- `backend/` FastAPI + SQLModel + Pandas + OR-Tools
- `frontend/` React + Vite + TypeScript + Tailwind + dnd-kit

### Quick start
1. Copy `.env.example` to `.env`.
2. Install and run both services:
```
make dev
```
Backend at `http://localhost:8000` (OpenAPI at `/docs`) and frontend at `http://localhost:5173`.

### Docker Compose
```
docker-compose up --build
```

### Scripts
- `make install` bootstrap deps
- `make backend` run backend only
- `make frontend` run frontend only
- `make test` backend tests (pytest)

### Migration guide (for next chair)
1) Upload CSV → on Upload page. A sample is in frontend `public/sample_data/members_example.csv`.
2) Configure rooms → set counts by size, toggle empty-bed budget.
3) Run optimizer → see score and warnings.
4) Blueprint → drag members between rooms; staging zone holds unassigned.
5) Export → download CSV/JSON/PDF; keep audit logs.

Notes
- Admin login is seeded from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- Tuning weights and constraints is available in config; hard pairs are enforced.
