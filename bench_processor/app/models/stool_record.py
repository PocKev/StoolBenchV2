from sqlalchemy import Integer, Float, DateTime, ForeignKey, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base
from .user import User


class StoolRecord(Base):
    __tablename__ = "stool_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    wetness_rating: Mapped[float] = mapped_column(Float, nullable=False)
    experience_rating: Mapped[float] = mapped_column(Float, nullable=False)

    timestamp: Mapped["DateTime"] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    user: Mapped["User"] = relationship(back_populates="stool_records")

    __table_args__ = (
        CheckConstraint("wetness_rating >= 0 AND wetness_rating <= 1", name="ck_wetness_0_1"),
        CheckConstraint("experience_rating >= 0 AND experience_rating <= 1", name="ck_experience_0_1"),
    )