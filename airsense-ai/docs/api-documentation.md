# API Documentation

Base URL: `http://localhost:8000`

## Health

`GET /health`

Returns backend status and demo mode state.

## Current AQI

`GET /aqi/current?city=Karachi`

Returns the latest reading, pollutant values, weather fields, AQI category, color, risk level, and recommendation.

## Refresh AQI

`POST /aqi/refresh?city=Karachi`

Fetches or generates a new reading, stores it, and returns it.

## AQI History

`GET /aqi/history?city=Karachi&limit=72`

Returns readings plus `highest_aqi`, `lowest_aqi`, and `average_aqi`.

## AQI Prediction

`GET /aqi/predict?city=Karachi&horizon_hours=6`

Example:

```json
{
  "city": "Karachi",
  "horizon_hours": 6,
  "predicted_aqi": 158,
  "category": "Unhealthy",
  "risk_level": "High",
  "confidence_level": 0.82,
  "recommendation": "Avoid outdoor exercise and reduce prolonged outdoor exposure."
}
```

## Health Alert

`GET /alerts/health?city=Karachi&profile=asthma`

Profiles: `general`, `child`, `elderly`, `asthma`, `outdoor_worker`, `runner`.

## Assistant

`POST /chat/ask`

Body:

```json
{
  "city": "Karachi",
  "profile": "general",
  "question": "Is it safe to go outside?"
}
```

## Locations

`GET /locations`

Returns supported locations.

`POST /locations`

Body:

```json
{
  "city": "Karachi",
  "country": "Pakistan",
  "latitude": 24.8607,
  "longitude": 67.0011
}
```

