from sqlalchemy import String
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
