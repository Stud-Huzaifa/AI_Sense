import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.chat_message import ChatMessage
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.aqi_rules import generate_health_advice
from app.services.insight_service import POLLUTANT_INFO, build_air_quality_insights
from app.services.reading_service import get_current_reading, get_history

router = APIRouter(prefix="/chat", tags=["Assistant"])


def _format_pollutants(reading) -> str:
    parts = []
    for key, info in POLLUTANT_INFO.items():
        value = getattr(reading, key, 0) or 0
        parts.append(f"{info['label']} {value:g} {info['unit']}")
    return ", ".join(parts)


def build_answer(question: str, reading, profile: str, history: list) -> str:
    q = question.lower()
    advice = generate_health_advice(reading.aqi, profile)
    context = build_air_quality_insights(reading, profile, history)
    top = context["dominant_pollutants"][0]

    if any(word in q for word in ["predict", "forecast", "future", "later", "next"]):
        trend = context["trend"]
        if trend["direction"] == "rising":
            return (
                f"Live readings suggest AQI pressure is rising in {reading.city}. Current AQI is {reading.aqi} "
                f"({advice['category']}). The strongest pollutant signal is {top['label']} at {top['value']:g} {top['unit']}. "
                "Plan outdoor activity conservatively and check the prediction page for the ML forecast."
            )
        if trend["direction"] == "improving":
            return (
                f"AQI appears to be improving in {reading.city}, but the current reading is still {reading.aqi} "
                f"({advice['category']}). Keep watching {top['label']} because it is the dominant pollutant right now."
            )
        return (
            f"The available live history for {reading.city} looks stable. Current AQI is {reading.aqi} "
            f"({advice['category']}). For better predictive confidence, collect more live readings over time."
        )

    if any(word in q for word in ["pollutant", "pm10", "no2", "so2", "ozone", "o3", "co"]):
        return (
            f"Current pollutant snapshot for {reading.city}: {_format_pollutants(reading)}. "
            f"The largest signal is {top['label']}. {top['meaning']} {top['action']}"
        )

    if "today" in q or "aqi" in q:
        return (
            f"The latest AQI in {reading.city} is {reading.aqi}, which is {advice['category']}. "
            f"{advice['recommendation']} Dominant pollutant signal: {top['label']}."
        )
    if "safe" in q or "outside" in q or "go out" in q:
        if reading.aqi <= 100:
            return (
                f"It is generally okay to go outside in {reading.city}, but sensitive people should monitor symptoms. "
                f"AQI is {reading.aqi}. Main pollutant to watch: {top['label']}."
            )
        return (
            f"Outdoor exposure should be reduced in {reading.city}. AQI is {reading.aqi}, so {advice['message']} "
            f"The main pollutant signal is {top['label']} at {top['value']:g} {top['unit']}."
        )
    if "pm2.5" in q or "pm25" in q:
        return (
            f"PM2.5 means fine particles smaller than 2.5 micrometers. In {reading.city}, PM2.5 is "
            f"{reading.pm25:g} ug/m3 right now. These particles can enter deep into the lungs, so avoid heavy outdoor exercise when AQI is elevated."
        )
    if "dangerous" in q or "pollution" in q:
        return (
            "Air pollution can irritate the lungs, worsen asthma, increase heart strain, and reduce visibility. "
            f"Today in {reading.city}, AQI is {reading.aqi}; {top['label']} is the strongest pollutant signal."
        )
    if "asthma" in q:
        asthma = generate_health_advice(reading.aqi, "asthma")
        return f"{asthma['message']} Also watch {top['label']}: {top['action']}"
    return (
        f"In {reading.city}, AQI is {reading.aqi} and the category is {advice['category']}. "
        f"{advice['message']} {context['trend']['summary']}"
    )


@router.post("/ask", response_model=ChatResponse)
def ask_assistant(payload: ChatRequest, db: Session = Depends(get_db)):
    try:
        reading = get_current_reading(db, payload.city)
        history = get_history(db, payload.city, 24)
    except (ValueError, httpx.HTTPError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    context = build_air_quality_insights(reading, payload.profile, history)
    answer = build_answer(payload.question, reading, payload.profile, history)
    advice = generate_health_advice(reading.aqi, payload.profile)
    db.add(
        ChatMessage(
            city=reading.city,
            profile=payload.profile,
            question=payload.question,
            answer=answer,
        )
    )
    db.commit()
    return {
        "city": reading.city,
        "question": payload.question,
        "answer": answer,
        "aqi": reading.aqi,
        "category": advice["category"],
        "risk_level": advice["risk_level"],
        "insights": context["insights"],
        "suggestions": context["suggestions"],
        "dominant_pollutants": context["dominant_pollutants"],
    }
