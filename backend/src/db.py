import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

curr_working_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.abspath(os.path.join(curr_working_dir, "..", "data", "player.db"))

engine = create_engine(f'sqlite:///{db_path}')
SessionLocal = sessionmaker(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
