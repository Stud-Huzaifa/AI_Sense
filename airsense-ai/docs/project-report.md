# AirSense AI Project Report

## Abstract

AirSense AI is a full-stack environmental intelligence system for monitoring air pollution, storing AQI readings, predicting future AQI, and generating health-risk recommendations.

## Problem Statement

Urban residents often see raw pollution numbers without clear context, short-term forecasting, or personalized health advice. This makes daily outdoor decisions difficult for sensitive groups and active workers.

## Objectives

- Display current AQI and pollutant values.
- Store readings for historical analysis.
- Predict future AQI using machine learning.
- Provide profile-based health alerts.
- Visualize air quality through charts and a map.
- Offer a rule-based AQI assistant.

## Scope

The system supports demo data for offline use and WAQI live data for API-based deployments. It is built for local development, academic demonstration, and portfolio deployment.

## Existing Problem

Many AQI projects are static notebooks or simple API demos. They lack persistent storage, backend APIs, usable dashboards, maps, and user-centered health guidance.

## Proposed Solution

AirSense AI uses FastAPI, SQLAlchemy, React, Recharts, Leaflet, and Scikit-learn to create a deployable smart-city style pollution platform.

## System Architecture

The frontend calls FastAPI endpoints. The backend fetches or generates AQI readings, saves them to SQLite, classifies health risk, and serves predictions. The ML module trains a Random Forest model and stores it as a Joblib artifact.

## Technology Stack

Backend: Python, FastAPI, SQLAlchemy, SQLite, HTTPX, Pandas, NumPy, Scikit-learn, Joblib.

Frontend: React, Vite, Axios, Recharts, Leaflet, React Leaflet, CSS.

Deployment: Docker, Docker Compose, environment variables.

## Database Design

The database contains users, locations, air quality readings, predictions, alerts, and chatbot messages. The `air_quality_readings` table stores city, country, latitude, longitude, AQI, pollutants, weather data, source, recorded time, and creation time.

## Machine Learning Methodology

Historical AQI readings are transformed into features using previous AQI, lag values, pollutant levels, weather values, and time components. A Random Forest Regressor predicts the next AQI value. Metrics include MAE, RMSE, and R2.

## API Design

The API exposes endpoints for health checks, current AQI, refresh, history, predictions, health alerts, assistant answers, and locations. Responses are JSON and frontend-ready.

## Frontend Design

The React UI uses a dashboard layout with a sidebar, city selector, AQI summary, pollutant cards, trend charts, prediction controls, Leaflet map, alerts panel, assistant chat, and project information page.

## Results

In demo mode, the app generates realistic hourly AQI data and supports all required features without API keys. When a trained model exists, predictions use the Joblib artifact; otherwise, a heuristic fallback keeps the feature available.

## Limitations

- Demo data is synthetic.
- WAQI coverage depends on available city stations.
- The assistant is rule-based and not a generative LLM.
- SQLite is intended for local development rather than high-scale production.

## Future Work

- Add user authentication.
- Add scheduled ingestion and background tasks.
- Add PostgreSQL deployment.
- Integrate a RAG or LLM assistant.
- Add model monitoring and automatic retraining.

## Conclusion

AirSense AI turns AQI readings into a complete environmental intelligence workflow with monitoring, storage, forecasting, visualization, and actionable health guidance.

