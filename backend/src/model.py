from sqlalchemy import Table, Column, Integer, String, Float, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Player(Base):
    __tablename__ = "player"

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

# --------------------------------------------------------------------

metadata_obj = MetaData()

all_players_core = Table(
    'all_players_core',
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("rank", Integer, nullable=False),
    Column("name", String, nullable=False),
    Column("position", String(6), nullable=False),
    Column("position_rank", Integer),
    Column("team", String(30), nullable=False),
    Column("receptions", Float),
    Column("receiving_yards", Float),
    Column("receiving_tds", Float),
    Column("rushing_yards", Float),
    Column("rushing_tds", Float),
    Column("passing_yards", Float),
    Column("passing_tds", Float),
    Column("turnovers", Float),
    Column("total_points", Float),
    Column("tier", Float)
)