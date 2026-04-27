# Trip Genie Frontend

Light-mode React frontend for AI trip generation with JWT auth.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` and set:

```bash
VITE_API_URL=http://localhost:5000
```

3. Start dev server:

```bash
npm run dev
```

## Pages

- `/` - Landing page
- `/login` - Login
- `/register` - Register
- `/generate` - Protected trip generator
- `/saved-trips` - Protected trip history
- `/trips/:id` - Protected trip details
