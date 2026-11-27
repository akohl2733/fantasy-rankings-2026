import os
from dotenv import load_dotenv

from fastapi import Depends, FastAPI, Query, HTTPException, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_async_session
from .model import Player, HistoricalPlayer, HistoricalPlayerSeasonData, UserWatchlist
from .schema import PlayerModel, HistoricalPlayerModel, UserWatchlistModel, WatchlistCreate, WatchlistUpdate
import uvicorn

app = FastAPI() 

load_dotenv()
JWKS_URL = os.getenv("JWKS_URL") or "https://example.invalid/.well-known/jwks.json"
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

# Use your Clerk JWKS endpoint
clerk_config = ClerkConfig(jwks_url=JWKS_URL) 
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)

# helper function to determine if authorized
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(clerk_auth_guard)) -> str:
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
    db: AsyncSession = Depends(get_async_session)
):     

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
        raise HTTPException(status_code=404, detail="There is no player with that rank")
    
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


def _watchlist_query(user_id: str):
    return (
        select(UserWatchlist)
        .where(UserWatchlist.clerk_user_id == user_id)
        .options(
            selectinload(UserWatchlist.player)
            .selectinload(Player.historical_profile)
            .selectinload(HistoricalPlayer.data)
        )
    )


@app.get("/watchlist", response_model=list[UserWatchlistModel])
async def get_watchlist(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
):
    stmt = _watchlist_query(user_id).order_by(UserWatchlist.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@app.post("/watchlist", response_model=UserWatchlistModel, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    payload: WatchlistCreate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
):
    player_exists = await db.scalar(select(Player.id).where(Player.id == payload.player_id))
    if player_exists is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    item = UserWatchlist(
        clerk_user_id=user_id,
        player_id=payload.player_id,
        note=payload.note,
    )
    try:
        db.add(item)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Player is already in watchlist",
        )
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while creating watchlist item",
        )

    result = await db.execute(_watchlist_query(user_id).where(UserWatchlist.id == item.id))
    return result.scalar_one()


@app.put("/watchlist/{player_id}", response_model=UserWatchlistModel)
async def update_watchlist_item(
    player_id: int,
    payload: WatchlistUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
):
    result = await db.execute(
        _watchlist_query(user_id).where(UserWatchlist.player_id == player_id)
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist item not found")

    item.note = payload.note
    try:
        await db.commit()
        await db.refresh(item)
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while updating watchlist item",
        )

    return item


@app.delete("/watchlist/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_watchlist_item(
    player_id: int,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
):
    result = await db.execute(
        select(UserWatchlist).where(
            UserWatchlist.clerk_user_id == user_id,
            UserWatchlist.player_id == player_id,
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist item not found")

    try:
        await db.delete(item)
        await db.commit()
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while deleting watchlist item",
        )


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_async_session)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
