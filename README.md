# e-commerce

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, structured with **MVVM**.

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm lint
```

## Architecture

| Layer      | Folder        | Responsibility                                  |
| ---------- | ------------- | ----------------------------------------------- |
| View       | `src/views`   | Presentational components                       |
| ViewModel  | `src/viewmodels` | Client hooks: state + orchestration          |
| Service    | `src/services`| Data access (API / DB / mocks)                  |
| Model      | `src/models`  | Types + pure domain logic                       |
| Routes     | `src/app`     | Thin pages that render a View                   |

Flow: **View → ViewModel → Service → Model**.

Demo: `src/app/page.tsx` (Server Component) loads products via the service and
hands them to `ProductCatalogView`, which binds `useProductCatalog()` for
search and client-side refresh.

See `AGENTS.md` for conventions that AI agents follow in this repo.
