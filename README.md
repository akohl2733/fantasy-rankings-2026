# Fantasy Rankings 2026

Full-stack fantasy football rankings and historical player stats application built with **Next.js 16**, **FastAPI**, **PostgreSQL**, and **Clerk** authentication.

## Architecture

```text
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│   Frontend (3000)   │──────▶│   Backend (8000)    │──────▶│   PostgreSQL (5432) │
│  Next.js 16 / React │       │  FastAPI / Async    │       │     postgres:15     │
│  Clerk Auth + UI    │       │  SQLAlchemy + Clerk │       │   all_players &     │
└─────────────────────┘       └─────────────────────┘       │  historical_player  │
                                                            └─────────────────────┘
```

- **Frontend (`frontend/`)**: Next.js App Router (React 19, TypeScript, Tailwind CSS v4) with Clerk auth and optional Azure Application Insights telemetry. See [frontend/README.md](./frontend/README.md).
- **Backend (`backend/`)**: FastAPI + async SQLAlchemy (`asyncpg`) serving personal draft rankings and 2016–2025 historical NFL player stats. See [backend/README.md](./backend/README.md).
- **Database (`db`)**: PostgreSQL 15 container with persistent volume `postgres_data`.
- **Reverse Proxy (`nginx.conf`)**: Nginx config for routing `/` to `frontend:3000` and `/api/` to `backend:8000` (currently commented out in `docker-compose.yml`).
- **Analytics (`databricks/`)**: Exploratory notebook (`total_career_ppg.ipynb`).

## Repository Structure

```text
.
├── backend/                # FastAPI app, SQLAlchemy models, data seeding, pytest suite
├── frontend/               # Next.js 16 App Router UI, Clerk middleware, API client
├── databricks/             # Databricks analytics notebooks
├── certbot/                # TLS certs directory for Nginx
├── docker-compose.yml      # Local multi-container orchestration (db, backend, frontend)
├── nginx.conf              # Reverse proxy configuration
└── TODO.md                 # Planned features and roadmap
```

## Getting Started (Docker Compose)

### 1. Environment Variables

Ensure a `.env` file exists at the repository root with the following variables:

```env
# PostgreSQL
DB_HOST=db
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Frontend -> Backend URL (use http://backend:8000 inside Docker or http://localhost:8000 locally)
BACKEND_URL=http://backend:8000
```

> **Note:** When running the backend outside Docker, set `DB_HOST=localhost`. Also check `clerk_config` in `backend/src/main.py` if you switch Clerk instances.

### 2. Start Services

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- FastAPI Docs: http://localhost:8000/docs

### 3. Initialize & Seed the Database

Run these commands inside the `backend` container (or locally from `backend/` with Poetry) in order:

```bash
# 1. Create database tables
docker compose exec backend python -m src.utils.init_db

# 2. Load 2016–2025 historical player stats from parquet files
docker compose exec backend python -m src.utils.fill_historical

# 3. Load 2026 personal rankings CSV and link to historical players
docker compose exec backend python -m src.utils.fill_personal_rankings
```

## Roadmap

See [TODO.md](./TODO.md) for upcoming work, including draft analyzer strategies (Hero RB, Zero RB, Early QB/TE), player age data, ECR comparisons, and weekly blog content.
