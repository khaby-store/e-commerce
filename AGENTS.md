# AGENTS.md

## Stack

- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4
- Package manager: **pnpm**
- Scripts: `pnpm dev`, `pnpm build`, `pnpm lint` (plain `eslint`)

## Architecture: MVVM

All feature code lives under `src/` and follows Model–View–ViewModel:

```
src/
  app/          # Routes only. Pages stay thin: render a View, nothing else.
  models/       # Model: types + pure domain logic. No React, no I/O.
  services/     # Data access (API/DB/mock). Async, framework-free, no React.
  viewmodels/   # ViewModel: "use client" hooks. Owns state + orchestration,
                # calls services, exposes a typed view model to the View.
  views/        # View: presentational components. Render the view model,
                # no business logic, no direct service calls.
  components/   # Shared UI primitives (add when needed).
```

Dependency direction is one-way: `views → viewmodels → services → models`.

## Rules

- Pages in `src/app` stay thin: a Server Component page may call a Service
  once for initial data (wrap async calls in `<Suspense>`), then hand it to a
  View. All client state, refetching, and interactivity live in the ViewModel.
- Views are props-driven and testable without Next.js routing.
- No data fetching in `useEffect`; fetch initial data on the server.
- Read `node_modules/next/dist/docs/` before using unfamiliar Next.js APIs.
- Tailwind v4: styling is CSS-first (`@import "tailwindcss"` +
  `@theme` in `src/app/globals.css`), no `tailwind.config.js`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
