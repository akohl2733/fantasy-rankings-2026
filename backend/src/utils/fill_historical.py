import asyncio
import os

BASE_URL = os.path.dirname(os.path.abspath(__file__))

import pandas as pd
from sqlalchemy import select
from src.db import async_session_factory
from src.model import HistoricalPlayer, HistoricalPlayerSeasonData
from src.utils.nfl_data import return_positional_dfs


# adds all historical parquet files to historical_player_data table
async def input_historical_data(seasons: list[int]):
    player_objects = {} # created to hold player objects
    
    try:
        async with async_session_factory() as session:
            existing_res = await session.execute(select(HistoricalPlayer))
            for p in existing_res.scalars().all():
                player_objects[f"{p.name}_{p.position}"] = p
    except Exception:
        pass

    for szn in seasons:
        df = pd.read_parquet(os.path.join(BASE_URL, f"./data/stats_player_reg_{szn}.parquet"))
        unified_df = return_positional_dfs(df)  # returns df with new columns

        try:
            async with async_session_factory() as session:
                for idx, row in unified_df.iterrows():
                    print(f"Player DB Executiion {idx}")
                    key = f"{row["player_display_name"]}_{row["position"]}"
                    if key not in player_objects:
                        player = HistoricalPlayer(name=row["player_display_name"], position=row["position"], headshot_url=row["headshot_url"])

                        # add both to database and list of players to create dictionary later
                        session.add(player)
                        player_objects[key] = player

                await session.flush()
                print("Historical Player table flushed with player info 🫡")
                
                # create player_lookup for next loop afterwards
                db_result = await session.execute(select(HistoricalPlayer))
                all_db_players = db_result.scalars().all()

                player_lookup = {f"{p.name}_{p.position}": p.id for p in all_db_players}

                # now loop through the seasons
                for idx, row in unified_df.iterrows():
                    print(f"Execution of historical data #{idx}")
                    name, position = row["player_display_name"], row["position"]
                    key = f'{name}_{position}'
                    if key is not None:
                        foreignKeyLookup = player_lookup.get(key)
                    if foreignKeyLookup is None:
                        print(f"Season skipped for: {name} - {position}")
                        continue
                    player_season_data = HistoricalPlayerSeasonData(
                        player_id = foreignKeyLookup,
                        season=row["season"],
                        team=row["recent_team"],

                        targets=row["targets"],
                        target_share=row["target_share"],
                        receptions=row["receptions"],
                        receiving_yards=row["receiving_yards"],
                        receiving_tds=row["receiving_tds"],

                        carries=row["carries"],
                        rushing_yards=row["rushing_yards"],
                        rushing_tds=row["rushing_tds"],

                        passing_yards=row["passing_yards"],
                        passing_tds=row["passing_tds"],

                        turnovers=row["turnovers"],

                        points_per_game=row["hppr_points_per_game"],
                        total_points=row["fantasy_points_hppr"],
                        rank_ppg=row["rank_ppg"],
                        rank_total=row["rank_total"],
                        position_tier=row["position_tier"],
                    )
                    session.add(player_season_data)
                await session.commit()
                print("Historical Player Season Data table successfully updated 🫡")
        except Exception as e:
            await session.rollback()
            raise Exception("There as an issue:", e)
        finally:
            print("Session is wraps.")


if __name__ == "__main__":
    asyncio.run(input_historical_data([2023, 2024, 2025]))
    print("Success 😎")