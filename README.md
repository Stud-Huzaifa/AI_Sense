# AirSense AI

**AirSense AI** is a full-stack air pollution intelligence platform that monitors real-time AQI, visualizes pollutant trends, predicts future air quality, and generates health-focused recommendations for safer daily decisions.

It combines a modern **React dashboard**, a **FastAPI backend**, persistent **SQLite storage**, live **WAQI API integration**, and a machine learning AQI prediction pipeline built with **Scikit-learn**.

---

# Overview

Air pollution data is often difficult to understand when presented as raw numbers. AirSense AI transforms AQI readings into a practical smart-city experience where users can:

- Monitor current AQI and pollutant levels
- Understand health risks based on AQI categories
- View historical pollution trends
- Compare pollutant concentrations
- Predict future AQI using machine learning
- Explore city air quality on an interactive map
- Receive profile-based health guidance
- Ask an AQI-aware assistant for recommendations

The project is designed for academic demonstrations, portfolio showcases, and full-stack development practice.

---

# Key Features

## Real-Time AQI Dashboard

The dashboard displays live air quality information, including:

- AQI value
- AQI category
- Health risk level
- PM2.5, PM10, CO, NO2, SO2, and O3 levels
- Temperature, humidity, and wind speed
- Last updated timestamp
- Health recommendations

---

## Live WAQI API Integration

AirSense AI supports live air quality readings using the World Air Quality Index API.

```env
DEMO_MODE=false
WAQI_TOKEN=your_waqi_token_here
```

When live mode is enabled, the backend:

1. Fetches AQI data from WAQI
2. Normalizes the response
3. Stores readings in SQLite
4. Serves processed data to the frontend

---

## Demo Mode

The platform also supports generated demo data, allowing the complete system to run without an external API key.

```env
DEMO_MODE=true
```

This is useful for:

- Offline development
- Testing
- Academic presentations
- UI demonstrations

---

## AQI History & Trends

Historical readings are stored in SQLite and visualized using charts and tables.

The history section includes:

- Highest AQI
- Lowest AQI
- Average AQI
- Hourly AQI trends
- Recent pollution readings

---

## Machine Learning AQI Prediction

AirSense AI includes a **Random Forest-based AQI prediction pipeline**.

The prediction model uses:

- Previous AQI values
- AQI lag features
- Pollutant concentrations
- Weather conditions
- Time-based features

If a trained model artifact exists, predictions are generated using the saved Joblib model. Otherwise, the system falls back to a transparent heuristic prediction method.

---

## Health Risk Alerts

The backend applies AQI classification rules to generate profile-aware health recommendations for:

- General users
- Children
- Elderly individuals
- Asthma-sensitive users
- Outdoor workers
- Athletes and runners

---

## Pollution Map

The map page uses **Leaflet** to display AQI-aware city markers with color-coded pollution severity indicators.

---

## AQI Assistant

The built-in assistant answers air-quality-related questions using current AQI values, pollutant levels, and health recommendation logic.

### Example Questions

- “Is it safe to go outside today?”
- “Should asthma patients avoid outdoor activity?”
- “Which pollutant is highest right now?”
- “What does this AQI mean?”

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- Recharts
- Leaflet
- React Leaflet
- Lucide React
- CSS

## Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- HTTPX

## Machine Learning

- Pandas
- NumPy
- Scikit-learn
- Joblib

## Deployment & Tooling

- Docker
- Docker Compose
- Environment Variables
- PowerShell Development Runner

---

# Project Structure

```text
airsense-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   ├── core/
│   │   ├── db/
│   │   ├── ml/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── artifacts/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   └── Dockerfile
│
├── docs/
├── docker-compose.yml
├── start-dev.ps1
├── start-dev.bat
├── .env.example
└── README.md
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/airsense-ai.git
cd airsense-ai
```

---

## 2. Configure Environment Variables

Create environment files from the example configuration:

```bash
cp .env.example .env
cp .env.example backend/.env
```

### Example Configuration

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

### For Live WAQI Data

```env
DEMO_MODE=false
WAQI_TOKEN=your_waqi_token_here
```

> Do not commit your real API token to GitHub.

---

# Run Locally

## Option 1 — Start Backend & Frontend Together

### Windows PowerShell

```powershell
.\start-dev.ps1
```

### Install Dependencies Automatically

```powershell
.\start-dev.ps1 -Install
```

### If PowerShell Execution Is Blocked

```bat
start-dev.bat
```

---

## Application URLs

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://127.0.0.1:8000` |
| API Docs | `http://127.0.0.1:8000/docs` |

---

# Manual Setup

## Backend

```bash
cd backend

pip install -r requirements.txt

python -m app.scripts.seed_demo_data
python -m app.scripts.train_model

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend health check |
| GET | `/aqi/current?city=Karachi` | Get current AQI |
| POST | `/aqi/refresh?city=Karachi` | Refresh AQI data |
| GET | `/aqi/history?city=Karachi&limit=72` | Get AQI history |
| GET | `/aqi/predict?city=Karachi&horizon_hours=6` | Predict future AQI |
| GET | `/alerts/health?city=Karachi&profile=asthma` | Get health alert |
| POST | `/chat/ask` | Ask the AQI assistant |
| GET | `/locations` | Get saved locations |
| POST | `/locations` | Add a location |

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

# Machine Learning Pipeline

The prediction system uses historical AQI readings and engineered features to estimate future AQI.

## Features Used

- `previous_aqi`
- `aqi_lag_1`
- `aqi_lag_2`
- `aqi_lag_3`
- `pm25`
- `pm10`
- `co`
- `no2`
- `so2`
- `o3`
- `temperature`
- `humidity`
- `wind_speed`
- `hour`
- `day`
- `month`

---

## Train the Model

```bash
cd backend
python -m app.scripts.train_model
```

The trained model artifact is stored at:

```text
backend/artifacts/aqi_model.joblib
```

---

# Docker Support

Run the complete application using Docker Compose:

```bash
docker compose up --build
```

---

# Screenshots

Add screenshots after running the project.

```md
![Dashboard](screenshots/dashboard.png)
![History](screenshots/history.png)
![Prediction](screenshots/prediction.png)
![Map](screenshots/map.png)
![Assistant](screenshots/assistant.png)
```

---

# Use Cases

AirSense AI can be used for:

- Smart-city pollution monitoring
- Environmental analytics dashboards
- Academic final-year projects
- AQI forecasting demonstrations
- Health-risk awareness systems
- Full-stack portfolio projects
- Machine learning integration practice

---

# Limitations

- WAQI live data depends on available monitoring stations.
- Some cities may have delayed or unavailable AQI readings.
- Demo mode uses synthetic but realistic AQI data.
- SQLite is intended for local development, not large-scale production.
- The assistant is rule-based and does not use a generative AI model by default.

---

# Future Improvements

- User authentication and accounts
- Saved user health profiles
- Scheduled AQI ingestion jobs
- PostgreSQL support for production
- Push notifications and alerts
- Model monitoring and retraining
- OpenAI, Gemini, or RAG-powered assistant integration
- Cloud deployment support

---

# Author

Developed by **Huzaifa** as a full-stack AI and environmental intelligence platform.

---

# License

This project is intended for:

- Learning
- Academic use
- Portfolio demonstrations
