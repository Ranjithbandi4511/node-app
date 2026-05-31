# node-app

Express API for the `users` collection in the `dental-db` database (same data as Mongo Express).

## Setup

```bash
cd node-app
npm install
copy .env.example .env
```

## MongoDB + API (Docker — recommended)

Runs MongoDB, Mongo Express, and the Node API on one network (`mongo` hostname works for the API):

```bash
docker compose -f docker-compose.yaml up -d --build
```

API: http://localhost:5000/api/users  
Mongo Express: http://localhost:8081

## Run app on your machine (not in Docker)

MongoDB must be reachable on the host (`docker compose up mongo -d` or local mongod).

Use `localhost` in `.env` (not `mongo`).

```bash
npm run dev
```

Server: http://localhost:5000

## Docker only the API image

`docker run` alone cannot use `localhost` for Mongo — that points inside the container.

**Option A** — attach to the compose network (mongo already running):

```bash
docker compose up -d mongo
docker compose run --service-ports api
```

**Option B** — Mongo exposed on host port 27017 (`docker compose up -d mongo`):

```bash
docker build -t node-app:1.0 .
docker run -p 5000:5000 --env-file .env.docker node-app:1.0
```

**Option C** — script (API on same network as `mongo` container):

```powershell
docker build -t node-app:1.0 .
.\run-docker.ps1
```

Do **not** use plain `docker run -p 5000:5000 node-app:1.0` without `--env-file` or `-e` — Mongo is not on `localhost` inside the container.

## API — `/api/users`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

Fields: `user_name`, `email`, `password`, `age`, `city`.

```bash
curl http://localhost:5000/api/users
```
