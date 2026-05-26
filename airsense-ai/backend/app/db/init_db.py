from app.db.database import Base, engine
from app.models import alert, chat_message, location, prediction, reading, user  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

