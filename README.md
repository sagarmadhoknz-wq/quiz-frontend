# Quiz Frontend

React + Vite frontend for the Spring Boot quiz tournament backend.

## Run

1. Install dependencies:

```bash
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Run frontend tests:

```bash
npm test
```

## Backend URL

The frontend expects the backend base URL through `VITE_API_BASE_URL`.

Example `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If not set, the frontend defaults to `http://localhost:8080`.

## Admin And Player Routing

- `/login`
  - Uses the backend login endpoint `POST /api/auth/login`
- `/admin`
  - Admin dashboard
- `/admin/tournaments/:tournamentId`
  - Admin tournament detail view
- `/player`
  - Player dashboard
- `/player/tournaments/:tournamentId`
  - Player tournament overview
- `/player/tournaments/:tournamentId/play`
  - Player quiz play flow
- `/player/tournaments/:tournamentId/result`
  - Result screen

Current routing role logic uses `user.role.toLowerCase()` from the backend login response.

## Known Limitations

- No category lookup endpoint exists.
  - Result: category selection currently uses a static category list in the frontend.
- No endpoint tells the frontend whether the current user has already liked a tournament.
  - Result: the like toggle is not state-aware, so the player detail page exposes separate Like and Unlike actions instead of a derived toggle state.

## Test Coverage Added

The frontend includes scaffolded tests for the rubric-focused admin flows:

- create tournament
- update tournament
- delete tournament
- viewing tournament questions

These tests use mocked service methods so they stay aligned with the current backend contract without inventing extra APIs.
