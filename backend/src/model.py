from sqlalchemy import Table, Column, Integer, String, Float, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Player(Base):
    __tablename__ = "all_players"

    id: Mapped[int]=mapped_column(primary_key=True, index=True)
    rank: Mapped[int]=mapped_column(nullable=False)
    name: Mapped[str]=mapped_column(String(40), nullable=False)
    position: Mapped[str]=mapped_column(String(3), nullable=False)
    position_rank: Mapped[int]
    team: Mapped[str]=mapped_column(String(30), nullable=False)
    receptions: Mapped[float]
    receiving_yards: Mapped[float]
    receiving_tds: Mapped[float]
    rushing_yards: Mapped[float]
    rushing_tds: Mapped[float]
    passing_yards: Mapped[float]
    passing_tds: Mapped[float]
    turnovers: Mapped[float]
    total_points: Mapped[float]
    tier: Mapped[int]


class HistoricalPlayer(Base):
    __tablename__ = "historical_player_data"

    id: Mapped[int]=mapped_column(primary_key=True, index=True)
    rank_ppg: Mapped[int]=mapped_column(nullable=False)
    rank_total: Mapped[int]=mapped_column(nullable=False)
    name: Mapped[str]=mapped_column(String(50), nullable=False)
    position: Mapped[str]=mapped_column(String(3), nullable=False)
    season: Mapped[int]
    team: Mapped[str]=mapped_column(String(30), nullable=False)
    receptions: Mapped[int]
    receiving_yards: Mapped[int]
    receiving_tds: Mapped[int]
    rushing_yards: Mapped[int]
    rushing_tds: Mapped[int]
    passing_yards: Mapped[int]
    passing_tds: Mapped[int]
    turnovers: Mapped[int]
    points_per_game: Mapped[float]
    total_points: Mapped[float]
    position_tier: Mapped[int]