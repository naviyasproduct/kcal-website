# kcal

Sri Lankan meal subscriptions: 3 meals a day, matched to your body and goal.

Build spec: [MASTER_PROMPT.md](MASTER_PROMPT.md).

## Requirements

- Node.js 24+
- PostgreSQL 16+ (needed from step 2)

## Setup

```bash
npm install
cp .env.example .env   # then fill in every value
```

The server validates `.env` at startup and refuses to start if anything is missing or invalid.

## Commands

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the dev server on :3000           |
| `npm run build`        | Production build                        |
| `npm start`            | Run the production build                |
| `npm run lint`         | ESLint (fails on any warning)           |
| `npm run typecheck`    | TypeScript check                        |
| `npm run format`       | Format with Prettier                    |
| `npm run format:check` | Check formatting                        |
| `npm test`             | Run unit tests (Vitest)                 |
| `npm run check`        | Lint + typecheck + format check + tests |

## Structure

```
app/          routes and pages (no business logic)
components/   UI components
lib/          business logic, validation, security
prisma/       schema and seed
```

## Theming

All colours and fonts are defined once in the `@theme` block of [app/globals.css](app/globals.css).
Components use only the semantic names (`bg-surface`, `text-ink`, `border-line`, `bg-action`, ...).
To apply the brand, change the values there.

## Security headers

Set for every response in [lib/security/headers.ts](lib/security/headers.ts), applied via
[next.config.ts](next.config.ts).
