# Google Meet Command Center

An interactive prototype of a permission-aware meeting-intelligence layer for Google Workspace.

- **What it is:** a deterministic prototype — every response is driven by seeded data and rule-based services. There are no live LLM calls, no API keys, and no network dependencies.
- **Source of truth:** [`CLAUDE.md`](./CLAUDE.md) is the canonical spec. See `docs/` for the product, architecture, screens, mock dataset, and demo script.
- **Types:** `types/index.ts` is authoritative. Any type shown in a doc is illustrative — the file wins.

## Getting started

```bash
npm install
npm run dev
```

No environment variables are required. There is no `.env` file.

## Demo

Follow `docs/demo-script.md`. The scripted path is the primary quality target — it must work every time.

## Do NOT add

- Any AI/LLM SDK (`openai`, `@anthropic-ai/sdk`, `@google/generative-ai`, etc.)
- Any dependency that requires an API key
- Any network-backed service

See `CLAUDE.md` §1 for the full non-negotiables.
