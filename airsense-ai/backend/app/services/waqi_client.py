from datetime import datetime

import httpx
import certifi

from app.core.config import get_settings


def _get_number(data: dict, key: str, default: float = 0.0) -> float:
    value = data.get(key, {}).get("v", default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def fetch_city_aqi(city: str) -> dict:
    settings = get_settings()
    if not settings.waqi_token:
        raise ValueError("WAQI_TOKEN is required when DEMO_MODE=false")

    fetched_at = datetime.utcnow()
    url = f"https://api.waqi.info/feed/{city}/"
    try:
        response = httpx.get(url, params={"token": settings.waqi_token}, timeout=12, verify=certifi.where())
    except httpx.ConnectError as exc:
        if "CERTIFICATE_VERIFY_FAILED" not in str(exc):
            raise
        response = httpx.get(url, params={"token": settings.waqi_token}, timeout=12, verify=False)
    response.raise_for_status()
    payload = response.json()
    if payload.get("status") != "ok":
        raise ValueError(payload.get("data", "WAQI request failed"))

    data = payload["data"]
    iaqi = data.get("iaqi", {})
    geo = data.get("city", {}).get("geo") or [0, 0]
    city_name = city.strip().title()
    return {
        "city": city_name,
        "country": data.get("city", {}).get("name", "Unknown"),
        "latitude": float(geo[0] or 0),
        "longitude": float(geo[1] or 0),
        "aqi": int(data.get("aqi", 0)),
        "pm25": _get_number(iaqi, "pm25"),
        "pm10": _get_number(iaqi, "pm10"),
        "co": _get_number(iaqi, "co"),
        "no2": _get_number(iaqi, "no2"),
        "so2": _get_number(iaqi, "so2"),
        "o3": _get_number(iaqi, "o3"),
        "temperature": _get_number(iaqi, "t", 25),
        "humidity": _get_number(iaqi, "h", 55),
        "wind_speed": _get_number(iaqi, "w", 4),
        "source": "waqi",
        "recorded_at": fetched_at,
    }
