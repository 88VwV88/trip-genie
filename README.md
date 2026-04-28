# Trip Genie

Trip Genie is a full-stack AI travel planner that generates complete itineraries from a few user inputs.  
It includes authentication, trip generation, saved trips, and a polished trip details dashboard with section-level regeneration.

## What This Project Does

- Generates personalized trips using Anthropic Claude.
- Creates one clear trip plan per request (simple flow, no trip version restore system).
- Lets users refresh specific sections like timeline, budget, hotels, and top places.
- Stores user trips in MongoDB for later access.
- Provides a modern React UI with protected routes and JWT-based auth.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose), Zod, JWT, bcrypt
- AI: Anthropic API via `@anthropic-ai/sdk`

## Project Structure

```text
trip-genie/
  backend/        # Express API + MongoDB + AI integration
  frontend/       # React app (Vite + Tailwind)
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB running locally or a cloud MongoDB URI
- Anthropic API key

## Environment Variables

### Backend (`backend/.env`)

Start from `backend/.env.example`:

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/trip-genie
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-sonnet-4-0
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5001
```

## Local Development Setup

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Run backend

```bash
cd backend
npm run dev
```

### 3) Run frontend

```bash
cd frontend
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:5001`

## Run with Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5001`
- MongoDB on `mongodb://localhost:27017`

Notes:

- Keep `backend/.env` present for backend secrets (`ANTHROPIC_API_KEY`, `JWT_SECRET`, etc.).
- In Docker, backend uses the internal MongoDB service automatically.
- Stop containers with `docker compose down` (add `-v` to remove MongoDB volume data).

## Frontend Pages

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/generate` - Guided trip generation form (protected)
- `/saved-trips` - User trip history (protected)
- `/trips/:id` - Rich trip detail dashboard (protected)

## API Overview

Base URL (local): `http://localhost:5001`

### Health

- `GET /health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Trips

- `POST /api/trips/generate`
- `POST /api/trips/save`
- `PATCH /api/trips/:id/regenerate-section`
- `GET /api/trips/user/me`
- `GET /api/trips/:id`

## Example Generate Trip Request

`POST /api/trips/generate`

```json
{
  "destination": "Manali",
  "days": 4,
  "budget": "15000 INR",
  "interests": ["nature", "food", "adventure"],
  "style": "budget",
  "month": "December"
}
```

## Trip Data Shape (High Level)

Each trip stores:

- user details (via `userId`)
- core inputs (`destination`, `days`, `budget`, `style`, `interests`, `month`)
- generated itinerary object:
  - overview and destination summary
  - budget estimate
  - top places
  - hotel recommendations
  - daily itinerary with activities
  - booking links
  - extra travel/safety tips and hidden gems

## Scripts

### Backend

- `npm run dev` - Run backend with nodemon
- `npm start` - Run backend in standard node mode

### Frontend

- `npm run dev` - Run Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Current Product Notes

- Trip planning is intentionally simplified to one active trip plan per generation.
- Trip detail UI focuses on clarity and premium visual hierarchy.
- Section regeneration updates the itinerary directly without maintaining a visible version timeline.

## Troubleshooting

- If frontend cannot call API, verify `VITE_API_URL` points to backend.
- If auth fails, confirm `JWT_SECRET` and token handling are configured correctly.
- If generation fails, validate `ANTHROPIC_API_KEY` and model access.
- If DB connection fails, check `MONGODB_URI` and MongoDB service status.

## License

No explicit license file is included yet. Add a `LICENSE` file if you plan to distribute this project publicly.
