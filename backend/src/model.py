from sqlalchemy import String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

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


class HistoricalPlayerSeasonData(Base):
    __tablename__ = "historical_player_season_data"

    __table_args__ = (
        UniqueConstraint("player_id", "season", name="uq_player_season")
    )

    id: Mapped[int]=mapped_column(primary_key=True, index=True)
    player_id: Mapped[int]=mapped_column(ForeignKey("historical_player.id", nullable=False))
    season: Mapped[int]=mapped_column(nullable=False)
    team: Mapped[str]=mapped_column(String(30), nullable=False)

    targets: Mapped[int]=mapped_column(default=0)
    target_share: Mapped[float]=mapped_column(Float, default=0.0)
    receptions: Mapped[int]=mapped_column(default=0)
    receiving_yards: Mapped[int]=mapped_column(default=0)
    receiving_tds: Mapped[int]=mapped_column(default=0)
    
    carries: Mapped[int]=mapped_column(default=0)
    rushing_yards: Mapped[int]=mapped_column(default=0)
    rushing_tds: Mapped[int]=mapped_column(default=0)

    passing_yards: Mapped[int]=mapped_column(default=0)
    passing_tds: Mapped[int]=mapped_column(default=0)

    turnovers: Mapped[int]=mapped_column(default=0)

    points_per_game: Mapped[float]=mapped_column(Float, default=0.0)
    total_points: Mapped[float]=mapped_column(Float, default=0.0)
    rank_ppg: Mapped[int]=mapped_column(nullable=False)
    rank_total: Mapped[int]=mapped_column(nullable=False)
    position_tier: Mapped[int]=mapped_column(default=0)

    player: Mapped[HistoricalPlayer] = mapped_column(ForeignKey("season_data"))


class HistoricalPlayer(Base):
    __tablename__ = "historical_player"

    id: Mapped[int]=mapped_column(primary_key=True, index=True)
    name: Mapped[str]=mapped_column(String(50), nullable=False)
    position: Mapped[str]=mapped_column(String(3), nullable=False)
    headshot_url: Mapped[str]=mapped_column(String(500), nullable=True)

    season_data: Mapped[list[HistoricalPlayerSeasonData]] = relationship(back_populates="historical_player")