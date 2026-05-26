from pathlib import Path

import joblib

from app.ml.features import FEATURE_COLUMNS, latest_feature_row, readings_to_frame
from app.ml.train import ARTIFACT_PATH
from app.models.prediction import Prediction
from app.models.reading import AirQualityReading
from app.services.aqi_rules import classify_aqi
from app.services.reading_service import get_current_reading, get_history


def _heuristic_prediction(readings: list[AirQualityReading]) -> tuple[int, float]:
    latest = readings[-1]
    recent = readings[-6:] if len(readings) >= 6 else readings
    avg_recent = sum(item.aqi for item in recent) / len(recent)
    trend = latest.aqi - readings[-2].aqi if len(readings) > 1 else 0
    weather_adjustment = -max(0, latest.wind_speed - 6) * 1.5 + max(0, latest.humidity - 70) * 0.4
    predicted = round((latest.aqi * 0.65) + (avg_recent * 0.25) + (trend * 0.8) + weather_adjustment)
    volatility = sum(abs(item.aqi - avg_recent) for item in recent) / len(recent)
    confidence = max(0.55, min(0.92, 0.88 - volatility / 220))
    return max(0, min(500, predicted)), round(confidence, 2)


def predict_aqi(db, city: str, horizon_hours: int = 6, artifact_path: Path = ARTIFACT_PATH) -> dict:
    readings = get_history(db, city, max(24, horizon_hours + 6))
    if not readings:
        readings = [get_current_reading(db, city)]
    confidence = 0.72

    if artifact_path.exists() and len(readings) >= 4:
        artifact = joblib.load(artifact_path)
        frame = readings_to_frame(readings)
        row = latest_feature_row(frame)
        row = row[artifact.get("feature_columns", FEATURE_COLUMNS)]
        predicted_aqi = int(round(float(artifact["model"].predict(row)[0])))
        confidence = max(0.6, min(0.95, 1 - artifact.get("metrics", {}).get("mae", 25) / 180))
    else:
        predicted_aqi, confidence = _heuristic_prediction(readings)

    rules = classify_aqi(predicted_aqi)
    prediction = Prediction(
        city=readings[-1].city,
        horizon_hours=horizon_hours,
        predicted_aqi=predicted_aqi,
        category=rules["category"],
        risk_level=rules["risk_level"],
        confidence_level=round(confidence, 2),
        recommendation=rules["recommendation"],
    )
    db.add(prediction)
    db.commit()

    return {
        "city": readings[-1].city,
        "horizon_hours": horizon_hours,
        "predicted_aqi": predicted_aqi,
        "category": rules["category"],
        "color": rules["color"],
        "risk_level": rules["risk_level"],
        "confidence_level": round(confidence, 2),
        "recommendation": rules["recommendation"],
    }
