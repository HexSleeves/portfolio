# Railway Self-Hosting Refactor Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use senior-staff-engineer:subagent-driven-development (recommended) or senior-staff-engineer:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Manus-generated portfolio into a self-hostable Railway app with owned auth, owned storage, reliable migrations, and a single deployable Node service.

**Architecture:** Keep the existing React/Vite client, Express/tRPC server, Drizzle ORM, and PostgreSQL database. Deploy as one Railway web service that serves the built static client from Express and talks to a Railway PostgreSQL service through `DATABASE_URL`. Remove Manus runtime, Manus OAuth, Forge storage, and unused Forge helper APIs.

**Tech Stack:** React 19, Vite 7, Express 4, tRPC 11, Drizzle ORM, PostgreSQL, Railway, pnpm, Vitest, TypeScript.

---

## Current State

- App already has a single production build/start path in `package.json`.
- Production entrypoint is `server/_core/index.ts`.
- Vite config still includes `vite-plugin-manus-runtime`, `@builder.io/vite-plugin-jsx-loc`, and a custom Manus debug collector.
- Auth depends on Manus OAuth and environment variables such as `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, and `OWNER_OPEN_ID`.
- Storage/downloads depend on Forge/Manus routes like `/manus-storage/*`.
- Drizzle schema is PostgreSQL, but generated migrations and manual table creation scripts are inconsistent.
- `node_modules` was absent during initial review, so build/type/test verification still needs to happen during implementation.

## Recommended Approach

Use one Railway web service plus one Railway PostgreSQL service.

This avoids a frontend/backend split, avoids CORS, keeps existing tRPC paths relative (`/api/trpc`), and works with the existing Express production static serving model. The main work is deleting Manus coupling and replacing it with simple self-owned auth/storage/runtime configuration.

## Railway Constraints

- The server must listen on Railway's injected `PORT`.
- Add a `/healthz` endpoint and configure it as Railway's healthcheck path.
- Database migrations should run at runtime/deploy time, not build time, because Railway private networking is not available during build.
- Bind to `::` or `0.0.0.0`; prefer `::` for Railway private-network compatibility.

---

## Phase 1: Deployment Baseline

### Files

- Modify: `package.json`
- Modify: `server/_core/index.ts`
- Create: `railway.json`

### Changes

- [ ] Add `engines.node` to `package.json`, preferably Node 24.
- [ ] Add a Railway config file:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "pnpm install --frozen-lockfile && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "healthcheckPath": "/healthz",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

- [ ] Add `app.set("trust proxy", 1)` before route registration.
- [ ] Add `GET /healthz` before tRPC/static handlers.
- [ ] Remove `findAvailablePort()` and `isPortAvailable()` from `server/_core/index.ts`.
- [ ] Listen on exactly `Number(process.env.PORT ?? 3000)`.
- [ ] Use `server.listen(port, "::", callback)` or `server.listen(port, "0.0.0.0", callback)`.

### Verification

- [ ] Run `pnpm check`.
- [ ] Run `pnpm build`.
- [ ] Run `NODE_ENV=production PORT=3000 node dist/index.js`.
- [ ] Confirm `curl -i http://localhost:3000/healthz` returns HTTP 200.

---

## Phase 2: Remove Manus Runtime From Vite

### Files

- Modify: `vite.config.ts`
- Modify: `package.json`
- Delete: `client/public/__manus__/debug-collector.js`

### Changes

- [ ] Remove `@builder.io/vite-plugin-jsx-loc` import and usage.
- [ ] Remove `vite-plugin-manus-runtime` import and usage.
- [ ] Remove the custom `vitePluginManusDebugCollector()` implementation.
- [ ] Remove Manus-specific `allowedHosts` entries.
- [ ] Keep only `react()` and `tailwindcss()` in the Vite plugin list.
- [ ] Remove `@builder.io/vite-plugin-jsx-loc` and `vite-plugin-manus-runtime` from `devDependencies`.

### Verification

- [ ] Run `pnpm install --frozen-lockfile`.
- [ ] Run `pnpm check`.
- [ ] Run `pnpm build`.

---

## Phase 3: Replace Manus Auth

### Files

- Modify: `server/routers.ts`
- Modify: `server/_core/context.ts`
- Modify: `server/_core/cookies.ts`
- Modify: `server/_core/env.ts`
- Modify: `server/_core/trpc.ts`
- Modify: `client/src/_core/hooks/useAuth.ts`
- Modify: `client/src/components/RequireAdmin.tsx`
- Modify: `client/src/App.tsx`
- Create: `client/src/pages/admin/AdminLogin.tsx`
- Create: `server/_core/session.ts`
- Create: `server/_core/password.ts`
- Delete or stop using: `server/_core/oauth.ts`
- Delete or stop using: `server/_core/sdk.ts`
- Delete or replace: `client/src/const.ts`
- Delete or stop using: `client/src/components/ManusDialog.tsx`

### Changes

- [ ] Add self-owned admin login:
  - tRPC mutation: `auth.login`
  - input: `{ email: string; password: string }`
  - compare email with `ADMIN_EMAIL`
  - compare password with `ADMIN_PASSWORD_HASH`
  - issue signed JWT cookie with `JWT_SECRET`
- [ ] Keep `auth.me` and `auth.logout`.
- [ ] Use an internal admin user object when the session is valid.
- [ ] Keep `users` table for now to avoid a risky schema rename. Treat `openId` as an internal subject such as `admin`.
- [ ] Update `RequireAdmin` to redirect unauthenticated users to `/admin/login`.
- [ ] Add `/admin/login` route.
- [ ] Remove client-side Manus OAuth URL generation.
- [ ] Replace `sameSite: "none"` with `sameSite: "lax"` unless cross-site auth is intentionally required.
- [ ] Keep `secure: true` only when the original request is HTTPS or `NODE_ENV=production`.

### Verification

- [ ] Add tests for login success, invalid password, logout, and admin guard behavior.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm check`.
- [ ] Manually verify `/admin/login`, `/admin`, and `/api/trpc/auth.me`.

---

## Phase 4: Replace Storage

### Files

- Modify: `server/_core/index.ts`
- Modify: `client/src/pages/ResumePage.tsx`
- Modify: `client/src/components/HeroSection.tsx`
- Add: `client/public/assets/Jacob-LeCoq-Resume.pdf`
- Delete or stop using: `server/storage.ts`
- Delete or stop using: `server/_core/storageProxy.ts`

### Changes

- [ ] Move the resume PDF into `client/public/assets/Jacob-LeCoq-Resume.pdf`.
- [ ] Replace `/manus-storage/Jacob-LeCoq-Resume_8c936ce0.pdf` with `/assets/Jacob-LeCoq-Resume.pdf`.
- [ ] Remove `registerStorageProxy(app)` from the server startup.
- [ ] Delete Forge storage helpers if no admin upload feature uses them.

### Verification

- [ ] Run `pnpm build`.
- [ ] Start production server.
- [ ] Confirm `curl -I http://localhost:3000/assets/Jacob-LeCoq-Resume.pdf` returns HTTP 200.

---

## Phase 5: Fix Database And Migrations

### Files

- Modify: `drizzle/schema.ts`
- Modify: `drizzle.config.ts`
- Modify: `package.json`
- Modify: `seed.mjs`
- Delete: `create-tables.mjs`
- Replace/regenerate: `drizzle/*.sql`
- Replace/regenerate: `drizzle/meta/*.json`

### Changes

- [ ] Use PostgreSQL for self-hosting.
- [ ] Ensure Drizzle migrations include `users`, `blog_posts`, `projects`, and `site_settings`.
- [ ] Change blog `content` from `text` to `longtext` if content can exceed 64KB.
- [ ] Delete `create-tables.mjs`; it bypasses Drizzle.
- [ ] Split scripts:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:seed": "node seed.mjs"
}
```

- [ ] Decide whether Railway should run migrations in start command:

```json
{
  "railway:start": "pnpm db:migrate && pnpm start"
}
```

- [ ] If using automatic migrations, set Railway `startCommand` to `pnpm railway:start`.
- [ ] If using manual migrations, keep Railway `startCommand` as `pnpm start` and run `railway run pnpm db:migrate` before deploy activation.

### Verification

- [ ] Run `pnpm db:generate`.
- [ ] Run migrations against a disposable PostgreSQL database.
- [ ] Run `pnpm db:seed`.
- [ ] Confirm public `/projects` and `/blog` pages load seeded data.

---

## Phase 6: Remove Unused Forge Helpers

### Files

- Delete if unused: `server/_core/dataApi.ts`
- Delete if unused: `server/_core/map.ts`
- Delete if unused: `server/_core/llm.ts`
- Delete if unused: `server/_core/notification.ts`
- Delete if unused: `server/_core/imageGeneration.ts`
- Delete if unused: `server/_core/voiceTranscription.ts`
- Modify: `server/_core/env.ts`
- Modify: `server/_core/systemRouter.ts`
- Modify: `package.json`

### Changes

- [ ] Remove `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY` from server env.
- [ ] Remove `system.notifyOwner` if it only calls Manus notification service.
- [ ] Remove unused AWS SDK dependencies unless a new S3-compatible upload feature is implemented.
- [ ] Remove `axios` if it was only used for Manus OAuth.

### Verification

- [ ] Run `rg "BUILT_IN_FORGE|manus|Manus|OAUTH_SERVER|VITE_APP_ID|VITE_OAUTH"`.
- [ ] Run `pnpm check`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.

---

## Phase 7: Environment Validation And Runtime Hardening

### Files

- Modify: `server/_core/env.ts`
- Modify: `server/db.ts`
- Modify: `server/_core/index.ts`

### Changes

- [ ] Validate required env at startup with Zod.
- [ ] Required production env:

```text
NODE_ENV=production
PORT=<provided by Railway>
DATABASE_URL=<Railway PostgreSQL URL>
JWT_SECRET=<32+ byte random secret>
ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD_HASH=<argon2 or bcrypt hash>
```

- [ ] Fail fast in production if `DATABASE_URL` is absent.
- [ ] Allow no-DB fallback only in development if still useful.
- [ ] Use a real PostgreSQL connection pool and close it on `SIGTERM`.
- [ ] Add `SIGTERM` handler to stop the HTTP server before process exit.
- [ ] Ensure startup logs never print secrets.

### Verification

- [ ] Run production start without `DATABASE_URL` and confirm it fails clearly.
- [ ] Run production start with valid env and confirm `/healthz` returns 200.
- [ ] Send `SIGTERM` locally and confirm graceful shutdown log appears.

---

## Phase 8: Test Coverage

### Files

- Modify: `server/blog.test.ts`
- Modify: `server/auth.logout.test.ts`
- Create: `server/auth.login.test.ts`
- Create: `server/health.test.ts`

### Changes

- [ ] Remove `"manus"` login assumptions from tests.
- [ ] Add auth login tests:
  - valid admin credentials create a session cookie
  - invalid email fails
  - invalid password fails
  - missing password fails validation
- [ ] Add logout tests for cookie clearing.
- [ ] Add admin guard tests.
- [ ] Add `/healthz` smoke test.

### Verification

- [ ] Run `pnpm test`.
- [ ] Run `pnpm check`.
- [ ] Run `pnpm build`.

---

## Phase 9: Railway Setup

### Railway Services

- [ ] Create Railway project.
- [ ] Add web service from GitHub repo.
- [ ] Add Railway PostgreSQL service.
- [ ] Link PostgreSQL `DATABASE_URL` into the web service.

### App Variables

```text
NODE_ENV=production
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
JWT_SECRET=<generated 32+ byte secret>
ADMIN_EMAIL=<your email>
ADMIN_PASSWORD_HASH=<argon2/bcrypt hash>
```

### Deploy

- [ ] Configure healthcheck path: `/healthz`.
- [ ] Deploy.
- [ ] Run migrations.
- [ ] Run seed once:

```bash
railway run pnpm db:seed
```

### Production Verification

- [ ] `/healthz` returns 200.
- [ ] `/` loads.
- [ ] `/projects` loads DB content.
- [ ] `/blog` loads DB content.
- [ ] `/admin/login` works.
- [ ] `/admin` rejects unauthenticated users.
- [ ] Resume download works from `/assets/Jacob-LeCoq-Resume.pdf`.

---

## Execution Order

1. Server health, port binding, and Railway config.
2. Remove Manus Vite/runtime dependencies.
3. Replace Manus auth with owned admin auth.
4. Replace Manus storage links with static assets.
5. Fix Drizzle migrations and seed flow.
6. Delete unused Forge helper modules.
7. Add env validation and graceful shutdown.
8. Update tests.
9. Deploy to Railway.

## Acceptance Criteria

- `rg "manus|Manus|BUILT_IN_FORGE|OAUTH_SERVER|VITE_OAUTH|VITE_APP_ID"` returns no runtime dependencies.
- `pnpm check` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- `NODE_ENV=production PORT=3000 node dist/index.js` serves the app locally.
- Railway deploy passes healthcheck.
- Public pages load content from Railway PostgreSQL.
- Admin login works without Manus.
- Resume download works without Forge storage.

## Known Risks

- Auth replacement touches both frontend and backend route flow.
- Migration cleanup can destroy data if applied carelessly to a non-empty database. Test against a disposable DB first.
- `package.json` already has uncommitted dependency version changes; preserve or intentionally reconcile them before implementation.
- This workspace had no `node_modules` during initial review, so the initial review could not verify build/type/test status.
