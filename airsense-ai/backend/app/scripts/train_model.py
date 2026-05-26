from app.db.database import SessionLocal
from app.db.init_db import init_db
from app.ml.train import train_model_from_db
from app.services.reading_service import ensure_history


def main() -> None:
    init_db()
    db = SessionLocal()
    try:
        ensure_history(db, "Karachi", 144)
        metrics = train_model_from_db(db)
        print(metrics)
    finally:
        db.close()


if __name__ == "__main__":
    main()

