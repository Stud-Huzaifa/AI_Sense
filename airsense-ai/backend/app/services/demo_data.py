from datetime import datetime, timedelta
from hashlib import sha256
from math import sin
from random import Random


CITY_COORDS = {
    "karachi": ("Karachi", "Pakistan", 24.8607, 67.0011, 155),
    "lahore": ("Lahore", "Pakistan", 31.5204, 74.3587, 180),
    "islamabad": ("Islamabad", "Pakistan", 33.6844, 73.0479, 92),
    "peshawar": ("Peshawar", "Pakistan", 34.0151, 71.5249, 140),
    "quetta": ("Quetta", "Pakistan", 30.1798, 66.9750, 120),
    "delhi": ("Delhi", "India", 28.7041, 77.1025, 190),
    "london": ("London", "United Kingdom", 51.5072, -0.1276, 58),
    "new york": ("New York", "United States", 40.7128, -74.0060, 64),
}


def _city_meta(city: str) -> tuple[str, str, float, float, int]:
    return CITY_COORDS.get(city.strip().lower(), (city.title(), "Pakistan", 24.8607, 67.0011, 135))


def _seed(city: str, recorded_at: datetime) -> int:
    raw = f"{city.lower()}-{recorded_at:%Y-%m-%d-%H}".encode()
    return int(sha256(raw).hexdigest()[:12], 16)


def generate_demo_reading(city: str = "Karachi", recorded_at: datetime | None = None) -> dict:
    recorded_at = recorded_at or datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    city_name, country, lat, lon, base_aqi = _city_meta(city)
    rng = Random(_seed(city_name, recorded_at))
    hour_factor = sin((recorded_at.hour - 7) / 24 * 6.283)
    weekday_factor = 10 if recorded_at.weekday() < 5 else -6
    weather_factor = rng.uniform(-18, 18)
    aqi = max(22, min(360, round(base_aqi + hour_factor * 22 + weekday_factor + weather_factor)))

    pm25 = max(5, round(aqi * 0.42 + rng.uniform(-8, 8), 1))
    pm10 = max(10, round(aqi * 0.7 + rng.uniform(-12, 12), 1))
    temperature = round(26 + sin(recorded_at.hour / 24 * 6.283) * 7 + rng.uniform(-2, 2), 1)
    humidity = max(20, min(95, round(58 - hour_factor * 10 + rng.uniform(-8, 8), 1)))
    wind_speed = max(1, round(9 - aqi / 70 + rng.uniform(-1.5, 2.5), 1))

    return {
        "city": city_name,
        "country": country,
        "latitude": lat,
        "longitude": lon,
        "aqi": aqi,
        "pm25": pm25,
        "pm10": pm10,
        "co": round(max(0.1, aqi / 95 + rng.uniform(-0.25, 0.25)), 2),
        "no2": round(max(2, aqi * 0.18 + rng.uniform(-5, 5)), 1),
        "so2": round(max(1, aqi * 0.08 + rng.uniform(-3, 3)), 1),
        "o3": round(max(4, 38 + hour_factor * 16 + rng.uniform(-6, 6)), 1),
        "temperature": temperature,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "source": "demo",
        "recorded_at": recorded_at,
    }


def generate_demo_history(city: str = "Karachi", hours: int = 96) -> list[dict]:
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    start = now - timedelta(hours=hours - 1)
    return [generate_demo_reading(city, start + timedelta(hours=i)) for i in range(hours)]

