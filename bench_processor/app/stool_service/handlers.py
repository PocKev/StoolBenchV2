from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db

from .models import StoolPayload
from .service import check_health, create_note, insert_stool_record, list_notes

router = APIRouter()


@router.get("/api/health")
def health(db: Session = Depends(get_db)):
    return check_health(db)


@router.post("/api/notes")
def create_note_handler(payload: dict, db: Session = Depends(get_db)):
    return create_note(db, payload)


@router.get("/api/notes")
def list_notes_handler(db: Session = Depends(get_db)):
    return list_notes(db)


@router.post("/api/{user_id}/stool")
def insert_stool_record_handler(
    user_id: int,
    payload: StoolPayload,
    db: Session = Depends(get_db),
):
    return insert_stool_record(db, user_id, payload)
