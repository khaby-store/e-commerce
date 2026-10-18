# e-commerce

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.

The site root `/` is a **1-to-1 static replica** of a saved nordstrom.com
homepage (captured markup + captured stylesheets + captured assets — see
`AGENTS.md` for how it's generated and verified).

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000  → the replica
pnpm build
pnpm lint
```

## Architecture (for new feature code)

Feature code follows MVVM:

| Layer     | Folder           | Responsibility                       |
| --------- | ---------------- | ------------------------------------ |
| View      | `src/views`      | Presentational components            |
| ViewModel | `src/viewmodels` | Client hooks: state + orchestration  |
| Service   | `src/services`   | Data access (API / DB / mocks)       |
| Model     | `src/models`     | Types + pure domain logic            |
| Routes    | `src/app`        | Thin pages that render a View        |

Flow: **View → ViewModel → Service → Model**.

The replica markup itself is exempt — it stays verbatim (see `AGENTS.md`).

See `AGENTS.md` for conventions that AI agents follow in this repo.
