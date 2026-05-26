from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.services.aqi_rules import generate_health_advice
from app.services.reading_service import get_current_reading


def create_health_alert(db: Session, city: str, profile: str = "general") -> dict:
    reading = get_current_reading(db, city)
    advice = generate_health_advice(reading.aqi, profile)
    alert = Alert(
        city=reading.city,
        profile=profile,
        aqi=reading.aqi,
        category=advice["category"],
        risk_level=advice["risk_level"],
        message=advice["message"],
    )
    db.add(alert)
    db.commit()
    return {
        "city": reading.city,
        "profile": profile,
        "aqi": reading.aqi,
        "category": advice["category"],
        "color": advice["color"],
        "risk_level": advice["risk_level"],
        "message": advice["message"],
        "precautions": advice["precautions"],
    }

