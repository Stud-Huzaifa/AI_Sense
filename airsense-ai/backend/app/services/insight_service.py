from app.services.aqi_rules import classify_aqi, generate_health_advice


POLLUTANT_INFO = {
    "pm25": {
        "label": "PM2.5",
        "unit": "ug/m3",
        "meaning": "Fine particles that can travel deep into the lungs.",
        "action": "Use filtered indoor air and avoid heavy outdoor exercise when elevated.",
    },
    "pm10": {
        "label": "PM10",
        "unit": "ug/m3",
        "meaning": "Coarse particles from dust, roads, construction, and combustion.",
        "action": "Reduce dusty outdoor exposure and keep windows closed near traffic.",
    },
    "co": {
        "label": "CO",
        "unit": "ppm",
        "meaning": "Carbon monoxide from combustion sources and traffic.",
        "action": "Avoid idling traffic zones and ensure indoor ventilation is safe.",
    },
    "no2": {
        "label": "NO2",
        "unit": "ppb",
        "meaning": "Nitrogen dioxide, commonly linked with traffic and fuel burning.",
        "action": "Avoid high-traffic roads during commute and exercise.",
    },
    "so2": {
        "label": "SO2",
        "unit": "ppb",
        "meaning": "Sulfur dioxide from industrial and fuel-burning sources.",
        "action": "Sensitive users should limit outdoor exposure when levels rise.",
    },
    "o3": {
        "label": "O3",
        "unit": "ppb",
        "meaning": "Ground-level ozone formed by sunlight-driven chemical reactions.",
        "action": "Shift outdoor activity away from hot sunny afternoon hours.",
    },
}


def pollutant_values(reading) -> list[dict]:
    values = []
    for key, info in POLLUTANT_INFO.items():
        value = float(getattr(reading, key, 0) or 0)
        values.append({**info, "key": key, "value": value})
    return values


def dominant_pollutants(reading, count: int = 2) -> list[dict]:
    values = pollutant_values(reading)
    return sorted(values, key=lambda item: item["value"], reverse=True)[:count]


def trend_summary(readings: list) -> dict:
    if len(readings) < 2:
        return {
            "direction": "stable",
            "change": 0,
            "summary": "Not enough live history has been collected yet to calculate a reliable trend.",
        }
    latest = readings[-1].aqi
    previous = readings[0].aqi
    change = latest - previous
    if change >= 15:
        direction = "rising"
        summary = f"AQI is rising by {change} points across the available live readings."
    elif change <= -15:
        direction = "improving"
        summary = f"AQI is improving by {abs(change)} points across the available live readings."
    else:
        direction = "stable"
        summary = "AQI is relatively stable across the available live readings."
    return {"direction": direction, "change": change, "summary": summary}


def build_air_quality_insights(reading, profile: str = "general", readings: list | None = None) -> dict:
    rules = classify_aqi(reading.aqi)
    advice = generate_health_advice(reading.aqi, profile)
    top_pollutants = dominant_pollutants(reading)
    trend = trend_summary(readings or [reading])

    insights = [
        f"Current AQI is {reading.aqi}, classified as {rules['category']} with {rules['risk_level'].lower()} risk.",
        f"Main pollutant signal: {top_pollutants[0]['label']} at {top_pollutants[0]['value']:g} {top_pollutants[0]['unit']}.",
        trend["summary"],
    ]

    suggestions = [
        advice["precautions"][0],
        top_pollutants[0]["action"],
        "Refresh AQI before outdoor plans because live station readings can change quickly.",
    ]
    if reading.aqi > 150:
        suggestions.append("Prefer indoor exercise and use a well-fitted mask if outdoor travel is unavoidable.")
    elif reading.aqi > 100:
        suggestions.append("Sensitive groups should shorten outdoor exposure and monitor breathing symptoms.")

    return {
        "category": rules["category"],
        "color": rules["color"],
        "risk_level": rules["risk_level"],
        "dominant_pollutants": top_pollutants,
        "trend": trend,
        "insights": insights,
        "suggestions": suggestions,
    }

