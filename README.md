# Fuerza 💪

**A social fitness network where lifters share workouts, follow each other, and message — built full-stack from schema to deploy.**

🔗 **[Live Demo →](https://fuerza-two.vercel.app)** — click **"Try the Live Demo"** on the login screen to explore the whole app instantly (no signup).

---

## What it is

Fuerza is a social platform for tracking and sharing workouts. Users post their
training sessions (exercises, sets, reps, weight, rest), build a feed by following
other athletes, discover people on an explore page, and message each other in real
time. It's a complete product, built end to end: relational schema, JWT-secured API,
and a React single-page app.

## Highlights

- **Workout feed & explore** — a "Following" feed and a public "Explore" view, with each post rendering a full workout breakdown.
- **Profiles & follows** — user profiles with bio, follower/following counts, post history, and follow/unfollow.
- **Direct messaging** — conversation list, threaded chat, and optimistic send.
- **Auth** — signup/login with JWT access + refresh tokens and protected routes.
- **Search** — find users by username, name, or gym.
- **Zero-backend Live Demo** — a custom axios adapter serves the entire app from an in-memory dataset, so the deployed site is fully interactive without a server and never breaks.

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18, React Router, Vite, Axios |
| Backend | Node.js, Express |
| Database | MySQL (relational schema with users, posts, workouts, follows, messages) |
| Auth | JWT (access + refresh tokens) |
| Infra | Docker, Vercel (frontend), Railway (backend + DB) |

## Architecture

```
client/   React SPA (Vite) — pages, components, service layer (axios)
server/   Express API — auth, posts, follows, messages, exercises
database/ MySQL schema + seed data
```

The frontend talks to the API through a thin service layer. In **Live Demo mode**, a
custom axios adapter (`client/src/demo/`) intercepts every request and responds from a
realistic in-memory store, so the app is fully usable with no backend running.

## Run locally

```bash
# install everything
npm run install-all

# set up the database (MySQL) and env files
cp server/.env.example server/.env   # fill in DB + JWT secrets
mysql < database/schema.sql

# run client + server together
npm run dev
```

Frontend: `http://localhost:5173` · API: `http://localhost:5001`

## Deployment

Frontend deploys to Vercel (builds `client/`), backend + MySQL to Railway.
See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full walkthrough.

---

Built by [Saleha Iftikhar](https://saleha.live).
