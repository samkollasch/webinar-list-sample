# Webinar List — Code Sample

A standalone Next.js app showing client-side data fetching with TanStack
Query, a paginated/filterable React component, a Next.js route handler
backed by a small in-memory repository, and a Vitest suite covering the
pure logic, the route handler, and the component end-to-end.

Extracted and adapted from a production marketing site for an interview
submission.

## What this sample demonstrates

| Area of emphasis | Where to look |
| --- | --- |
| **TypeScript** | Strict mode across the project. See `src/types.ts` and `src/lib/pagination.ts` for the public domain types. |
| **Meaningful React component** | `src/components/webinar-list.tsx` — paginated list with category filter, error state, skeleton loading, and SSR hydration. |
| **React Hooks** | `useQuery`, `useState`, `useEffect`, and `useRef` driving smooth scroll-to-list on page change. |
| **State management** | URL-style query parameters (`page` + `category`) modeled as local React state and reflected into the TanStack Query cache key. |
| **Data fetching** | `@tanstack/react-query` with `initialData`, `placeholderData`, request cancellation via `AbortSignal`, and stale-time tuning. |
| **Next.js + Node.js** | App Router server component (`app/page.tsx`) plus a route handler (`app/api/webinar-list/route.ts`) that validates input and serves cache-friendly JSON. |
| **Automated testing** | Vitest + Testing Library. Pure-TS coverage in `tests/pagination.test.ts`, route-level coverage in `tests/route.test.ts`, and component coverage in `tests/webinar-list.test.tsx` (with a mocked `fetch`). |

## Running locally

```bash
pnpm install      # or npm install / yarn
pnpm dev          # http://localhost:3000
pnpm test         # run the Vitest suite
pnpm build        # production build, ready for Vercel
```

The repository is fully self-contained — no environment variables, no
external services. Deploy to Vercel with `vercel` and the API route
will work out of the box.

## File map

```
webinar-list-sample/
├── app/
│   ├── api/
│   │   └── webinar-list/
│   │       └── route.ts           # GET handler, validation, cache headers
│   ├── layout.tsx                 # Wraps the app in <Providers />
│   ├── providers.tsx              # QueryClientProvider, lazy-instantiated
│   ├── page.tsx                   # Server component, SSR-prefetches page 1
│   └── globals.css                # Tailwind entry point
├── src/
│   ├── components/
│   │   ├── webinar-list.tsx       # Main client component
│   │   ├── webinar-card.tsx       # Card markup
│   │   └── ui/
│   │       ├── container.tsx
│   │       └── category-select.tsx
│   ├── lib/
│   │   ├── pagination.ts          # buildPageWindow + pageRange (pure)
│   │   └── data/
│   │       ├── webinars.ts        # Seed data (replaces Sanity)
│   │       └── repository.ts      # listWebinars / listCategories
│   └── types.ts                   # Webinar, WebinarCategory, …
└── tests/
    ├── setup.ts                   # jest-dom matchers
    ├── pagination.test.ts         # 7 unit tests
    ├── route.test.ts              # 6 route-handler tests (real NextRequest)
    └── webinar-list.test.tsx      # 4 component tests (mocked fetch)
```

## Notes on adaptation from the original codebase

The production component fetched data from a Sanity CMS. Here, the
`listWebinars` repository in-memory acts as that data source so the
sample exercises the same shapes and code paths without external
dependencies. The component itself is structurally identical — same
TanStack Query setup, same pagination math, same SSR hydration via
`initialData`.
