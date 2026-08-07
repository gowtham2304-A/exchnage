# Deploying PulseBoard

This project is split: frontend is deployed to Vercel, backend is deployed to Render (web service).

Backend (Render)
- Connect this repository to Render and create a new **Web Service** using the existing `render.yaml` manifest.
- Render settings:
  - Build Command: `npm install`
  - Start Command: `npm start` (already present in `package.json`)
  - Health check path: `/api/health`
- Environment variables to set in Render (set as secrets):
  - `GITHUB_OWNER` (repo owner to poll)
  - `GITHUB_REPO` (repo name to poll)
  - `GITHUB_TOKEN` (personal access token with `repo` scope)
  - `GEMINI_API_KEY` (optional, for LLM features)
  - `ALLOWED_ORIGINS` (comma-separated origins allowed by CORS, e.g. `https://your-frontend.vercel.app`)

Frontend (Vercel)
- Import the project into Vercel (it will use `vercel.json` and the `build` script).
- In Vercel project settings > Environment Variables, set:
  - `VITE_API_BASE_URL` = `https://<your-backend>.onrender.com` (no trailing `/api`, the client will append `/api`)
- Deploy the frontend.

Notes
- Locally, use `.env` or `.env.local` and set `VITE_API_BASE_URL` to `http://localhost:5000` for development.
- On Render, make sure `ALLOWED_ORIGINS` includes your Vercel frontend origin so the browser can call the API.
- If you prefer to host both frontend and backend on Render, you can create a second static site service for the frontend instead of using Vercel.
