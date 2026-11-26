from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession

from .conftest import test_session, get_gibbs
from src.model import Player


async def test_add_player(test_session: AsyncSession, get_gibbs: Player):

    length = 0
    gibbs = get_gibbs

    test_session.add(gibbs)
    await test_session.commit()

    result = await test_session.execute(select(Player))
    length = len(result.scalars().all())

    assert length == 1
