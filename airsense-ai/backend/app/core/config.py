from functools import lru_cache
from os import environ, getenv
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
        environ.setdefault(key, value)


class Settings:
    def __init__(self) -> None:
        _load_env_file()
        self.app_name = getenv("APP_NAME", "AirSense AI")
        self.app_env = getenv("APP_ENV", "development")
        self.database_url = self._normalize_database_url(getenv("DATABASE_URL", "sqlite:///./airsense.db"))
        self.demo_mode = getenv("DEMO_MODE", "false").lower() in {"1", "true", "yes", "on"}
        self.waqi_token = getenv("WAQI_TOKEN", "")
        self.secret_key = getenv("SECRET_KEY", "change-me-in-production")
        self.cors_origins = getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
        if not self.demo_mode and not self.waqi_token:
            raise ValueError("WAQI_TOKEN is required because DEMO_MODE=false.")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @staticmethod
    def _normalize_database_url(url: str) -> str:
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
