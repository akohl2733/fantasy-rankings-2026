import asyncio
import os

BASE_URL = os.path.dirname(os.path.abspath(__file__))

import pandas as pd
from src.db import async_session_factory
from src.model import HistoricalPlayer
from src.utils.nfl_data import return_positional_dfs


# adds all historical parquet files to historical_player_data table
async def input_historical_data(seasons: list[int]):
    for szn in seasons:
        df = pd.read_parquet(os.path.join(BASE_URL, f"./data/stats_player_reg_{szn}.parquet"))
        unified_df = return_positional_dfs(df)  # returns df with new columns
        try:
            async with async_session_factory() as session:
                for idx, row in unified_df.iterrows():
                    print(f"Execution #{idx}")
                    session.add(
                        HistoricalPlayer(
                            rank_ppg=row["rank_ppg"],
                            rank_total=row["rank_total"],
                            name=row["player_display_name"],
                            position=row["position"],
                            season=row["season"],
                            team=row["recent_team"],
                            receptions=row["receptions"],
                            receiving_yards=row["receiving_yards"],
                            receiving_tds=row["receiving_tds"],
                            rushing_yards=row["rushing_yards"],
                            rushing_tds=row["rushing_tds"],
                            passing_yards=row["passing_yards"],
                            passing_tds=row["passing_tds"],
                            turnovers=row["turnovers"],
                            points_per_game=row["hppr_points_per_game"],
                            total_points=row["fantasy_points_hppr"],
                            position_tier=row["position_tier"],
                        )
                    )
                await session.commit()
        except Exception as e:
            await session.rollback()
            raise Exception("There as an issue:", e)
        finally:
            print("Historical data successfully loaded 🫡")


# if __name__ == "__main__":
#     asyncio.run(input_historical_data([2023, 2024, 2025]))
#     print("Success 😎")