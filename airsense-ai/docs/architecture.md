# Architecture

## Overview

AirSense AI is divided into a FastAPI backend, a React frontend, a SQLite database, and a Scikit-learn model artifact.

## Backend Flow

1. API routes receive city, profile, and horizon parameters.
2. `reading_service` fetches live WAQI data and stores each reading.
3. Readings are normalized and stored in SQLAlchemy models.
4. AQI rules classify risk and produce recommendations.
5. Prediction service loads `aqi_model.joblib` when available and falls back to a transparent heuristic when no trained model exists.
6. JSON responses are returned to the frontend.

## Frontend Flow

1. `App.jsx` loads locations, current AQI, history, prediction, and health alert data.
2. Pages render operational views: dashboard, history, predictions, map, alerts, assistant, and about.
3. Recharts visualizes trends and pollutants.
4. React Leaflet renders city AQI markers.
5. The assistant posts questions to the backend and displays AQI-aware responses.

## Database Tables

- `users`
- `locations`
- `air_quality_readings`
- `predictions`
- `alerts`
- `chatbot_messages`

## Deployment

Local development uses SQLite and Vite. Docker Compose builds backend and frontend services. The SQLAlchemy database URL can be changed to PostgreSQL for production.
