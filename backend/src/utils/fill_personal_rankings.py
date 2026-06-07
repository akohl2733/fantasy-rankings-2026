import asyncio
import os
from sqlalchemy import select

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
csv_file = os.path.join(BASE_DIR, "data/files/fantasy-rankings-06-26.csv")

import pandas as pd
from src.db import async_session_factory
from src.model import Player, HistoricalPlayer

df = pd.read_csv(csv_file)

async def populate_players():

    try:
        async with async_session_factory() as session:

            historical_res = await session.execute(select(HistoricalPlayer))
            all_historical = historical_res.scalars().all()

            historical_lookup = {
                f"{p.name}_{p.position}": p.id for p in all_historical
            }

            for idx, row in df.iterrows():
                print(idx)
                lookup_str = f"{row["Name"]}_{row["Position"]}"
                fk_historical = historical_lookup.get(lookup_str)
                if fk_historical is None:
                    print(lookup_str)
                session.add(
                    Player(
                        rank=row["Overall Rank"],
                        name=row["Name"],
                        position=row["Position"],
                        position_rank=row["Position Rank"],
                        team=row["Team"],
                        receptions=row["Receptions"],
                        receiving_yards=row["Receiving Yards"],
                        receiving_tds=row["Receiving TDs"],
                        rushing_yards=row["Rushing Yards"],
                        rushing_tds=row["Rushing Touchdowns"],
                        passing_yards=row["Passing Yards"],
                        passing_tds=row["Passing Touchdowns"],
                        turnovers=row["Turnovers"],
                        total_points=row["Total Fantasy Points"],
                        tier=row["Tier"],
                        historical_player_id=fk_historical
                    )
                )
            await session.commit()
    except Exception as e:
        await session.rollback()
        raise Exception("There was an issue", e)
    finally:
        print("All went well!")

if __name__ == "__main__":
    asyncio.run(populate_players())