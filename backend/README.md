# Trip Genie Backend

Express + MongoDB + Claude API backend for AI-generated travel itineraries.

## Setup

1. Copy `.env.example` to `.env`
2. Add your MongoDB URI, Anthropic API key, and JWT secret
3. Install deps:

```bash
npm install
```

4. Run in development:

```bash
npm run dev
```

## API Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/trips/generate`
- `POST /api/trips/save`
- `GET /api/trips/:id`
- `GET /api/trips/user/me`

### Generate Trip Body

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
