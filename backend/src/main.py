from fastapi import Depends, FastAPI, Query, HTTPException, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_async_session
from .model import Player, HistoricalPlayer, HistoricalPlayerSeasonData
from .schema import PlayerModel, HistoricalPlayerModel
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

# Use your Clerk JWKS endpoint
clerk_config = ClerkConfig(jwks_url="https://obliging-owl-20.clerk.accounts.dev/.well-known/jwks.json") 
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)

# helper function to determine if authorized
def get_current_user(credentials: HTTPAuthorizationCredentials):
    clerk_user_id = credentials.decoded.get("sub")

    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing the user identifier."
        )
    return clerk_user_id


@app.get("/")
def basic(credentials: HTTPAuthorizationCredentials = Security(clerk_auth_guard)):
    return {"message": "You are authorized!", "user_data": credentials.decoded}


# endpoint for getting all player information
@app.get("/players", response_model=list[PlayerModel])
async def get_players(
    credentials: HTTPAuthorizationCredentials = Security(clerk_auth_guard),
    db: AsyncSession = Depends(get_async_session)
):     
    user_id = get_current_user(credentials=credentials)

    stmt = select(Player).options(
        selectinload(Player.historical_profile)
        .selectinload(HistoricalPlayer.data)
        ).order_by(Player.rank.asc())
    
    result = await db.execute(stmt)
    all_players = result.scalars().all()

    if all_players is None:
        return {"Error": "No data"}
    
    return all_players


# endpoint for getting player information by ranking
@app.get("/players/{rank}", response_model=PlayerModel)
async def get_indv_players(
    rank: int, 
    db: AsyncSession = Depends(get_async_session)
):
    stmt = select(Player).options(
        selectinload(Player.historical_profile)
        .selectinload(HistoricalPlayer.data)
        ).filter(Player.rank == int(rank))
        
    result = await db.execute(stmt)
    specific_player = result.scalars().first()

    if specific_player is None:
        return {"That player": "Does not exist"}
    
    return specific_player


# endpoint for getting player data via search bar
@app.get("/search_results", response_model=list[PlayerModel])
async def get_player_by_name_search_bar(
    name: str = Query(default=""), 
    db: AsyncSession = Depends(get_async_session)
):
    if not name.strip():
        return []
    
    stmt = select(Player).options(
        selectinload(Player.historical_profile)
        .selectinload(HistoricalPlayer.data)
        ).where(Player.name.ilike(f'%{name}%')
        ).order_by(Player.rank.asc())

    result = await db.execute(stmt)
    players = result.scalars().all()

    return players


# endpoint for querying on historical player data
@app.get("/historical", response_model=list[HistoricalPlayerModel])
async def getHistoricalPlayers(db: AsyncSession=Depends(get_async_session)):
    stmt = select(HistoricalPlayer).options(selectinload(HistoricalPlayer.data))
    
    results = await db.execute(stmt)
    players = results.scalars().all()

    if not players:
        return []
    
    return players


@app.get("/historical/{year}", response_model=list[HistoricalPlayerModel])
async def get_historical_player_by_season(
    year: int = 2025, 
    db: AsyncSession = Depends(get_async_session)
):
    if year not in [2023, 2024, 2025]:
        return []
    
    stmt = (
        select(HistoricalPlayer)
        .join(HistoricalPlayer.data)
        .where(HistoricalPlayerSeasonData.season == year)
        .options(selectinload(HistoricalPlayer.data.and_(HistoricalPlayerSeasonData.season == year)))
    )
    
    result = await db.execute(stmt)
    players = result.scalars().all()

    players.sort(
        key=lambda player: next(
            (season.points_per_game for season in player.data if season.season == year),
            999
        ),
        reverse=True
    )

    return players


@app.get("/health")
def health():
    return {"this": "worked"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
