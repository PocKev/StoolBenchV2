from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base

class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    text: Mapped[str] = mapped_column(String(255))