from functools import lru_cache
from os import getenv
from pathlib import Path


def _load_env_file() -> None:
    env_path = Path(".env")
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        import os

        os.environ[key] = value


class Settings:
    def __init__(self) -> None:
        _load_env_file()
        self.app_name = getenv("APP_NAME", "AirSense AI")
        self.app_env = getenv("APP_ENV", "development")
        self.database_url = getenv("DATABASE_URL", "sqlite:///./airsense.db")
        self.demo_mode = getenv("DEMO_MODE", "true").lower() in {"1", "true", "yes", "on"}
        self.waqi_token = getenv("WAQI_TOKEN", "")
        self.secret_key = getenv("SECRET_KEY", "change-me-in-production")
        self.cors_origins = getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
