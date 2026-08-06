# Architecture

## 1. The linking primitive: Thread

The product's core claim is "meetings connect over time." That connection is not a feature layered on top — it's a first-class data structure called a **Thread**.

A **Thread** is an evolving, permission-aware timeline of *events* about a topic. An event is one of:

- `Decision` (detected → confirmed → superseded → reversed)
- `Commitment` (open → completed → overdue → dropped)
- `Risk` (open → resolved)
- `Concern` (raised → recurring → resolved)
- `Question` (open → answered)
- `Change` (a delta between two events on the same thread)
- `SourceMention` (external artifact referenced from within the thread)

Every event carries: `threadId`, `sourceId` (meeting/email/doc/chat), `speakerId`, `timestamp`, `visibility`, and a `linkedEventIds[]` for lineage (e.g., a confirmed decision links back to the detected version; a reversal links to the reversed decision; a resolved concern links to the concerns it addresses).

**Threads are what make cross-meeting features cheap:**

- "Recurring concerns" = concern events on the same thread from ≥2 meetings.
- "What changed" = new events on this thread since the last meeting on it.
- "Conflict alert" = a new decision event whose `linkedEventIds` include a still-active decision with contradictory `effectiveDate` or `text`.
- "Ask Meetings: what's blocking Gemrise?" = open risks + open concerns on threads tagged to the Gemrise topic.
- Topic Workspace = the full thread rendered as a timeline with lineage arrows.

**Threads vs. Topics.** A Topic is a user-facing grouping (e.g. "Gemrise Launch"). A Topic contains 1..N Threads (e.g., "Launch timeline", "Security-review ownership", "GTM messaging"). Threads are what actually persist state; Topics are the navigation surface.

Seed at least three threads under the Gemrise Launch topic so the timeline demonstrates real branching (see `mock-data.md`).

## 2. Service architecture

```
Frontend Widgets
      ↓
Typed API Routes (Next.js Route Handlers)
      ↓
Widget Intelligence Services   ← one service per widget, single responsibility
      ↓
Permission Filter              ← runs on every service call
      ↓
Repositories                   ← seeded lookup helpers
      ↓
Seeded Local Data (/data/*)
```

**Do not build:** `User Query → generic LLM prompt → unstructured response`.
**Do build:** `Widget Request → typed input → permission filter → deterministic service → typed response`.

### Services

Each service lives in `/server/services/*.ts` with one responsibility:

| Service | Purpose |
|---|---|
| `MeetingBriefService` | Pre-Meeting Brief: objective, executive brief, recurring concerns, unresolved items, recent changes, suggested agenda, sources |
| `AgendaService` | Rank ≤5 agenda items by overdue commitments, unresolved blockers, upcoming deadlines, conflicting decisions, required approvals |
| `DecisionService` | Detect decisions from seeded transcript events using seeded trigger phrases (agreement, approval, rejection, selection, commitment, prioritization, change-in-direction) |
| `ActionItemService` | Detect action items; if owner/date missing, expose `missingFields[]` rather than inventing values |
| `ConflictService` | Compare a candidate decision against active decisions on the same thread; return typed conflict with severity + source citations |
| `MeetingComparisonService` | "What changed" — diff thread state before vs. after the current meeting |
| `TopicMemoryService` | Update the topic's derived summary + append new thread events |
| `FollowUpDraftService` | Produce two deterministic drafts (internal, external). External strips internal-only threads and restricted sources |
| `MeetingSearchService` | Ask Meetings: classify intent → run canned query → return typed findings with citations |
| `PermissionService` | `canUserViewSource(userId, sourceId)`, `canUserViewInsight(userId, insightId)` |

### Every service call must

1. Validate input (Zod).
2. Retrieve seeded data through a repository.
3. Apply permission filter.
4. Run deterministic logic.
5. Return typed JSON with source metadata.
6. Handle empty, restricted, and low-confidence states explicitly.

## 3. Permissions

Permission logic lives in the service/data layer. Never in the UI.

- Every `Source` carries `permittedUserIds[]` and `visibility`.
- Every `Insight` inherits the intersection of its sources' permissions.
- External follow-up drafts strip: internal-only threads, restricted sources, private notes, internal disagreement, unapproved risks, internal commercial strategy.
- When a source is excluded, return the restricted-state payload — never the source content:

