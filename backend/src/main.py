from collections import defaultdict
from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_async_session
from .model import Player, HistoricalPlayer, HistoricalPlayerSeasonData
from .schema import PlayerModel, HistoricalPlayerModel, HistoricalPlayerSeasonDataModel
import uvicorn

app = FastAPI() 

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

@app.get("/")
def basic():
    return {"something": "For now"}


@app.get("/players", response_model=list[PlayerModel])
async def get_players(
    db: AsyncSession = Depends(get_async_session)
):     
    stmt = select(Player)
    result = await db.execute(stmt)
    all_players = result.scalars().all()

    if all_players is None:
        return {"Error": "No data"}
    return all_players


@app.get("/players/{id}", response_model=PlayerModel)
async def get_indv_players(
    id: int, 
    db: AsyncSession = Depends(get_async_session)
):
    stmt = select(Player).filter(Player.rank == id)
    result = await db.execute(stmt)
    specific_player = result.scalars().first()

    if specific_player is None:
        return {"That player": "Does not exist"}
    return specific_player


@app.get("/search_results", response_model=list[PlayerModel])
async def get_player_by_name_search_bar(
    name: str = Query(default=""), 
    db: AsyncSession = Depends(get_async_session)
):
    if not name.strip():
        return []
    
    stmt = select(Player).where(Player.name.ilike(f'%{name}%'))
    result = await db.execute(stmt)
    players = result.scalars().all()

    return players

# endpoint for querying on historical player data
@app.get("/historical", response_model=list[HistoricalPlayerModel])
async def getHistoricalPlayers(db: AsyncSession=Depends(get_async_session)):
    stmt = select(HistoricalPlayer).options(selectinload(HistoricalPlayer.season_data))
    
    results = await db.execute(stmt)
    players = results.scalars().all()

    if not players:
        return []
    
    completed_results = [HistoricalPlayerModel(
            id=player.id,
            name=player.name,
            position=player.position,
            headshot_url=player.headshot_url or "",
            data=[HistoricalPlayerSeasonDataModel(
                season=season.season,
                team=season.team,
                targets=season.targets,
                target_share=season.target_share,
                receptions=season.receptions,
                receiving_yards=season.receiving_yards,
                receiving_tds=season.receiving_tds,
                carries=season.carries,
                rushing_yards=season.rushing_yards,
                rushing_tds=season.rushing_tds,
                passing_yards=season.passing_yards,
                passing_tds=season.passing_tds,
                turnovers=season.turnovers,
                points_per_game=season.points_per_game,
                total_points=season.total_points,
                rank_ppg=season.rank_ppg,
                rank_total=season.rank_total,
                position_tier=season.position_tier,
                ) for season in player.season_data
            ],
        ) 
        for player in players
    ]
    
    return completed_results

@app.get("/historical/similar_name", response_model=list[HistoricalPlayerModel])
async def get_historical_player_by_name_search_bar(
    name: str = Query(default=""), 
    db: AsyncSession = Depends(get_async_session)
):
    if not name.strip():
        return []
    
    stmt = select(
        HistoricalPlayer
        ).options(
            selectinload(HistoricalPlayer.season_data)
            ).where(HistoricalPlayer.name.ilike(f'%{name}%'))
    
    result = await db.execute(stmt)
    players = result.scalars().all()

    completed_results = [HistoricalPlayerModel(
            id=player.id,
            name=player.name,
            position=player.position,
            headshot_url=player.headshot_url or "",
            data=[HistoricalPlayerSeasonDataModel(
                season=season.season,
                team=season.team,
                targets=season.targets,
                target_share=season.target_share,
                receptions=season.receptions,
                receiving_yards=season.receiving_yards,
                receiving_tds=season.receiving_tds,
                carries=season.carries,
                rushing_yards=season.rushing_yards,
                rushing_tds=season.rushing_tds,
                passing_yards=season.passing_yards,
                passing_tds=season.passing_tds,
                turnovers=season.turnovers,
                points_per_game=season.points_per_game,
                total_points=season.total_points,
                rank_ppg=season.rank_ppg,
                rank_total=season.rank_total,
                position_tier=season.position_tier,
                ) for season in player.season_data
            ],
        ) 
        for player in players
    ]
    
    return completed_results


@app.get("/historical/{year}", response_model=list[HistoricalPlayerModel])
async def get_historical_player_by_season(
    year: int = 2025, 
    db: AsyncSession = Depends(get_async_session)
):
    if year not in [2023, 2024, 2025]:
        return []
    
    stmt = (
        select(HistoricalPlayer)
        .join(HistoricalPlayer.season_data)
        .where(HistoricalPlayerSeasonData.season == year)
        .options(selectinload(HistoricalPlayer.season_data))
    )
    
    result = await db.execute(stmt)
    players = result.scalars().all()

    players.sort(
        key=lambda player: next(
            (season.points_per_game for season in player.season_data if season.season == year),
            999
        ),
        reverse=True
    )

    completed_results = [
        HistoricalPlayerModel(
            id=player.id,
            name=player.name,
            position=player.position,
            headshot_url=player.headshot_url or "",
            data=[HistoricalPlayerSeasonDataModel(
                season=season.season,
                team=season.team,
                targets=season.targets,
                target_share=season.target_share,
                receptions=season.receptions,
                receiving_yards=season.receiving_yards,
                receiving_tds=season.receiving_tds,
                carries=season.carries,
                rushing_yards=season.rushing_yards,
                rushing_tds=season.rushing_tds,
                passing_yards=season.passing_yards,
                passing_tds=season.passing_tds,
                turnovers=season.turnovers,
                points_per_game=season.points_per_game,
                total_points=season.total_points,
                rank_ppg=season.rank_ppg,
                rank_total=season.rank_total,
                position_tier=season.position_tier,
                ) 
                for season in player.season_data if season.season == year
            ],
        ) for player in players]
    
    return completed_results


@app.get("/health")
def health():
    return {"this": "worked"}

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)
