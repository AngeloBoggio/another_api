# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Backend (Express API):**
```bash
npm run dev          # Start backend with ts-node-dev (hot reload) on port 4000
```

**Frontend (React/Vite):**
```bash
npm run client       # Start Vite dev server on port 3000
npm run build        # Production build
npm run preview      # Preview production build
```

**Database scripts:**
```bash
npx ts-node-dev --transpile-only script.ts   # Run DB query script
npx ts-node-dev --transpile-only src/index.ts  # Run seed/import script (requires backend running)
npx prisma migrate dev   # Run migrations
npx prisma generate      # Regenerate Prisma client after schema changes
```

## Architecture

This is a full-stack app with two separate processes that must run concurrently in development:

- **Backend**: `src/server.ts` — Express 5 API on port 4000. Uses Prisma with the `@prisma/adapter-pg` driver (not the default Prisma client).
- **Frontend**: `src/App.tsx` + `src/BookCard.tsx` — React 19 SPA on port 3000. Vite proxies `/api/*` requests to `localhost:4000`, so the frontend uses relative `/api/` paths.

**Prisma setup** is non-standard: the client is generated to `generated/prisma/` (not the default location) and uses the `PrismaPg` adapter from `@prisma/adapter-pg`. The shared client instance lives in `lib/prisma.ts`.

**API endpoints** (all on port 4000):
- `GET /api/fake-book?_quantity=N` — Proxies to fakerapi.it to generate mock book data
- `POST /api/books` — Creates a book in the DB (title and author required)
- `GET /api/books/random` — Returns a random book from the DB

**Data seeding flow**: `src/index.ts` calls the local Express server (must be running) to fetch fake books and POST them into the DB. `script.ts` is a utility for ad-hoc Prisma queries directly against the DB.

**Environment**: Requires `DATABASE_URL` in `.env` (PostgreSQL connection string).
