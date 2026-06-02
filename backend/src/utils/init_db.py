import asyncio
from src.db import async_engine
from src.model import Base, Player, HistoricalPlayer, HistoricalPlayerSeasonData

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database successfully initialized.")

if __name__ == "__main__":
    asyncio.run(init_db())