# Scaffolding from scratch

Step-by-step guide to recreate this monorepo using CLI commands. The initial scaffold was created by hand (no single CLI generates Effect + TanStack + a shared domain package), but each piece has a standard CLI where one exists.

## Overview

You need four pieces:

1. **pnpm workspace** — root monorepo
2. **`packages/domain`** — shared Effect schemas + HttpApi
3. **`apps/server`** — Effect v4 HTTP API on Node
4. **`apps/web`** — Vite + React + TanStack Router + Effect Atom

---

## 1. Root workspace

```bash
mkdir docustar && cd docustar
pnpm init
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Add scripts and Effect version pinning to root `package.json`:

```bash
# Example — edit package.json to add:
# "scripts": { "dev": "pnpm run --parallel dev", ... }
# "pnpm": { "overrides": { "effect": "4.0.0-beta.79" }, "onlyBuiltDependencies": ["esbuild"] }
```

Create the folder structure:

```bash
mkdir -p apps/server/src apps/web/src/routes packages/domain/src docs
```

---

## 2. Shared domain package

No dedicated CLI for this — it's a small internal package.

```bash
cd packages/domain
pnpm init
```

Set in `package.json`:

- `"name": "@docustar/domain"`
- `"type": "module"`
- `"exports": { ".": "./src/index.ts" }`

Install Effect:

```bash
pnpm add effect@4.0.0-beta.79
pnpm add -D typescript
```

Create `src/schemas.ts`, `src/api.ts`, and `src/index.ts` (see the repo for the current files). The key idea: define `Schema` types and `HttpApi` endpoints once, import them from both apps.

---

## 3. Effect server (`apps/server`)

No official Effect scaffold CLI yet for v4. Create manually:

```bash
cd ../../apps/server
pnpm init
```

Set `"name": "@docustar/server"`, `"type": "module"`.

Install dependencies:

```bash
pnpm add effect@4.0.0-beta.79 @effect/platform-node@4.0.0-beta.79 @docustar/domain@workspace:*
pnpm add -D typescript tsx @types/node
```

Add scripts:

```json
"scripts": {
  "dev": "tsx watch src/main.ts",
  "build": "tsc",
  "start": "node dist/main.js"
}
```

Create `src/main.ts`, `src/documents.ts`, and `src/store.ts`. The server wires:

- `HttpApiBuilder.group` — implement endpoints from `@docustar/domain`
- `HttpApiBuilder.layer` — register the API
- `HttpRouter.serve` — run as HTTP server
- `NodeHttpServer.layer` — Node.js runtime
- `NodeRuntime.runMain` — entry point

Imports use v4 paths:

```ts
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { HttpRouter } from "effect/unstable/http"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
```

---

## 4. Web app (`apps/web`)

### Option A: Vite CLI (what this repo uses)

Scaffold a React + TypeScript app with Vite:

```bash
cd ../web
pnpm create vite . --template react-ts
```

When prompted for the directory, use `.` if you're already in `apps/web`, or scaffold elsewhere and move files in.

Install TanStack Router and Effect:

```bash
pnpm add @tanstack/react-router effect@4.0.0-beta.79 @effect/atom-react@4.0.0-beta.79 @docustar/domain@workspace:*
pnpm add -D @tanstack/router-plugin @vitejs/plugin-react typescript vite
```

Configure `vite.config.ts`:

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
```

The router plugin must come **before** the React plugin.

Add file-based routes under `src/routes/`:

- `__root.tsx` — root layout (wrap with `RegistryProvider` from `@effect/atom-react`)
- `index.tsx` — home page

Wire the router in `src/main.tsx` per [TanStack Router Vite docs](https://tanstack.com/router/latest/docs/framework/react/installation/with-vite).

On first `pnpm dev` or `pnpm build`, the router plugin generates `src/routeTree.gen.ts`. Commit that file so others don't need to run dev first.

### Option B: TanStack Router CLI

TanStack also ships a create command that can scaffold a Router project:

```bash
pnpm create @tanstack/router@latest
```

Follow the prompts (React, file-based routing, Vite). Then add Effect packages and `@docustar/domain` as above. You still need to add the Vite dev proxy and domain package yourself.

### Option C: TanStack Start (not used here)

```bash
pnpm create @tanstack/start@latest
```

Use this only if you want a full-stack app with SSR. This repo keeps the backend separate, so Start is not the right default.

---

## 5. Wire workspace dependencies

From the repo root:

```bash
pnpm install
```

pnpm links `workspace:*` dependencies between packages automatically.

---

## 6. Verify

```bash
# Terminal 1
pnpm dev:server

# Terminal 2
pnpm dev:web
```

Or both at once:

```bash
pnpm dev
```

- API: http://localhost:3001/documents
- Web: http://localhost:5173 (fetches via `/api/documents` proxy)

Build check:

```bash
pnpm --filter @docustar/web build
```

---

## Why no single CLI?

This stack combines:

| Piece | CLI available? |
|-------|----------------|
| pnpm workspace | `pnpm init` + manual `pnpm-workspace.yaml` |
| Vite + React | `pnpm create vite` |
| TanStack Router | `pnpm create @tanstack/router` or router Vite plugin |
| Effect v4 HTTP API | Manual (v4 is beta; APIs live in `effect/unstable/*`) |
| Shared domain package | Manual (project-specific) |
| Effect Atom | Manual (`@effect/atom-react` + `effect/unstable/reactivity/Atom`) |

No one tool scaffolds all of that together. The usual approach is: Vite CLI for the frontend, manual Effect server, and a `packages/domain` folder for shared types — same pattern used by projects like T3 Code (`packages/contracts`).

---

## Version pinning

Effect v4 beta requires matching versions across ecosystem packages:

```json
// root package.json
"pnpm": {
  "overrides": {
    "effect": "4.0.0-beta.79"
  }
}
```

When upgrading, bump `effect`, `@effect/platform-node`, and `@effect/atom-react` to the **same** beta version.
