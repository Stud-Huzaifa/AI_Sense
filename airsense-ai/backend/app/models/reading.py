from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class AirQualityReading(Base):
    __tablename__ = "air_quality_readings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(100), index=True)
    country: Mapped[str] = mapped_column(String(100), default="Pakistan")
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    aqi: Mapped[int] = mapped_column(Integer, index=True)
    pm25: Mapped[float] = mapped_column(Float)
    pm10: Mapped[float] = mapped_column(Float)
    co: Mapped[float] = mapped_column(Float)
    no2: Mapped[float] = mapped_column(Float)
    so2: Mapped[float] = mapped_column(Float)
    o3: Mapped[float] = mapped_column(Float)
    temperature: Mapped[float] = mapped_column(Float)
    humidity: Mapped[float] = mapped_column(Float)
    wind_speed: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String(40), default="waqi")
    recorded_at: Mapped[datetime] = mapped_column(DateTime, index=True, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
