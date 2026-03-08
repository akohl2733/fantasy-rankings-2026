from pydantic import BaseModel

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
