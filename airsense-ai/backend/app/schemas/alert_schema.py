from pydantic import BaseModel


class HealthAlertResponse(BaseModel):
    city: str
    profile: str
    aqi: int
    category: str
    color: str
    risk_level: str
    message: str
    precautions: list[str]

