import os

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession

curr_working_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.abspath(os.path.join(curr_working_dir, "..", "data", "player.db"))

# use async session
async_engine = create_async_engine(f'sqlite+aiosqlite:///{db_path}')
async_session_factory = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_async_session() -> AsyncSession:
    async with async_session_factory() as session:
        yield session