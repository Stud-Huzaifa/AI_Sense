from app.db.database import SessionLocal
from app.db.init_db import init_db
from app.models.reading import AirQualityReading
from app.services.demo_data import CITY_COORDS, generate_demo_history
from app.services.reading_service import seed_locations


def main() -> None:
    init_db()
    db = SessionLocal()
    try:
        seed_locations(db)
        for _, (city, *_rest) in CITY_COORDS.items():
            existing_times = {
                row[0]
                for row in db.query(AirQualityReading.recorded_at)
                .filter(AirQualityReading.city == city)
                .all()
            }
            for reading in generate_demo_history(city, hours=144):
                if reading["recorded_at"] not in existing_times:
                    db.add(AirQualityReading(**reading))
        db.commit()
        print("Seeded demo AQI readings and locations.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
