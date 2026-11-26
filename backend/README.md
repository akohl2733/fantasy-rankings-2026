# Fantasy Rankings Backend

FastAPI backend for serving 2026 fantasy football draft rankings and 2016–2025 historical NFL player season statistics from PostgreSQL.

## Tech Stack

- **Framework**: FastAPI + Uvicorn
- **ORM / DB**: SQLAlchemy 2.0 (async) with `asyncpg` + PostgreSQL 15
- **Validation**: Pydantic v2
- **Auth**: Clerk JWT verification via `fastapi-clerk-auth`
- **Data Processing**: Pandas + PyArrow (`.parquet` and `.csv` ingestion)
- **Dependency Management**: Poetry (Python `>=3.12`)
- **Testing**: `pytest` + `pytest-asyncio` (with `aiosqlite` in tests)

## Project Structure

```text
backend/
├── data/
│   └── files/
│       └── fantasy-rankings-08-26.csv   # Personal 2026 draft rankings source
├── src/
│   ├── db.py                            # Async SQLAlchemy engine & session factory
│   ├── main.py                          # FastAPI app, CORS, Clerk auth, and routes
│   ├── model.py                         # ORM models (Player, HistoricalPlayer, HistoricalPlayerSeasonData)
│   ├── schema.py                        # Pydantic response models
│   └── utils/
│       ├── data/                        # stats_player_reg_2016..2025.parquet
│       ├── init_db.py                   # Creates tables from SQLAlchemy metadata
│       ├── fill_historical.py           # Ingests 2016–2025 parquet stats
│       ├── fill_personal_rankings.py    # Ingests CSV rankings & links historical profiles
│       ├── nfl_data.py                  # DataFrame transformation helpers
│       └── nfl_data_wb.ipynb            # Exploratory data notebook
├── tests/
│   ├── conftest.py
│   ├── test_historical_players.py
│   └── test_personal_rankings.py
├── Dockerfile
└── pyproject.toml
```

## Local Development

From `backend/`:

```bash
# Install dependencies
poetry install

# Run the API server with hot reload (ensure DB_HOST=localhost in .env if Postgres is in Docker)
poetry run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### Database Initialization & Seeding

Run in order after PostgreSQL is up:

```bash
poetry run python -m src.utils.init_db
poetry run python -m src.utils.fill_historical
poetry run python -m src.utils.fill_personal_rankings
```

> `fill_personal_rankings.py` links each ranked player to `historical_player` by matching `{Name}_{Position}`, so `fill_historical.py` should be run first.

### Running Tests

```bash
poetry run pytest
```

## API Endpoints

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Clerk Bearer | Auth check; returns decoded JWT claims |
| `GET` | `/players` | Clerk Bearer | All ranked players ordered by `rank` asc, with nested `historical_profile` |
| `GET` | `/players/{rank}` | Public | Single player by overall rank with historical data |
| `GET` | `/search_results?name=` | Public | Case-insensitive partial name search (`ilike`) |
| `GET` | `/historical` | Public | All historical players and their season stats |
| `GET` | `/historical/{year}` | Public | Historical players for `2023`, `2024`, or `2025`, sorted by `points_per_game` desc |

## Database Models

- **`Player` (`all_players`)**: `rank`, `name`, `position`, `position_rank`, `team`, projected stats (`receptions`, `receiving_yards`, `receiving_tds`, `rushing_yards`, `rushing_tds`, `passing_yards`, `passing_tds`, `turnovers`, `total_points`), `tier`, and optional `historical_player_id` FK.
- **`HistoricalPlayer` (`historical_player`)**: `name`, `position`, `headshot_url`, and one-to-many `data` ordered by `season` desc.
- **`HistoricalPlayerSeasonData` (`historical_player_season_data`)**: Per-season stats (`targets`, `target_share`, `receptions`, rushing/receiving/passing stats, `points_per_game`, `total_points`, `rank_ppg`, `rank_total`, `position_tier`), unique on `(player_id, season)`.
