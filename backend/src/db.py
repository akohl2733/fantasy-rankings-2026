import os
import sys
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession

# config postgres DB
load_dotenv()
DB_URL = os.getenv("DB_URL")
if not DB_URL:
    if "pytest" in sys.modules:
        DB_URL = "sqlite+aiosqlite:///:memory:"
    else:
        raise RuntimeError("DB_URL environment variable is not set")

# use async session
async_engine = create_async_engine(DB_URL)
async_session_factory = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_async_session() -> AsyncSession:
    async with async_session_factory() as session:
        yield session