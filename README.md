# Limitless Legacy

Website and admin dashboard for **Limitless Legacy**, which offers personalized learning support, learning packages and parent resources for children, families and educators.

## Features

**Public site**

- Home, About, Services and Contact pages. Copy is editable from the admin dashboard.
- Learning **packages** catalog (`/packages`)
- **Parent assessment** (`/parent-assessment`), which recommends support based on the parent's answers
- Sign-in (`/login`) with email and password, a magic link (sent through Resend) or GitHub

**Admin dashboard** (`/admin`, sign-in required)

- Analytics overview
- Manage packages, resources, site content, users and settings
- Review assessment submissions

## Tech stack

Bootstrapped with [create-t3-app](https://create.t3.gg/).

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- [tRPC 11](https://trpc.io) + [TanStack Query](https://tanstack.com/query)
- [Drizzle ORM](https://orm.drizzle.team) on PostgreSQL (hosted on [Supabase](https://supabase.com))
- [Better Auth](https://better-auth.com) with the organization (roles: owner, admin, member, customer) and magic-link plugins
- [Resend](https://resend.com) for transactional email
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) / Base UI
- pnpm

## Project structure

```
src/
  app/                 Next.js routes (public pages, /admin, /login, API routes)
    admin/             Admin dashboard pages
    api/auth/          Better Auth handler
    api/trpc/          tRPC handler
  components/ui/       shadcn/ui components
  server/
    api/routers/       tRPC routers (packages, resources, assessment, content, org, stats)
    better-auth/       Auth config, client and role permissions
    db/                Drizzle client and schema
  lib/supabase/        Supabase clients
  env.js               Typed env var validation
  middleware.ts        Redirects signed-out users away from /admin
drizzle/               SQL migrations
scripts/seed-org.ts    Seeds the organization and default site content
```

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in these values (`src/env.js` validates them):

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (pooled) |
| `DATABASE_URL_DIRECT` | Direct Postgres connection, used by migrations |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`). Required in production |
| `BETTER_AUTH_URL` | Public base URL of the app (default `http://localhost:3000`) |
| `BETTER_AUTH_GITHUB_CLIENT_ID` / `BETTER_AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |
| `RESEND_KEY` | Resend API key for magic-link emails |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SECRET_KEY` | Supabase secret key (server only) |

Set `SKIP_ENV_VALIDATION=1` to skip validation, for example in Docker builds.

### 3. Set up the database

To run Postgres locally in Docker, using the credentials from `DATABASE_URL`:

```bash
./start-database.sh
```

Apply the migrations and seed the organization and default content:

```bash
pnpm db:migrate
```

```bash
pnpm db:seed
```

### 4. Run the dev server

```bash
pnpm dev
```

The app runs at http://localhost:3000.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Build for production and serve it |
| `pnpm preview` | Build, then start |
| `pnpm check` | Lint + typecheck |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format:check` / `pnpm format:write` | Prettier |
| `pnpm db:generate` | Generate a migration from schema changes |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push the schema straight to the database (dev only) |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed the organization and site content |

## Deployment

The app is deployed on [Vercel](https://vercel.com). Set the environment variables above in the Vercel project settings, and point `BETTER_AUTH_URL` at the deployed domain so OAuth callbacks and email links resolve correctly.

Keep secrets out of committed config files. Use `.env`, which is gitignored, for local values and the hosting provider's settings for deployed ones.
