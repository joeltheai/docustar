# Monorepo guide

How this project is organized and how to run it day to day.

## Layout

```
docustar/
├── apps/
│   ├── server/     # Effect HTTP API (Node)
│   └── web/        # React + TanStack Router + Effect Atom
├── packages/
│   └── domain/     # Shared Schema + HttpApi (single source of truth)
└── docs/           # Documentation
```

## Why `packages/domain`?

Both apps import `@docustar/domain` for the same `Schema` types and `HttpApi` definition. The server implements handlers; the web app derives a typed client via `HttpApiClient.make` — no duplicated types or hand-written fetch URLs.

## Why TanStack Router (not Start)?

This project has a separate Effect backend. TanStack Start is for full-stack apps with SSR and colocated API routes in one process. TanStack Router + Vite + a dev proxy is the simpler fit when frontend and backend are separate apps.

Use Start later if you want SSR or server functions in the same app. For now, `apps/server` and `apps/web` run independently.

## Prerequisites

- Node.js 20+
- pnpm 9+

## Setup

```bash
pnpm install
```

## Development

Run both apps (two terminals, or one command):

```bash
pnpm dev
# or separately:
pnpm dev:server   # http://localhost:3001
pnpm dev:web      # http://localhost:5173  (proxies /api → server)
```

Open http://localhost:5173 — the home page loads documents from the Effect API.

## Where packages live

| Package | Installed in | Purpose |
|---------|--------------|---------|
| `effect` | root override + each app | Core Effect v4 |
| `@effect/platform-node` | `apps/server` | Node HTTP server |
| `@effect/atom-react` | `apps/web` | React hooks for Effect Atom |
| `@docustar/domain` | both apps (`workspace:*`) | Shared schemas + API |

Install app-specific deps inside that app's `package.json`. Shared code goes in `packages/`.

## Next steps (collaborative editing)

1. **WebSockets** — `effect/unstable/socket` for real-time document sync
2. **CRDT / OT** — operational transform or Yjs for merge semantics
3. **Persistence** — `effect/unstable/sql` when you need a database

The in-memory store in `apps/server/src/store.ts` is a placeholder.

## Effect v4 notes

- HTTP API: `effect/unstable/httpapi` (not `@effect/platform` — that's v3)
- Atoms: `effect/unstable/reactivity/Atom` + `@effect/atom-react`
- Pin matching beta versions across all `@effect/*` packages (see root `package.json` `pnpm.overrides`)
