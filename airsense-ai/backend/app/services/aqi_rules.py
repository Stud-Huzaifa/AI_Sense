AQI_COLORS = {
    "Good": "#16a34a",
    "Moderate": "#ca8a04",
    "Unhealthy for Sensitive Groups": "#f97316",
    "Unhealthy": "#dc2626",
    "Very Unhealthy": "#9333ea",
    "Hazardous": "#7f1d1d",
}


def classify_aqi(aqi: int) -> dict:
    if aqi <= 50:
        category = "Good"
        risk_level = "Low"
        recommendation = "Air quality is good. Outdoor activities are safe for most people."
    elif aqi <= 100:
        category = "Moderate"
        risk_level = "Mild"
        recommendation = "Air quality is acceptable. Sensitive people should watch for symptoms."
    elif aqi <= 150:
        category = "Unhealthy for Sensitive Groups"
        risk_level = "Medium"
        recommendation = "Sensitive groups should reduce prolonged outdoor exertion."
    elif aqi <= 200:
        category = "Unhealthy"
        risk_level = "High"
        recommendation = "Avoid outdoor exercise and reduce prolonged outdoor exposure."
    elif aqi <= 300:
        category = "Very Unhealthy"
        risk_level = "Very High"
        recommendation = "Stay indoors where possible and use a mask if outdoor travel is necessary."
    else:
        category = "Hazardous"
        risk_level = "Severe"
        recommendation = "Health warning. Avoid outdoor exposure and keep indoor air filtered."

    return {
        "category": category,
        "color": AQI_COLORS[category],
        "risk_level": risk_level,
        "recommendation": recommendation,
    }


PROFILE_ADVICE = {
    "general": [
        "Check the AQI before long outdoor activity.",
        "Close windows during pollution spikes.",
        "Use public transport or carpooling when possible.",
    ],
    "child": [
        "Limit outdoor play when AQI is above 100.",
        "Keep school travel short during high pollution periods.",
        "Watch for coughing, eye irritation, or breathing discomfort.",
    ],
    "elderly": [
        "Avoid prolonged outdoor activity when AQI is elevated.",
        "Keep medicines and water nearby.",
        "Use filtered indoor air during high AQI hours.",
    ],
    "asthma": [
        "Carry an inhaler when going outside.",
        "Avoid outdoor exercise when AQI is above 100.",
        "Seek medical help if breathing becomes difficult.",
    ],
    "outdoor_worker": [
        "Use a fitted pollution mask during high AQI periods.",
        "Take breaks indoors or in cleaner air zones.",
        "Shift heavy work to lower AQI hours when possible.",
    ],
    "runner": [
        "Run early when traffic pollution is lower.",
        "Choose indoor training when AQI is unhealthy.",
        "Avoid routes near busy roads.",
    ],
}


def generate_health_advice(aqi: int, profile: str = "general") -> dict:
    rules = classify_aqi(aqi)
    normalized_profile = profile if profile in PROFILE_ADVICE else "general"
    profile_notes = PROFILE_ADVICE[normalized_profile]
    message = (
        f"AQI is {aqi}. Air quality is {rules['category'].lower()}. "
        f"{rules['recommendation']} "
        f"For {normalized_profile.replace('_', ' ')} users: {profile_notes[0]}"
    )
    return {
        **rules,
        "message": message,
        "precautions": profile_notes,
    }

