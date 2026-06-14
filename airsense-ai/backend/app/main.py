from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import alerts, aqi, chat, locations
from app.core.config import get_settings
from app.db.init_db import init_db

settings = get_settings()
static_dir = Path(__file__).resolve().parents[1] / "static"
index_file = static_dir / "index.html"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=settings.cors_origin_list != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aqi.router)
app.include_router(alerts.router)
app.include_router(chat.router)
app.include_router(locations.router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.app_env,
        "data_mode": "live-waqi",
        "waqi_token_configured": bool(settings.waqi_token),
    }


if (static_dir / "assets").exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    requested_file = static_dir / full_path
    if requested_file.is_file():
        return FileResponse(requested_file)
    if index_file.exists():
        return FileResponse(index_file)
    raise HTTPException(status_code=404, detail="Frontend build not found")
