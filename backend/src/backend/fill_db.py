import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
csv_file = os.path.join(BASE_DIR, "data/files/fantasy-rankings-07-25-25.csv")

import pandas as pd
from sqlalchemy.orm import sessionmaker

from db import engine
from model import Base, Player

df = pd.read_csv(csv_file)

Base.metadata.create_all(bind=engine)
Session = sessionmaker(engine)

try:
    with Session() as session:
        for idx, row in df.iterrows():
            print(idx)
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
                )
            )
        session.commit()
except Exception as e:
    session.rollback()
    raise Exception("There was an issue", e)
finally:
    print("All went well!")