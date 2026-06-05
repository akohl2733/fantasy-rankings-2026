import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from src.main import app
from src.model import Base, Player, HistoricalPlayer, HistoricalPlayerSeasonData
from src.db import get_async_session

# in memory DB for faster DB transactions
DB_URI = 'sqlite+aiosqlite:///:memory:'
# create and async_engine for this test db
engine = create_async_engine(DB_URI)
# create a factory to create async sessions with this engine
async_session_factory = async_sessionmaker(autocommit=False, bind=engine, expire_on_commit=False)    

#### should yield this test_session in api calls instead of get_async_session
@pytest.fixture(scope="function")
async def test_session():
    # create a connection that will only commit if both succeed
    async with engine.begin() as conn:
        # use synchronous Base.metadata.drop_all/create_all to reset the database
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    # create an asynchronous session object
    async with async_session_factory() as session:
        # override existing session object used in app to source endpoints
        app.dependency_overrides[get_async_session] = lambda: session
        # yield session to use
        yield session
        # once done, rollback any changes
        await session.rollback()

    # clear the override that was modified
    app.dependency_overrides.clear()
    
    # run another begin command end to end
    async with engine.begin() as conn:
        # drop the tables from the database - NOTE: technically not needed because this is in memory
        await conn.run_sync(Base.metadata.drop_all)

        
@pytest.fixture(scope='function')
def get_gibbs() -> Player:
    player1 = Player(
        rank=1,
        name="Jahmyr Gibbs",
        position="RB",
        position_rank=1,
        team="Detroit Lions",
        receptions=70,
        receiving_yards=500,
        receiving_tds=5,
        rushing_yards=1235,
        rushing_tds=14,
        passing_tds=0,
        passing_yards=0,
        turnovers=6,
        tier=1,
        total_points=250,
        historical_player_id=1
    )

    return player1


@pytest.fixture(scope="function")
def get_allen_basic() -> HistoricalPlayer:
    allen = HistoricalPlayer(name="Josh Allen", position="QB", headshot_url="https://static.www.nfl.com/image/upload/f_auto,q_auto/league/servs1fpsynfxep4rz2z")
    return allen


@pytest.fixture(scope="function")
def get_allen_season_data() -> list[HistoricalPlayerSeasonData]:
    data = [
      {
        "player_display_name": "Josh Allen",
        "position": "QB",
        "season": 2025,
        "recent_team": "BUF",
        "targets": 0,
        "target_share": 0,
        "receptions": 0,
        "receiving_yards": 0,
        "receiving_tds": 0,
        "carries": 112,
        "rushing_yards": 579,
        "rushing_tds": 14,
        "passing_yards": 3668,
        "passing_tds": 25,
        "turnovers": 13,
        "hppr_points_per_game": 22.78875,
        "fantasy_points_hppr": 364.62,
        "rank_ppg": 1,
        "rank_total": 1,
        "position_tier": 1
      },
      {
        "player_display_name": "Josh Allen",
        "position": "QB",
        "season": 2024,
        "recent_team": "BUF",
        "targets": 0,
        "target_share": 0,
        "receptions": 0,
        "receiving_yards": 7,
        "receiving_tds": 1,
        "carries": 102,
        "rushing_yards": 531,
        "rushing_tds": 12,
        "passing_yards": 3731,
        "passing_tds": 28,
        "turnovers": 8,
        "hppr_points_per_game": 23.69,
        "fantasy_points_hppr": 379.04,
        "rank_ppg": 2,
        "rank_total": 2,
        "position_tier": 1
      },
      {
        "player_display_name": "Josh Allen",
        "position": "QB",
        "season": 2023,
        "recent_team": "BUF",
        "targets": 0,
        "target_share": 0,
        "receptions": 0,
        "receiving_yards": 0,
        "receiving_tds": 0,
        "carries": 111,
        "rushing_yards": 524,
        "rushing_tds": 15,
        "passing_yards": 4306,
        "passing_tds": 29,
        "turnovers": 22,
        "hppr_points_per_game": 23.09647058823529,
        "fantasy_points_hppr": 392.64,
        "rank_ppg": 2,
        "rank_total": 1,
        "position_tier": 1
      }
    ]
    return data