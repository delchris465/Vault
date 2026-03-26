# Vault - Gaming Platform

## Overview
Vault is a multi-featured online gaming platform with 45+ games, a deep progression system, virtual economy, social features, and full user authentication.

## Architecture
- **Frontend**: React 19 + TypeScript + Vite (port 5000) — located in `Vault-v1.5-main/`
- **Backend**: Node.js + Express API server (port 3001) — located in `Vault-v1.5-main/server/`
- **Database**: Replit PostgreSQL (DATABASE_URL set as secret)
- **Auth**: JWT-based sessions stored in `sessions` table

## Workflows
- **Start application** — `cd Vault-v1.5-main && npm run dev` (webview, port 5000)
- **API Server** — `cd Vault-v1.5-main && npm run server` (console, port 3001)

The Vite dev server proxies `/api` and `/uploads` requests to the backend at `localhost:3001`.

## Database Schema
Tables: `users`, `sessions`, `user_preferences`, `game_progress`

## Key Features
- 45+ games across categories: Action, Puzzle, Sports, IO, Classics, Sandbox, etc.
- XP/leveling/prestige system
- Daily streaks and rewards
- Virtual coin economy with a store
- Daily/weekly quests and 35+ achievements
- Guest mode (local storage) and full registered accounts (PostgreSQL/JWT)
- Profile customization: avatar, banner, name color, bio

## Environment Variables (Secrets)
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — individual DB credentials

## Project Structure
```
Vault-v1.5-main/
  src/
    components/     — UI components
    context/        — GameContext (state management)
    games/          — Native React games
    data/           — Game registry and data
    api/            — API client
  server/
    index.ts        — Express server entry
    auth.ts         — JWT middleware
    db.ts           — PostgreSQL pool
    routes/
      auth.ts       — Register/login/logout/me
      profile.ts    — Profile updates, preferences
      progress.ts   — Game progress sync
```
