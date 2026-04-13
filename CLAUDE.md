# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite hot reload)
npm run build        # Type-check + production build
npm run build-only   # Production build without type-check
npm run type-check   # TypeScript check only
npm run lint         # ESLint with auto-fix
npm run format       # Prettier format src/
npm run preview      # Preview production build locally
```

## Architecture

Vue 3 + TypeScript + Vite SPA displaying matchmaking statistics for a TrackMania competitive platform. The backend API is at `VITE_API_BASE_URL` (configured in `.env`).

### Data Fetching Pattern

All API access goes through `src/api/client.ts` (static `APIClient` class). The core pattern uses a custom reactive wrapper:

```typescript
const { data, error, loading, fetchFn } = APIClient.getXxx(reactiveParam1, reactiveParam2)
```

- `fetchAndCatch<T>()` returns reactive refs (`data`, `error`, `loading`) plus `fetchFn` to manually re-trigger
- `urlManager()` wraps `fetchAndCatch` and auto-fetches when reactive URL params change via `watch()`
- Components pass `Ref<T>` values as arguments; changes auto-trigger re-fetches
- `options: { lazy: true }` defers initial fetch until `fetchFn()` is called manually

API entities/interfaces live in `src/api/entities.ts`.

### Routing

Hash-based history (`createWebHashHistory`). Main routes:
- `/active-players` — live player list with ELO/rank filters
- `/last-games` — recent match history
- `/current-status` — server status over time
- `/statistics` — player/country/global stats with tabs; supports `/statistics/:playerId` and `/statistics/tab/:tabName`
- `/thread-health` — backend thread health

### Component Structure

- `src/views/` — page-level components (one per route)
- `src/components/stats/` — statistics panels organized by context (`player/`, `country/`, `global/`, `leaderboard/`, `ranks/`)
- `src/components/charts/` — Highcharts wrappers (Heatmap, Line, Map, StackedBar)
- `src/components/basic/` — reusable UI primitives (Rank, Loading, Table, Card, Icon)
- `src/components/management/` — ThemeManager, ErrorManager

### Styling

Bootstrap 5.3.3 + custom SCSS in `src/assets/main.scss`. FontAwesome 6 for icons. No scoped styles — all global via SCSS or Bootstrap utility classes.

### Charts

Highcharts 11 with Vue wrapper (`highcharts-vue`). Maps, stock, and heatmap modules are registered in `src/main.ts`. Chart components receive pre-shaped data as props and construct Highcharts options internally.

### Constants & Utilities

- `src/constants.ts` — rank definitions (ELO thresholds, names, images) and season configuration
- `src/utils.ts` — ManiaPlay string formatting, date helpers, country code conversion
