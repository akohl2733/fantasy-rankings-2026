from pydantic import BaseModel

# personal rankings model
class PlayerModel(BaseModel):
    id: int
    rank: int
    name: str
    position: str
    position_rank: int
    team: str
    receptions: float | None
    receiving_yards: float | None
    receiving_tds: float | None
    rushing_yards: float | None
    rushing_tds: float | None
    passing_yards: float | None
    passing_tds: float | None
    turnovers: float | None
    total_points: float | None
    tier: int | None

# data for each season to be appended
class HistoricalPlayerSeasonDataModel(BaseModel):
    season: int
    team: str
    
    targets: int
    target_share: float
    receptions: int
    receiving_yards: int
    receiving_tds: int

    carries: int
    rushing_yards: int
    rushing_tds: int

    passing_yards: int
    passing_tds: int

    turnovers: int

    points_per_game: float
    total_points: float
    rank_ppg: int
    rank_total: int
    position_tier: int

# schema that will be sent in API calls
class HistoricalPlayerModel(BaseModel):
    id: int
    name: str
    position: str
    headshot_url: str
    data: list[HistoricalPlayerSeasonDataModel]
    