from pathlib import Path

import joblib

from app.ml.features import FEATURE_COLUMNS, latest_feature_row, readings_to_frame
from app.ml.train import ARTIFACT_PATH
from app.models.prediction import Prediction
from app.models.reading import AirQualityReading
from app.services.aqi_rules import classify_aqi
from app.services.reading_service import get_current_reading, get_history


def _recent_trend(readings: list[AirQualityReading]) -> float:
    if len(readings) < 2:
        return 0.0
    recent = readings[-6:] if len(readings) >= 6 else readings
    intervals = max(1, len(recent) - 1)
    return (recent[-1].aqi - recent[0].aqi) / intervals


def _apply_horizon_adjustment(base_aqi: int, readings: list[AirQualityReading], horizon_hours: int) -> int:
    latest = readings[-1]
    trend_per_reading = max(-10.0, min(10.0, _recent_trend(readings)))
    stagnant_air_pressure = max(0.0, 6 - float(latest.wind_speed or 0)) * 0.7
    humidity_pressure = max(0.0, float(latest.humidity or 0) - 70) * 0.08
    horizon_scale = max(1, horizon_hours) / 6
    adjustment = (trend_per_reading * 0.75 + stagnant_air_pressure + humidity_pressure) * horizon_scale
    return max(0, min(500, round(base_aqi + adjustment)))


def _heuristic_prediction(readings: list[AirQualityReading], horizon_hours: int) -> tuple[int, float]:
    latest = readings[-1]
    recent = readings[-6:] if len(readings) >= 6 else readings
    avg_recent = sum(item.aqi for item in recent) / len(recent)
    trend = _recent_trend(readings)
    weather_adjustment = -max(0, latest.wind_speed - 6) * 1.5 + max(0, latest.humidity - 70) * 0.4
    base_prediction = round((latest.aqi * 0.65) + (avg_recent * 0.25) + (trend * 0.8) + weather_adjustment)
    predicted = _apply_horizon_adjustment(base_prediction, readings, horizon_hours)
    volatility = sum(abs(item.aqi - avg_recent) for item in recent) / len(recent)
    confidence = max(0.55, min(0.92, 0.88 - volatility / 220 - (max(1, horizon_hours) - 1) / 300))
    return predicted, round(confidence, 2)


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
        base_prediction = int(round(float(artifact["model"].predict(row)[0])))
        predicted_aqi = _apply_horizon_adjustment(base_prediction, readings, horizon_hours)
        confidence = max(0.55, min(0.95, 1 - artifact.get("metrics", {}).get("mae", 25) / 180 - (horizon_hours - 1) / 320))
    else:
        predicted_aqi, confidence = _heuristic_prediction(readings, horizon_hours)

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
