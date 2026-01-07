import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from .db import engine, get_db, Base
from .models import Note


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@app.post("/api/notes")
def create_note(payload: dict, db: Session = Depends(get_db)):
    note = Note(text=str(payload.get("text", "")))
    db.add(note)
    db.commit()
    db.refresh(note)
    return {"id": note.id, "text": note.text}


@app.get("/api/notes")
def list_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).order_by(Note.id.desc()).limit(50).all()
    return [{"id": n.id, "text": n.text} for n in notes]