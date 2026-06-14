from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), default="AirSense User")
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    profile: Mapped[str] = mapped_column(String(50), default="general")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
