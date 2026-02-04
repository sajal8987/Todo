# Full-Stack Todo Application (JWT + Session Inactivity)

A complete Todo app with custom authentication, JWT in httpOnly cookies, inactivity-based session timeout, and full CRUD for user-owned todos.

- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React + Vite + Tailwind CSS
- Auth: Custom (no third-party auth), password hashing (bcrypt), sessions in DB, JWT in cookie

## Features

- Authentication: Register, Login, Logout, session persistence via cookie, inactivity timeout, session TTL
- Todos: Create, Read (own only), Update, Toggle complete, Delete, Filter by status
- UX: Loading states, form validation, error messages, empty states, todo counters, responsive UI

## Prereqs

- Node.js 18+
- MongoDB Atlas (or any MongoDB connection string)

## Local Setup

1. Backend env

Copy `server/.env.example` to `server/.env` and fill values.

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace_with_strong_secret
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
SESSION_INACTIVITY_MINUTES=30
SESSION_TTL_HOURS=24
```

2. Frontend env

Copy `client/.env.example` to `client/.env` (keep default if server runs at 5000).

```
VITE_API_BASE=http://localhost:5000/api
```

3. Install & run (two terminals)

Backend:
```
npm install
npm run dev
```
Run from `server/` directory.

Frontend:
```
npm install
npm run dev
```
Run from `client/` directory. App will be at http://localhost:5173.

## API Overview

- `POST /api/auth/register` { email, password, name? }
- `POST /api/auth/login` { email, password } -> sets httpOnly cookie
- `GET /api/auth/me` -> current user
- `POST /api/auth/logout` -> revoke session and clear cookie

Todos (auth required):
- `GET /api/todos?status=All|Pending|Completed`
- `POST /api/todos` { title, description }
- `PUT /api/todos/:id` { title?, description?, status? }
- `PATCH /api/todos/:id/toggle`
- `DELETE /api/todos/:id`

## Deployment

- Backend: Render/Railway. Configure environment variables and CORS `CLIENT_URL` to the deployed frontend URL. Enable cookies over HTTPS by setting `COOKIE_SECURE=true`.
- Frontend: Vercel/Netlify. Set `VITE_API_BASE` to your deployed backend base URL.

## Security Notes

- Passwords are hashed with bcrypt.
- JWT is stored in httpOnly cookie (not accessible by JS).
- Session records enforce inactivity timeout and TTL; tokens are invalidated when session is revoked or expired.
