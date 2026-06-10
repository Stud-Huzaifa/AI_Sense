# Render Deployment

This repository includes a root-level `render.yaml` Blueprint for deploying both services:

- `airsense-ai-api`: FastAPI backend on Render Web Services.
- `airsense-ai`: Vite React frontend on Render Static Sites.
- `airsense-ai-db`: Render Postgres for persistent application data.

## Deploy

1. Push the repository to GitHub.
2. In Render, choose **New > Blueprint**.
3. Select the repository and let Render detect `render.yaml` from the repository root.
4. When prompted, enter `WAQI_TOKEN` or leave it blank.
5. Deploy the Blueprint.

The frontend is configured to call:

```text
https://airsense-ai-api.onrender.com
```

If Render asks you to rename either service because the default name is unavailable, update these two values after creation:

- Frontend environment variable `VITE_API_BASE_URL`
- Backend environment variable `CORS_ORIGINS`

## Runtime Notes

- The backend start command binds to Render's `$PORT`.
- Python is pinned to `3.11.11` for compatibility with the ML dependency set.
- `/health` is used as the health check endpoint.
- Demo mode is enabled by default, so the project works without an API token.
- Set `DEMO_MODE=false` and provide `WAQI_TOKEN` for live WAQI readings.
- Free Render Postgres instances expire after 30 days. Upgrade the database plan for long-term production storage.
