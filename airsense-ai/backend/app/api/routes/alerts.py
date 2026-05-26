from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.alert_schema import HealthAlertResponse
from app.services.alert_service import create_health_alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/health", response_model=HealthAlertResponse)
def health_alert(
    city: str = Query("Karachi"),
    profile: str = Query("general"),
    db: Session = Depends(get_db),
):
    return create_health_alert(db, city, profile)

