# Fantasy Rankings Frontend

Next.js 16 (App Router) frontend for browsing 2026 fantasy football rankings, searching players, and viewing multi-season historical performance.

## Tech Stack

- **Framework**: Next.js 16 (`app/` router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk (`@clerk/nextjs`)
- **Logging & Telemetry**: `tslog` (`app/lib/log.ts`) and Azure Application Insights (`instrumentation.ts`)

## Project Structure

```text
frontend/
├── app/
│   ├── api/
│   │   └── players.ts                # Server/client fetch helpers for the FastAPI backend
│   ├── components/
│   │   ├── HistoricalPlayerCard.tsx  # Historical season stats display
│   │   └── NavBar.tsx                # Top navigation bar + Clerk auth controls
│   ├── interfaces/
│   │   ├── historical.ts             # Historical player TypeScript interfaces
│   │   └── rankings.ts               # Ranked player TypeScript interfaces
│   ├── lib/
│   │   └── log.ts                    # tslog logger instance
│   ├── players/[rank]/
│   │   ├── page.tsx                  # Player detail page by overall rank
│   │   └── PlayerInformation.tsx
│   ├── rankings/
│   │   ├── page.tsx                  # Full rankings board (uses Clerk token)
│   │   └── RankingCard.tsx
│   ├── search/
│   │   ├── page.tsx                  # Player search page
│   │   └── SearchBar.tsx
│   ├── sign-in/[[...sign-in]]/       # Clerk sign-in route
│   ├── globals.css
│   ├── layout.tsx                    # Root layout with ClerkProvider & NavBar
│   └── page.tsx                      # Landing page
├── instrumentation.ts                # Azure Application Insights setup (Node.js runtime)
├── next.config.ts                    # Marks applicationinsights packages as server-external
├── proxy.ts                          # Clerk middleware configuration
└── package.json
```

## Environment Variables

Loaded from the root `.env` (via Docker Compose) or `frontend/.env.local` for standalone local runs:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `BACKEND_URL` — FastAPI base URL (defaults to `http://localhost:8000` in `app/api/players.ts`)
- `APPLICATIONINSIGHTS_CONNECTION_STRING` *(optional)* — Enables Azure Application Insights in `instrumentation.ts`

## Local Development

From `frontend/`:

```bash
# Install dependencies
npm ci

# Start dev server on http://localhost:3000
npm run dev
```

Other available scripts:

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```
