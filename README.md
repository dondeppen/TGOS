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

**Genesis v0.2 — Command Center Shell**

The current application includes:

- TGOS Genesis landing screen
- Working `/command-center` route
- Executive operational metrics
- Intelligence recommendation panel
- Service pulse indicators
- Recent activity feed
- Navigation placeholders for future modules

The displayed business information is demonstration data. No production customer, service, inventory, or financial data is connected yet.

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
- Planned: Supabase PostgreSQL and authentication
- Planned: OpenAI intelligence services
- Planned deployment: Vercel at `portal.tekguyondemand.com`

## Local development

Install dependencies and start the development server:

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
src/app/
├── page.tsx
└── command-center/
    └── page.tsx

docs/
└── architecture.md
```

The structure will expand as domain modules and backend services are introduced.

## Development workflow

- `main` is the stable branch.
- New work is developed on `agent/*` feature branches.
- Feature branches should be reviewed through pull requests before merging.
- Secrets must never be committed. Use local environment variables and deployment-provider secret storage.

## Status

TGOS is currently an early product foundation. The interface and product direction are established; authentication, persistence, integrations, intelligence processing, and production deployment remain upcoming milestones.
