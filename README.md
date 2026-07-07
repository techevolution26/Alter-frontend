# Alter — Frontend

Next.js 14 (App Router) public/member app: prayer wall, testimonies, events,
and M-Pesa giving — talking to the `alter-backend` FastAPI API.

This covers the **public/member surface only**. Moderation and testimony
review are handled through the backend's own `/docs` (Swagger UI) for now —
see the backend README for why that's the deliberate MVP choice, not a
placeholder.

## Design

- **Palette**: a "vigil" indigo (`#191D3A`) rather than near-black or cream,
  with a warm ember gold (`#E8A94C`) accent — candlelight against a dusk
  sky, not the common cream+terracotta or near-black+neon defaults.
- **Type**: Fraunces (display, warm/organic serif) + Work Sans (body) + IBM
  Plex Mono (timestamps, counts, small data).
- **Signature interaction**: tapping "🙏 I prayed for this" sends a ripple
  outward from the tap point and the count ticks up with a soft glow —
  the one interaction people repeat constantly, built around the product's
  actual idea (one act of care, rippling outward).

All tokens live in `tailwind.config.ts` and `app/globals.css`.

## Architecture notes

- **No client-side API layer.** Reads happen in async Server Components
  (`fetch` directly against the backend); writes happen through **Server
  Actions** (`lib/actions.ts`). The JWT lives only in an httpOnly cookie
  (`lib/session.ts`) and is read server-side in `lib/api.ts` — it never
  reaches browser JS.
- **Progressive enhancement by default.** Because forms POST to Server
  Actions, most flows (login, register, submitting a prayer/testimony,
  RSVP) work even with JS disabled or slow to load — a deliberate choice
  given the backend's low-bandwidth target audience. The one exception is
  the ripple animation on the prayer card, which needs JS for the visual
  effect (the underlying action still fires via direct Server Action call).
- **`middleware.ts`** does a fast-path redirect for logged-out users hitting
  protected routes (checks cookie presence only); each page still verifies
  the session for real via `getCurrentUser()`.

## Getting started

```bash
cp .env.example .env.local   # point API_BASE_URL at your running backend
npm install
npm run dev
```

Requires the `alter-backend` API running and reachable at `API_BASE_URL`
(defaults to `http://localhost:8000/api/v1`).

### Docker

```bash
docker compose up --build
```

By default this points at `host.docker.internal:8000` so it can reach a
backend you're running separately. If you run both projects' compose files
on the same Docker network, point `API_BASE_URL` at the backend's service
name instead (see `docker-compose.yml`).

## Verifying this build

Like the backend, this sandbox has no npm registry access, so `npm install`
/ `next build` couldn't be run here. What was verified instead:

- Every `.ts`/`.tsx` file parses with zero syntax errors (TypeScript's
  parser, not just eyeballing).
- Every internal `@/lib/...` and `@/components/...` import was checked
  against the actual exports of its target file — no typos or mismatched
  exports.

Run `npm install && npm run typecheck && npm run build` yourself right
after unzipping, before building on top of this, to confirm it compiles
against the real Next.js/React types in your environment.

## API client notes

`lib/types.ts` is hand-written to mirror `app/schemas/*.py` on the backend.
It's deliberately not codegen'd yet — once the API stabilizes, point
`openapi-typescript` at the backend's `/openapi.json` and replace this file
with a generated one; `lib/api.ts`'s `apiFetch<T>` wrapper doesn't need to
change.

## What's next

- Staff console (moderation queue, testimony review, org admin) as phase 2,
  once real usage from this MVP tells you what that team actually needs.
- Swap `lib/types.ts` for a generated client once the API is stable.
- Add payment-status polling on `/give` for signed-in donors (the backend's
  `GET /payments/{id}` already supports it — just needs a small client-side
  poll loop after a successful STK push).
