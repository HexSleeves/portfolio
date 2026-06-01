# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm-managed TypeScript portfolio app with a Vite React client and an
Express/tRPC server.

- `client/`: Vite app shell. Source lives in `client/src/`, with pages,
  components, hooks, stores, contexts, content, and CSS.
- `server/`: Node server entrypoint and backend modules. Core server utilities
  are under `server/_core/`; route tests are colocated as `server/*.test.ts`.
- `shared/`: code shared between client and server, imported with
  `@shared/*`.
- `drizzle/`: database schema, generated SQL migrations, and migration
  metadata.
- `docs/`, `client/public/`, and `dist/`: documentation, static assets, and
  generated build output.

## Build, Test, and Development Commands

Use pnpm with Node 24 or newer.

- `pnpm dev`: run the development server with `tsx watch`.
- `pnpm build`: build the Vite client and bundle the server into `dist/`.
- `pnpm start`: run the production server from `dist/index.js`.
- `pnpm check`: run TypeScript validation with `tsc --noEmit`.
- `pnpm test`: run Vitest once.
- `pnpm format`: format the repository with Prettier.
- `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`: manage Drizzle
  migrations.

## Coding Style & Naming Conventions

Write strict TypeScript and prefer existing local patterns before adding new
abstractions. Prettier is authoritative: 2-space indentation, semicolons, double
quotes, trailing commas where valid in ES5, and 80-column print width. Use the
configured aliases `@/*` for `client/src/*` and `@shared/*` for
`shared/*`. Name React components in PascalCase, hooks as `useThing`, and
tests as `*.test.ts` or `*.spec.ts`.

## Testing Guidelines

Vitest runs in a Node environment and includes `server/**/*.test.ts`,
`server/**/*.spec.ts`, `client/src/**/*.test.ts`, and
`client/src/**/*.spec.ts`. Add focused tests near the behavior being changed.
For server work, cover routes, auth/session behavior, and database-facing edge
cases. Run `pnpm test` plus `pnpm check` before handing off code changes.

## Commit & Pull Request Guidelines

Recent history uses short imperative commits, usually Conventional Commit
prefixes such as `feat:`, `refactor:`, and `chore:`; keep that style unless
the change is clearly following an existing non-prefixed pattern. Pull requests
should include a concise summary, linked issue or motivation when relevant,
verification commands run, and screenshots or recordings for visible UI changes.

## Security & Configuration Tips

Keep secrets in `.env` and document required variables in `.env.example`.
Do not commit generated output from `dist/` unless a release process explicitly
requires it. When editing database schema, include the matching Drizzle migration
and verify migration commands locally.
