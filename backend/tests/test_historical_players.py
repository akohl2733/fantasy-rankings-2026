from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from .conftest import test_session, get_allen_basic, get_allen_season_data
from src.model import HistoricalPlayer, HistoricalPlayerSeasonData


async def test_add_historical_player(
        test_session: AsyncSession, 
        get_allen_basic: HistoricalPlayer, 
        get_allen_season_data: list[HistoricalPlayerSeasonData]
):
    # add player to HistoricalPlayer table
    player_info = get_allen_basic
    player_objs = {}
    key = f'{player_info.name}_{player_info.position}'
    if key not in player_objs:
        test_session.add(player_info)
        player_objs[key] = player_info
    await test_session.flush()
    

    # add season data to HistoricalPlayerSeasonData table
    player_season_data = get_allen_season_data
    for season_data in player_season_data:

        name, position = season_data["player_display_name"], season_data["position"]
        lookup_str = f"{name}_{position}"
        fk_player = player_objs.get(lookup_str)
        if fk_player is None:
            continue

        player_season_data = HistoricalPlayerSeasonData(
            player_id = fk_player.id,
            season=season_data["season"],
            team=season_data["recent_team"],

            targets=season_data["targets"],
            target_share=season_data["target_share"],
            receptions=season_data["receptions"],
            receiving_yards=season_data["receiving_yards"],
            receiving_tds=season_data["receiving_tds"],

            carries=season_data["carries"],
            rushing_yards=season_data["rushing_yards"],
            rushing_tds=season_data["rushing_tds"],

            passing_yards=season_data["passing_yards"],
            passing_tds=season_data["passing_tds"],

            turnovers=season_data["turnovers"],

            points_per_game=season_data["hppr_points_per_game"],
            total_points=season_data["fantasy_points_hppr"],
            rank_ppg=season_data["rank_ppg"],
            rank_total=season_data["rank_total"],
            position_tier=season_data["position_tier"],
        )
        test_session.add(player_season_data)
        
    await test_session.flush()

    results = await test_session.execute(select(HistoricalPlayer).options(selectinload(HistoricalPlayer.season_data)))
    player = results.scalars().all()

    assert len(player) > 0