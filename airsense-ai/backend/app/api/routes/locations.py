from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.location import Location
from app.services.city_catalog import CITY_COORDS
from app.services.reading_service import seed_locations

router = APIRouter(prefix="/locations", tags=["Locations"])


class LocationCreate(BaseModel):
    city: str = Field(..., min_length=2)
    country: str = "Pakistan"
    latitude: float
    longitude: float


class LocationResponse(LocationCreate):
    id: int

    model_config = {"from_attributes": True}


@router.get("", response_model=list[LocationResponse])
def list_locations(db: Session = Depends(get_db)):
    seed_locations(db)
    live_cities = list(CITY_COORDS.keys())
    return (
        db.query(Location)
        .filter(func.lower(Location.city).in_(live_cities))
        .order_by(Location.city)
        .all()
    )


@router.post("", response_model=LocationResponse)
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    location = Location(**payload.model_dump())
    db.add(location)
    db.commit()
    db.refresh(location)
    return location
