# TGOS — Tek Guy Operating System

TGOS is the operational intelligence platform for Tek Guy On Demand.

Its purpose is to connect business systems, interpret operational activity, and answer one central question:

> Given everything TGOS knows, what should happen next?

## Product principles

TGOS is designed to:

- Observe activity across connected systems
- Organize customers, locations, assets, service, inventory, and knowledge
- Learn from operational history
- Recommend the next best action
- Automate repeatable work with appropriate human control

## Current milestone

**Genesis v0.6 — Multi-User COMMAND**

The current application includes:

- TGOS Genesis landing screen
- Protected `/command-center` route
- Multi-user username and password authentication
- Signed HTTP-only session cookies
- Owner and marketing roles
- Dynamic user greeting and role display
- Executive operational metrics
- Intelligence recommendation panel
- Operational health indicators
- Recent activity feed
- Navigation placeholders for future modules

The displayed business information is demonstration data. No production customer, service, inventory, or financial data is connected yet.

## Authentication configuration

Copy `.env.example` to `.env.local` for local development and replace every placeholder value.

```bash
cp .env.example .env.local
```

TGOS currently supports these configured users:

```text
TGOS_OWNER_USERNAME
TGOS_OWNER_PASSWORD
TGOS_MARKETING_USERNAME
TGOS_MARKETING_PASSWORD
TGOS_SESSION_SECRET
```

`TGOS_SESSION_SECRET` must be a long, random value and must not match either user's password. Store production values in Vercel Environment Variables rather than committing them to GitHub.

For a temporary transition, existing deployments may continue using `TGOS_USERNAME` and `TGOS_PASSWORD` as the owner credentials. The role-specific variables should be used for all new deployments.

## Planned modules

- Command Center
- Customers
- Locations
- Assets
- Service and dispatch
- Inventory and consumables
- Knowledge
- Intelligence
- Reports
- Settings and administration

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Signed server-side authentication sessions
- Planned: Supabase PostgreSQL and durable identity management
- Planned: OpenAI intelligence services
- Deployment target: Vercel at `portal.tekguyondemand.com`

## Local development

Install dependencies, configure `.env.local`, and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Project structure

```text
src/
├── app/
│   ├── api/auth/
│   ├── command-center/
│   ├── login/
│   └── page.tsx
├── components/dashboard/
└── lib/
    ├── auth.ts
    └── tgos/

docs/
└── architecture.md
```

The structure will expand as domain modules, persistence, integrations, and role-based authorization policies are introduced.

## Development workflow

- `main` is the stable production branch.
- New work is developed on `feature/*` branches.
- Feature branches must be reviewed through pull requests before merging.
- Run `npm run lint` and `npm run build` before merging.
- Secrets must never be committed. Use local environment variables and deployment-provider secret storage.

## Status

TGOS is an early operational platform foundation. The interface, recommendation engine, protected COMMAND dashboard, and first multi-user authentication layer are established. Persistence, live integrations, granular permissions, audit history, and production business data remain upcoming milestones.
