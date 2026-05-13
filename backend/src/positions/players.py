import os
from model import all_players_core
from schema import PlayerModel
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

router = APIRouter()

curr_working_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.abspath(os.path.join(curr_working_dir, "../..", "data", "player.db"))

async_engine = create_async_engine(f'sqlite+aiosqlite:///{db_path}')
async_session_factory = async_sessionmaker(async_engine)

async def get_session() -> AsyncSession:
    async with async_session_factory() as session:
        yield session

@router.post("/add_player")
async def post_new_player(player: PlayerModel, session=Depends(get_session)):
    insert_stmt = (
        all_players_core.insert().values(
            rank=player.rank,
            name=player.name,
            position=player.position,
            position_rank=player.position_rank,
            team=player.team,
            receptions=player.receptions,
            receiving_yards=player.receiving_yards,
            receiving_tds=player.receiving_tds,
            rushing_yards=player.rushing_yards,
            rushing_tds=player.rushing_tds,
            passing_yards=player.passing_yards,
            passing_tds=player.passing_tds,
            turnovers=player.turnovers,
            total_points=player.total_points,
            tier=player.tier,
        ).returning(*all_players_core.c)
    )

    try:
        result = await session.execute(insert_stmt)
        await session.commit()
        row = result.fetchone()
        print(row)
    except Exception as e:
        print(f"There was an error {e}")
        raise
