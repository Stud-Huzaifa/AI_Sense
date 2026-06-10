# AirSense AI

AirSense AI is a full-stack AI-powered environmental intelligence platform that monitors air pollution, predicts future AQI, visualizes pollutant trends, and provides personalized health-risk alerts using FastAPI, React, SQLAlchemy, Scikit-learn, maps, charts, and AQI APIs.

## Features

- Current AQI dashboard with pollutants, weather, wind, category, and health recommendation.
- Demo data mode that works without API keys.
- Live WAQI mode through `DEMO_MODE=false` and `WAQI_TOKEN`.
- SQLite database with users, locations, readings, predictions, alerts, and chatbot messages.
- Historical AQI trend chart, pollutant comparison, recent readings table, highest, lowest, and average AQI.
- Random Forest AQI prediction pipeline with Joblib artifacts.
- Rule-based health alerts for general, child, elderly, asthma, outdoor worker, and runner profiles.
- Leaflet pollution map with color-coded AQI marker.
- Rule-based AI-style pollution assistant.
- Dockerfiles, Compose setup, API docs, architecture docs, and project report.

## Tech Stack

Backend: Python, FastAPI, Uvicorn, SQLAlchemy, SQLite, Pandas, NumPy, Scikit-learn, Joblib, HTTPX, Pydantic, Python-dotenv.

Frontend: React, Vite, Axios, Recharts, Leaflet, React Leaflet, Lucide React, CSS.

## Folder Structure

```text
airsense-ai/
|-- backend/
|   |-- app/
|   |   |-- api/routes/
|   |   |-- core/
|   |   |-- db/
|   |   |-- ml/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- scripts/
|   |   |-- services/
|   |   `-- main.py
|   |-- artifacts/
|   |-- requirements.txt
|   `-- Dockerfile
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   `-- styles.css
|   |-- package.json
|   `-- Dockerfile
|-- docs/
|-- start-dev.ps1
|-- start-dev.bat
|-- docker-compose.yml
`-- .env.example
```

## Setup

Copy environment values:

```bash
cp .env.example .env
cp .env.example backend/.env
```

Backend:

```bash
cd backend
pip install -r requirements.txt
python -m app.scripts.seed_demo_data
python -m app.scripts.train_model
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Backend API runs at `http://localhost:8000`.

## Run Backend and Frontend Together

On Windows PowerShell, run this from the project root:

```powershell
cd C:\Huzaifa\AI_Sense\airsense-ai
.\start-dev.ps1
```

If dependencies are not installed yet, run:

```powershell
.\start-dev.ps1 -Install
```

If PowerShell script execution is blocked, use the batch wrapper:

```bat
start-dev.bat
```

This starts:

- Backend: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`
- Frontend: `http://localhost:5173`

Press `Ctrl+C` in the same terminal to stop both servers. Logs are written to `.logs/`.

## Environment Variables

```env
APP_NAME=AirSense AI
APP_ENV=development
DATABASE_URL=sqlite:///./airsense.db
DEMO_MODE=true
WAQI_TOKEN=
SECRET_KEY=change-me-in-production
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
VITE_API_BASE_URL=http://localhost:8000
```

Use `DEMO_MODE=true` for generated data. Use `DEMO_MODE=false` with a WAQI token for live city data.

## API Endpoints

- `GET /health`
- `GET /aqi/current?city=Karachi`
- `POST /aqi/refresh?city=Karachi`
- `GET /aqi/history?city=Karachi&limit=72`
- `GET /aqi/predict?city=Karachi&horizon_hours=6`
- `GET /alerts/health?city=Karachi&profile=asthma`
- `POST /chat/ask`
- `GET /locations`
- `POST /locations`

Interactive OpenAPI docs are available at `http://localhost:8000/docs`.

## Machine Learning

The ML pipeline creates lag and time features from AQI readings:

- `previous_aqi`, `aqi_lag_1`, `aqi_lag_2`, `aqi_lag_3`
- pollutants: `pm25`, `pm10`, `co`, `no2`, `so2`, `o3`
- weather: `temperature`, `humidity`, `wind_speed`
- time: `hour`, `day`, `month`

`python -m app.scripts.train_model` trains a `RandomForestRegressor`, calculates MAE, RMSE, and R2, then saves `backend/artifacts/aqi_model.joblib`.

## Docker

```bash
docker compose up --build
```

## Deploy on Render

This repo includes a Render Blueprint at `../render.yaml` for the FastAPI API, React static site, and Render Postgres database.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint and select this repository.
3. Leave `WAQI_TOKEN` blank for demo mode, or add a live WAQI token and set `DEMO_MODE=false`.

Default service URLs:

- Frontend: `https://airsense-ai.onrender.com`
- Backend API: `https://airsense-ai-api.onrender.com`
- Health check: `https://airsense-ai-api.onrender.com/health`

The backend is pinned to Python `3.11.11` for Render compatibility with the ML stack. If Render renames a service, update `VITE_API_BASE_URL` on the static site and `CORS_ORIGINS` on the backend. See `docs/render-deployment.md`.

## Screenshots

Add screenshots of the dashboard, history, prediction page, map, alerts, and assistant after running the app locally.

## Future Improvements

- Add authentication and saved user profiles.
- Add PostgreSQL production deployment.
- Add scheduled AQI ingestion jobs.
- Add OpenAI, Gemini, or RAG-backed assistant mode.
- Add model monitoring and retraining automation.

## Author

Prepared as a complete full-stack academic and portfolio project.
