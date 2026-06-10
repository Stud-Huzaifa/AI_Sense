# Simple Render Deployment

This project now deploys as one Render service.

Render builds the React frontend, copies it into the FastAPI backend, and serves everything from one URL.

## Deploy

1. Push the repository to GitHub.
2. Open Render.
3. Click **New > Blueprint**.
4. Select this repository.
5. Render detects the root `render.yaml`.
6. Click **Apply**.

That is it.

## What Render Creates

- One web service named `airsense-ai`
- One public URL like `https://airsense-ai.onrender.com`

## Settings

The app runs in demo mode by default:

```env
DEMO_MODE=true
DATABASE_URL=sqlite:///./airsense.db
```

No external database and no API token are required.

## Check After Deploy

Open:

```text
https://airsense-ai.onrender.com
```

Health check:

```text
https://airsense-ai.onrender.com/health
```
