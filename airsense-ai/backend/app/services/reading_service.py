from datetime import datetime, timedelta

from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.location import Location
from app.models.reading import AirQualityReading
from app.services.aqi_rules import classify_aqi
from app.services.demo_data import CITY_COORDS, generate_demo_history, generate_demo_reading
from app.services.waqi_client import fetch_city_aqi


def reading_to_dict(reading: AirQualityReading) -> dict:
    base = {
        "id": reading.id,
        "city": reading.city,
        "country": reading.country,
        "latitude": reading.latitude,
        "longitude": reading.longitude,
        "aqi": reading.aqi,
        "pm25": reading.pm25,
        "pm10": reading.pm10,
        "co": reading.co,
        "no2": reading.no2,
        "so2": reading.so2,
        "o3": reading.o3,
        "temperature": reading.temperature,
        "humidity": reading.humidity,
        "wind_speed": reading.wind_speed,
        "source": reading.source,
        "recorded_at": reading.recorded_at,
        "created_at": reading.created_at,
    }
    return {**base, **classify_aqi(reading.aqi)}


def save_reading(db: Session, data: dict) -> AirQualityReading:
    reading = AirQualityReading(**data)
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


def fetch_and_save_current(db: Session, city: str) -> AirQualityReading:
    settings = get_settings()
    data = generate_demo_reading(city) if settings.demo_mode else fetch_city_aqi(city)
    return save_reading(db, data)


def get_latest_reading(db: Session, city: str) -> AirQualityReading | None:
    query = db.query(AirQualityReading).filter(func.lower(AirQualityReading.city) == city.lower())
    if not get_settings().demo_mode:
        query = query.filter(AirQualityReading.source == "waqi")
    return query.order_by(desc(AirQualityReading.recorded_at), desc(AirQualityReading.id)).first()


def get_current_reading(db: Session, city: str) -> AirQualityReading:
    latest = get_latest_reading(db, city)
    if latest and latest.recorded_at >= datetime.utcnow() - timedelta(minutes=45):
        return latest
    return fetch_and_save_current(db, city)


def ensure_history(db: Session, city: str, limit: int = 72) -> None:
    if not get_settings().demo_mode:
        return
    count = db.query(AirQualityReading).filter(func.lower(AirQualityReading.city) == city.lower()).count()
    if count >= limit:
        return
    existing_times = {
        row[0]
        for row in db.query(AirQualityReading.recorded_at)
        .filter(func.lower(AirQualityReading.city) == city.lower())
        .all()
    }
    for item in generate_demo_history(city, max(limit, 96)):
        if item["recorded_at"] not in existing_times:
            db.add(AirQualityReading(**item))
    db.commit()


def get_history(db: Session, city: str, limit: int = 72) -> list[AirQualityReading]:
    ensure_history(db, city, limit)
    query = db.query(AirQualityReading).filter(func.lower(AirQualityReading.city) == city.lower())
    if not get_settings().demo_mode:
        query = query.filter(AirQualityReading.source == "waqi")
    readings = query.order_by(desc(AirQualityReading.recorded_at), desc(AirQualityReading.id)).limit(limit).all()
    return list(reversed(readings))


def seed_locations(db: Session) -> None:
    for _, (city, country, lat, lon, _) in CITY_COORDS.items():
        exists = db.query(Location).filter(func.lower(Location.city) == city.lower()).first()
        if not exists:
            db.add(Location(city=city, country=country, latitude=lat, longitude=lon))
    db.commit()
