# OpsDesk

A NOC simulator for people who've been there.

**Live:** [opsdesk-nine.vercel.app](https://opsdesk-nine.vercel.app)

## What It Is

OpsDesk is an interactive IT operations simulator. Incidents arrive. You triage them. A score tracks your decisions. Someone walks up to your desk about the printer. The printer has opinions.

Built as a portfolio project by a senior IT professional with 30+ years in enterprise support, NOC operations, and service desk management. The humor is accurate. The tickets are real. The printer is still down.

## Tech Stack

- **Next.js** — App Router, file-based routing, API routes
- **TypeScript** — End to end type safety
- **React** — Hooks, refs, state management, conditional rendering
- **Prisma ORM** — Schema design, PostgreSQL adapter, CRUD operations
- **Neon PostgreSQL** — Serverless production database
- **Tailwind CSS** — Utility-first styling, custom animations
- **Vercel** — CI/CD deployment from GitHub

## Features

- **Incident Surge** — Choreographed ticket sequence with prioritized sound design
- **Scoring System** — Base points with priority multipliers, correct-answer bonuses, and penalties
- **Walk-Up Event** — Mid-shift interruption with audio and branching choices
- **Runbook Library** — NOC Quick Reference Guide and auto-generated shift performance reviews
- **Pay Stub System** — 7-tier rewards based on shift score
- **Metrics Dashboard** — Career stats persisted across sessions via localStorage
- **Reporter Names** — Named cast with numbered duplicates for repeat submitters
- **Sound Design** — Alert thuds, resolution whoosh, prayer bowl, throat clear walk-up

## Architecture

```
app/
├── page.tsx              # Dashboard — server component, live incident count
├── incidents/page.tsx    # Game board — client component, full shift logic
├── runbook/page.tsx      # Shift log, NOC guide, pay stub
├── metrics/page.tsx      # Career stats from localStorage
├── api/
│   └── incidents/
│       ├── route.ts      # CRUD — GET, POST, PATCH, DELETE
│       └── generate/route.ts  # Incident pool generator
lib/
├── incidents.ts          # Incident pool with reporter names
├── reviewResponses.ts    # Scoring bonuses, review text, summary generator
prisma/
└── schema.prisma         # Incident model — PostgreSQL via Neon
```

## Local Development

```bash
git clone https://github.com/steves2571/opsdesk.git
cd opsdesk
npm install
```

Create `.env` with your Neon database URL:

```
DATABASE_URL=postgresql://...
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open `localhost:3000`. Start your shift.

## The Printer

The printer is on Floor 3. The toner light is amber. It has been amber. A technician was dispatched in Q2. The technician has not returned. His badge still works.

Do not approach the printer.
