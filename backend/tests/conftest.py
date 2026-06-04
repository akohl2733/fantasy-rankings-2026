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

        