# Google Meet Command Center

Interactive prototype for a Google APM application. Transforms fragmented meetings into permission-aware organizational memory.

**Thesis:** Gemini understands individual meetings. Command Center understands how meetings connect over time.

## Non-negotiables

1. **Fully deterministic.** No Gemini/OpenAI/Anthropic SDKs, no live model calls, no network dependency, no API keys. All "intelligence" comes from seeded data, typed services, rule-based intent matching, and template text generation.
2. **The demo path in `docs/demo-script.md` must work every time.** All other features are secondary.
3. **Permission filtering happens in the service layer, not the UI.** Never fetch restricted content and hide it visually.
4. **Every insight cites a source.** No unsupported claims presented as fact.
5. **Suggest, don't auto-execute.** Confirm / edit / dismiss on every generated artifact.
6. **The linking primitive is the Thread** (see `docs/architecture.md` §1). Cross-meeting continuity is not a feature layered on top — it's the data model.

## Where things live

- `docs/product.md` — principles, positioning, user, success criteria, non-goals
- `docs/screens.md` — per-screen requirements + the "aha moment" each screen must produce
- `docs/architecture.md` — Thread mechanic, services, permissions, API surface, state, data flow
- `docs/demo-script.md` — timed 4-minute walkthrough with exact clicks and reviewer moments
- `docs/mock-data.md` — the canonical Gemrise Launch dataset (people, timeline, documents)
- `types/index.ts` — canonical TypeScript models (single source of truth — do not duplicate elsewhere)

## Stack

Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui + Lucide + Zod + Zustand. No AI SDKs. No auth provider. Optional: Prisma + SQLite.

## Working rules

- Read `docs/screens.md` before starting a screen, and `docs/architecture.md` before touching a service.
- Types live in `types/index.ts`. If a doc shows a type, it's illustrative — the file is authoritative.
- Keep intelligence logic in `/server/services/*`, never in components.
- Seed data in `/data/*`. Never inline large text blobs in JSX.
- Every widget supports: loading, empty, error, restricted, low-confidence, unsupported-query.
- Run lint after meaningful changes; run a production build at phase boundaries.
- Never introduce a paid API dependency or live AI dependency.

## Build phases

1. Foundation — app shell, navigation, types, seed data, repositories
2. Dashboard (Command Center Home)
3. Meeting workflow — Pre-Meeting Brief → Live → Processing → Post-Meeting
4. Interactions — confirm/edit/dismiss/visibility mutations
5. Ask Meetings — rule-based intent classification + seeded responses
6. Topic Workspace — Thread timeline with lineage
7. Polish — empty/loading/restricted states, a11y, responsive

Detail on each phase lives in `docs/screens.md` and `docs/architecture.md`.
