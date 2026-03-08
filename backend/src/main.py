from fastapi import FastAPI
from schema import PlayerModel
from model import Player

app = FastAPI()

@app.get("/")
def basic():
    return {"something": "For now"}

@app.get("/health")
def health():
    return {"this": "worked"}

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)
