# AirSense AI

AirSense AI is a full-stack air pollution intelligence platform for monitoring AQI, visualizing pollutant trends, forecasting future air quality, and generating health-focused recommendations.

The project includes:

- React + Vite frontend dashboard
- FastAPI backend API
- SQLAlchemy database models
- Demo AQI data mode
- Optional WAQI live data integration
- Scikit-learn AQI prediction pipeline
- Render Blueprint deployment

## Project Location

The application code lives in:

```text
airsense-ai/
```

## Run Locally

Backend:

```bash
cd airsense-ai/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd airsense-ai/frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment

Copy the example file:

```bash
cd airsense-ai
cp .env.example .env
```

Important values:

```env
DEMO_MODE=true
WAQI_TOKEN=
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
VITE_API_BASE_URL=http://localhost:8000
```

Use `DEMO_MODE=false` with a WAQI token for live air quality data.

## Deploy on Render

This repo includes a simple root-level `render.yaml` Blueprint. It creates one Render web service named `airsense-ai`.

The Docker build compiles the React frontend, copies it into FastAPI, and serves the whole app from one URL.

Deploy steps:

1. Push this repository to GitHub.
2. In Render, choose **New > Blueprint**.
3. Select the repository.
4. Let Render detect `render.yaml`.
5. Click **Apply**.

Default URLs:

```text
App:    https://airsense-ai.onrender.com
Health: https://airsense-ai.onrender.com/health
```

See [Render deployment docs](airsense-ai/docs/render-deployment.md) for details.

## Verification

From the project root:

```bash
cd airsense-ai/frontend
npm run build
```

From the backend folder:

```bash
python -m compileall app
```

## Documentation

- [Application README](airsense-ai/README.md)
- [API documentation](airsense-ai/docs/api-documentation.md)
- [Architecture](airsense-ai/docs/architecture.md)
- [Project report](airsense-ai/docs/project-report.md)
- [Render deployment](airsense-ai/docs/render-deployment.md)
