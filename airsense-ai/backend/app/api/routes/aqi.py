import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.aqi_schema import HistoryResponse, PredictionResponse, ReadingResponse
from app.services.reading_service import fetch_and_save_current, get_current_reading, get_history, reading_to_dict

router = APIRouter(prefix="/aqi", tags=["AQI"])


@router.get("/current", response_model=ReadingResponse)
def current_aqi(city: str = Query("Karachi"), db: Session = Depends(get_db)):
    try:
        return reading_to_dict(get_current_reading(db, city))
    except (ValueError, httpx.HTTPError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/refresh", response_model=ReadingResponse)
def refresh_aqi(city: str = Query("Karachi"), db: Session = Depends(get_db)):
    try:
        return reading_to_dict(fetch_and_save_current(db, city))
    except (ValueError, httpx.HTTPError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/history", response_model=HistoryResponse)
def aqi_history(
    city: str = Query("Karachi"),
    limit: int = Query(72, ge=1, le=500),
    db: Session = Depends(get_db),
):
    try:
        readings = [reading_to_dict(item) for item in get_history(db, city, limit)]
    except (ValueError, httpx.HTTPError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    values = [item["aqi"] for item in readings]
    return {
        "city": readings[-1]["city"] if readings else city,
        "limit": limit,
        "readings": readings,
        "highest_aqi": max(values) if values else None,
        "lowest_aqi": min(values) if values else None,
        "average_aqi": round(sum(values) / len(values), 1) if values else None,
    }


@router.get("/predict", response_model=PredictionResponse)
def aqi_prediction(
    city: str = Query("Karachi"),
    horizon_hours: int = Query(6, ge=1, le=48),
    db: Session = Depends(get_db),
):
    from app.ml.predictor import predict_aqi

    try:
        return predict_aqi(db, city, horizon_hours)
    except (ValueError, httpx.HTTPError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
