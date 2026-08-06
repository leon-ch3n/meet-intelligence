# Product

## Positioning

Existing meeting tools (Otter, Fireflies, Gemini-in-Meet, Grain) produce **isolated artifacts** — one transcript, one summary, one action-item list per meeting. When the next meeting starts, that context is gone. Users re-explain, re-decide, re-litigate.

Command Center is a **system of record for organizational conversations**. It answers:

- What did we decide?
- What changed since the previous meeting?
- Which commitments remain unresolved?
- What is blocking this project?
- Has this issue appeared before?
- Who owns the next step?
- Which decisions conflict with earlier decisions?
- What has this customer repeatedly asked for?
- What action items assigned to me are overdue?

The product's five emphases: **continuity, organizational memory, source grounding, actionability, permission-awareness.**

## Primary user

Maya Patel — cross-functional PM at Google Workspace. Attends internal syncs, design reviews, leadership updates, customer calls, and partner meetings. Struggles to remember what was decided, what remains open, who owns what, and whether a new commitment conflicts with an earlier one. The product reduces the cognitive burden of preparing, remembering, coordinating, and following through.

## Product principles

### 1. Continuity over transcription

Transcripts are inputs, not the product. Surface: decisions, commitments, risks, open questions, changes, conflicts, ownership, project history, next actions.

### 2. Show evidence

Every generated insight links to a realistic source (meeting transcript, calendar event, Gmail thread, Drive doc, chat, internal note). Display: source title, type, date, speaker, excerpt, timestamp, visibility. Never present unsupported claims as fact.

### 3. Narrow intelligence widgets

Each widget has one purpose, a typed input, a typed output, a deterministic response, a fallback state, source citations, and permission rules. Never send freeform prompts to a model.

### 4. Suggest, don't auto-execute

Confirm / Edit / Dismiss / Mark complete / Change visibility / Review before sharing. Nothing consequential happens silently.

### 5. Respect information boundaries

Internal and external content stay visibly distinct. Filter in the service layer, not the UI. See `architecture.md` §3.

### 6. Clarity over visual novelty

Prefer timelines, cards, tables, structured sections, decision logs. Avoid knowledge graphs, glassmorphism, neon gradients, decorative AI animations, dense dashboards.

### 7. Google-native feel

Familiar to Workspace users without copying an existing Google surface exactly. Clean typography, spacious layouts, soft elevation, rounded cards, purposeful color, accessible contrast.

## What good looks like (screen-level)

Each screen has one "aha moment" a reviewer should feel in under five seconds. Those are defined per-screen in `screens.md`. If you can't articulate a screen's aha moment, the screen isn't done.

## Success criteria

A reviewer understands within one minute:

- What the product is
- Who it is for
- Why isolated meeting summaries are insufficient
- How conversations connect over time (the Thread — see `architecture.md`)
- Why Google Workspace is strategically advantaged
- How internal vs. external contexts differ
- How the product remains grounded in sources
- Why it's more than a chatbot wrapper

## Non-goals

Do not build any of:

- Real Google auth / Meet recording / Gmail / Calendar / Drive / Chat integration
- Production AI infra, vector DB, real-time speech
- Mobile apps
- Enterprise admin, billing
- Emotion / personality / productivity / performance scoring
- Surveillance features
- Fully autonomous follow-up sending
- Fully autonomous decision creation

## Privacy & trust surface

The UI must clearly communicate: when meeting intelligence is active, whether a note is private or shared, who can access an insight, which source supports an insight, whether a decision is detected vs. confirmed, whether an action requires approval, whether a source was excluded, whether a follow-up is internal or external.
