from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db import get_async_session
from model import Player
from schema import PlayerModel
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


@app.get("/health")
def health():
    return {"this": "worked"}

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)
