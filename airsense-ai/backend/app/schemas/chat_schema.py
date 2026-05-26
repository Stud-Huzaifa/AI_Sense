from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2)
    city: str = "Karachi"
    profile: str = "general"


class ChatResponse(BaseModel):
    city: str
    question: str
    answer: str
    aqi: int
    category: str
    risk_level: str
    insights: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
    dominant_pollutants: list[dict] = Field(default_factory=list)
