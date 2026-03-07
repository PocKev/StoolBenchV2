from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.models import Note, StoolRecord, User
from .models import StoolPayload


def check_health(db: Session) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


def create_note(db: Session, payload: dict) -> dict:
    note = Note(text=str(payload.get("text", "")))
    db.add(note)
    db.commit()
    db.refresh(note)
    return {"id": note.id, "text": note.text}


def list_notes(db: Session) -> list[dict]:
    notes = db.query(Note).order_by(Note.id.desc()).limit(50).all()
    return [{"id": n.id, "text": n.text} for n in notes]


def insert_stool_record(db: Session, user_id: int, payload: StoolPayload) -> str:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=400, detail=f"user_id {user_id} not found")

    current_ts = datetime.now(timezone.utc).replace(microsecond=0)
    record = StoolRecord(
        user_id=user_id,
        wetness_rating=payload.wetness,
        experience_rating=payload.experience,
        timestamp=current_ts,
    )
    db.add(record)

    db.commit()
    return "created"
