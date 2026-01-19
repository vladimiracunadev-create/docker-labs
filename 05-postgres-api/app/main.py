from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@postgres/db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Postgres API OK ✅"}

@app.get("/health")
def health():
    return {"ok": True, "ts": "2023-01-01T00:00:00Z"}

@app.get("/items")
def read_items():
    db = SessionLocal()
    items = db.query(Item).all()
    db.close()
    return items

@app.post("/items")
def create_item(name: str):
    db = SessionLocal()
    item = Item(name=name)
    db.add(item)
    db.commit()
    db.refresh(item)
    db.close()
    return item