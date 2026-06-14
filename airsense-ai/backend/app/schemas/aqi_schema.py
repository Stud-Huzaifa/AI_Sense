from datetime import datetime

from pydantic import BaseModel, Field


class ReadingBase(BaseModel):
    city: str
    country: str = "Pakistan"
    latitude: float
    longitude: float
    aqi: int
    pm25: float
    pm10: float
    co: float
    no2: float
    so2: float
    o3: float
    temperature: float
    humidity: float
    wind_speed: float
    source: str = "waqi"
    recorded_at: datetime


class ReadingResponse(ReadingBase):
    id: int
    created_at: datetime
    category: str
    color: str
    risk_level: str
    recommendation: str

    model_config = {"from_attributes": True}


class HistoryResponse(BaseModel):
    city: str
    limit: int
    readings: list[ReadingResponse]
    highest_aqi: int | None
    lowest_aqi: int | None
    average_aqi: float | None


class PredictionResponse(BaseModel):
    city: str
    horizon_hours: int = Field(default=6, ge=1, le=48)
    predicted_aqi: int
    category: str
    color: str
    risk_level: str
    confidence_level: float
    recommendation: str
