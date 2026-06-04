from sqlalchemy import select

from .conftest import test_session, engine, async_session_factory
from src.model import Player
from src.schema import PlayerModel


# TODO - make this a dict
async def test_add_player(test_session):
    player = (
        1,
        "Jahmyr Gibbs",
        "RB",
        1,
        "Detroit Lions",
        70,
        500,
        5,
        1235,
        14,
        0,
        0,
        6,
        1
    )

    print(player)

    async with async_session_factory() as session:
        try:
            await session.add(player)
            players = await session.execute(select(Player))
            length = len(players.scalars().all())
            await session.commit()
        except:
            await session.rollback()

    assert length == 1