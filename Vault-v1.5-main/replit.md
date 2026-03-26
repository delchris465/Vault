# Vault - Gaming Platform

## Overview
A web-based gaming hub with native React games and embedded external games. Features gamification (XP, levels, streaks, quests, achievements, store) and a full account system backed by PostgreSQL.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS 4
- **Backend**: Express.js API server (port 3001)
- **Database**: PostgreSQL (Replit built-in)
- **Auth**: JWT tokens (30-day sessions)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React

## Architecture

### Workflows
- **Start application** — `npm run dev` on port 5000 (Vite frontend)
- **API Server** — `npm run server` on port 3001 (Express backend, `tsx watch`)

### Vite Proxy
All `/api` and `/uploads` requests are proxied from port 5000 → port 3001, so frontend code uses relative paths like `/api/auth/login`.

### Database Schema
- `users` — credentials, profile info, coins/xp/level/streak
- `user_preferences` — language, sound, theme, notifications
- `game_progress` — per-game save data (JSONB) with playtime tracking
- `sessions` — JWT token store with expiry
- `game_sessions` — future multiplayer room state
- `game_session_players` — future multiplayer player roster

## Key Files
- `server/index.ts` — Express app entry point
- `server/routes/auth.ts` — register, login, logout, /me
- `server/routes/profile.ts` — profile update, picture upload, preferences, game-state sync
- `server/routes/progress.ts` — per-game save/load
- `server/auth.ts` — JWT sign/verify, requireAuth middleware
- `server/db.ts` — PostgreSQL pool
- `src/api/client.ts` — typed frontend API client (`authApi`, `profileApi`, `progressApi`)
- `src/context/GameContext.tsx` — global state with backend sync
- `src/components/AuthModal.tsx` — real login/register form (tabbed)
- `src/games/NeonClicker.tsx` — Sigma Clicker with cloud save

## Features
- Real account creation and login with hashed passwords
- JWT-based sessions stored in DB (invalidated on logout)
- Profile pictures uploaded to `public/uploads/` (served statically)
- Preferences (language, sound, theme) stored per user
- Sigma Clicker progress saved to DB for logged-in users, localStorage for guests
- Game state (coins/xp/level/streak) synced to DB with 3-second debounce
- Multiplayer tables pre-created for future WebSocket integration
- Guest mode still works with localStorage fallback
