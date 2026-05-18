import asyncio
from db import async_engine
from model import Base, Player

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database successfully initialized.")

if __name__ == "__main__":
    asyncio.run(init_db())