```json
{ "type": "restricted_source", "message": "One relevant internal source was excluded due to permissions." }
```

**At least one restricted-source example must appear in the demo path** (see `demo-script.md`).

## 4. API surface

Next.js Route Handlers. Small, typed, deterministic.

```
GET   /api/dashboard
GET   /api/meetings/:meetingId
GET   /api/meetings/:meetingId/brief
GET   /api/meetings/:meetingId/live-insights
GET   /api/meetings/:meetingId/intelligence
GET   /api/meetings/:meetingId/follow-up?audience=internal|external
GET   /api/topics/:topicId
GET   /api/threads/:threadId
POST  /api/search
PATCH /api/decisions/:decisionId          → confirm | edit | dismiss | reverse
PATCH /api/actions/:actionId              → confirm | edit | complete
PATCH /api/insights/:insightId            → visibility | dismiss
POST  /api/topics/:topicId/update
```

Direct service imports are fine when a route handler adds no value.

## 5. State

Client state via Zustand with `localStorage` persistence. Required mutations:

- Confirm / edit / dismiss decision
- Confirm / edit / complete action item
- Change visibility on any insight
- Dismiss conflict
- Save follow-up draft
- Save topic memory update

The demo must remain functional across page navigation.

## 6. Simulated processing

Between "meeting ends" and "post-meeting intelligence page loads," show a deterministic timed sequence (no network calls):

```
Analyzing meeting…
Identifying decisions…
Extracting action items…
Comparing previous meetings…
Updating Gemrise Launch…
Drafting follow-up…
```

Each step is ~500–700ms. After the sequence, render the seeded post-meeting page.

## 7. Rule-based intent classification (Ask Meetings)

Ask Meetings looks conversational but runs on keyword + entity rules over a fixed intent enum:

```ts
type MeetingSearchIntent =
  | "find_decisions"
  | "find_commitments"
  | "identify_blockers"
  | "prepare_for_meeting"
  | "summarize_topic"
  | "find_overdue_actions"
  | "compare_meetings"
  | "find_mentions";
```

Canned queries with hard-coded typed responses:

- "What is blocking the Gemrise launch?"
- "What concerns has the team repeated on Gemrise?"
- "What did we commit for the Gemrise launch?"
- "Prepare me for my Gemrise readiness meeting."
- "Which of my action items are overdue?"
- "What changed since the last Gemrise meeting?"
- "What decisions were reversed?"
- "What did leadership say about the launch date?"

Unknown queries return the unsupported-query fallback. Do not attempt freeform generation.

## 8. Data & templates

- Seed data lives in `/data/*.ts`. See `mock-data.md` for the canonical dataset.
- Hard-coded widget responses live in `/data/widget-responses.ts` and `/data/search-responses.ts`, not in components.
- Templates in `/lib/templates.ts` are used for stitching field values into short human-readable strings (action summaries, status explanations, restricted notices, decision confirmation messages).

## 9. Suggested project structure

```
/app
  /page.tsx                  ← Command Center Home
  /meetings/[id]/page.tsx    ← Pre-Meeting Brief
  /live/[id]/page.tsx        ← Live Meeting
  /meetings/[id]/recap       ← Post-Meeting Intelligence
  /topics/[id]/page.tsx      ← Topic Workspace
  /ask/page.tsx              ← Ask Meetings
  /api/…                     ← route handlers listed in §4

/components/{layout, navigation, dashboard, meetings, live, topics, people, search, sources, shared}

/server
  /services       ← one file per service in §2
  /permissions/access-control.ts
  /repositories   ← meeting/topic/thread/source
  /schemas        ← zod schemas for API inputs

/data             ← seeded fixtures + hard-coded widget/search responses
/lib              ← utils, dates, query-classifier, templates
/store            ← zustand
/types/index.ts   ← canonical types (single source of truth)
```

## 10. Error / fallback taxonomy

Every widget supports: `loading | empty | error | restricted | low_confidence | missing_source | partial | unsupported_query`. Do not fabricate data.

Example payloads:

```json
{ "status": "partial", "message": "Brief created, but one related document could not be accessed." }
{ "status": "unsupported_query", "message": "This prototype supports questions about blockers, decisions, commitments, meeting preparation, and overdue actions." }
```
