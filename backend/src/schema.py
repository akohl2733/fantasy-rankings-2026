from pydantic import BaseModel

# personal rankings model
class PlayerModel(BaseModel):
    id: int
    rank: int
    name: str
    position: str
    position_rank: int
    team: str
    receptions: float
    receiving_yards: float
    receiving_tds: float
    rushing_yards: float
    rushing_tds: float
    passing_yards: float
    passing_tds: float
    turnovers: float
    total_points: float
    tier: int

# data for each season to be appended
class HistoricalPlayerSeasonData(BaseModel):
    rank_ppg: int
    rank_total: int
    name: str
    position: str
    season: int
    team: str
    receptions: int
    receiving_yards: int
    receiving_tds: int
    rushing_yards: int
    rushing_tds: int
    passing_yards: int
    passing_tds: int
    turnovers: int
    points_per_game: float
    total_points: float
    position_tier: int

# schema that will be sent in API calls
class HistoricalPlayerModel(BaseModel):
    id: int
    name: str
    data: list[HistoricalPlayerSeasonData]
    