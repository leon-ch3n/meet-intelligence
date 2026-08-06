# Mock Data — Gemrise Launch Scenario

One consistent fictional dataset used across every screen. These facts must not drift.

## Program

**Gemrise** — the internal push to weave Gemini across Google Workspace surfaces (Docs, Sheets, Slides, Meet). Everyone in the cast is Google-internal; the meetings span product, marketing, data science, design, security, and program management.

## Current user

- **Maya Patel** — Product Manager, Gemrise

## Cast (all internal to Google)

- Maya Patel — Product Manager, Gemrise
- Sarah Kim — Marketing Lead, Workspace
- Daniel Brooks — Data Science Lead, Workspace
- Priya Shah — Security PM, Gemini Platform
- Jimmy Lee — Engineering Director, Gemini Platform
- Elena Garcia — Design Director, Workspace
- Marcus Chen — Program Manager, Gemrise Launch

## Related internal project

**Aurora ML** — the internal model program Gemrise depends on. Weekly sync tracks eval progress and checkpoint freezes.

## Documents

| Title | Type | Visibility |
|---|---|---|
| Gemrise Launch Plan — v3 | Drive doc | all-attendees |
| Workspace Integration Playbook | Drive doc | internal |
| Gemrise Security Review Checklist | Drive doc | internal |
| Q3 GTM Approval — Gemrise | Drive doc | **restricted** (Maya cannot view — surfaces the restricted-source state) |
| Aurora Model — Brief | Drive doc | internal |

## Canonical timeline

| Date | Event |
|---|---|
| June 12 | Cross-functional kickoff surfaces three concerns |
| June 18 | Risk review — team decides **not** to commit a public launch date before security approval |
| July 2 | Sarah agrees to prepare revised GTM messaging |
| July 10 | GTM messaging expected — **not sent** (creates the overdue commitment) |
| **July 13** | **Launch Readiness Review (demo meeting)** |
| July 14 | Q3 leadership readout |
| October 15 | Proposed launch target (the tentative decision the demo detects) |

## Threads under the Gemrise Launch topic

Three threads seed the timeline and power the recurring-concerns view.

### Thread A — Launch timeline

- June 12 · Concern raised by Jimmy (Eng) — "We can't commit to Q3 for a full multi-surface push"
- June 18 · Decision — "Do not commit a public launch date before security approval"
- July 13 · Decision (detected → confirmed) — "Target October 15 for Gemrise launch" · **conflicts with June 18**
- July 13 · Change — "Launch-timing concern partially resolved"

### Thread B — Security-review ownership

- June 12 · Concern raised by Marcus (PM) — "Who owns the security review?"
- June 18 · Open question · unassigned
- July 13 · Risk (open) — "Security approval remains unassigned"

### Thread C — GTM messaging

- June 12 · Concern raised by Sarah (Marketing) — reveal messaging not yet revised
- July 2 · Commitment (Sarah, due July 10)
- July 10 · Commitment status flips to **overdue**
- July 13 · Action item (detected → confirmed) — "Sarah to send revised GTM messaging by Friday"

## Meetings referenced

| ID | Title | Date | Type | Notes |
|---|---|---|---|---|
| `acme-june-12` | Gemrise Cross-Functional Kickoff | June 12 | internal | 6 attendees; origin of all three concern threads |
| `internal-june-18` | Gemrise Launch Risk Review | June 18 | internal | 4 attendees; origin of the security-first decision that Beat 3 conflicts with |
| `acme-renewal` | **Gemrise Launch Readiness Review** | **July 13** | internal | **The demo meeting** · 4 attendees |
| `aurora-weekly` | Aurora ML Model Weekly | July 13 | internal | 3 attendees; appears on Home, not opened in demo |
| `mobile-onboarding-review` | Gemrise Mobile Design 1:1 | July 13 | internal | Maya + Elena; Home only |
| `q3-leadership-update` | Gemrise Q3 Leadership Readout | July 14 | internal | Home only |

## Recurring Gemrise concerns (used by MeetingBriefService)

1. Launch timeline
2. Security-review ownership
3. GTM messaging
4. Leadership readout narrative
5. Cross-surface readiness

## Detected artifacts in the demo meeting (`acme-renewal`)

- **Decision (detected):** "Target October 15 for the Gemrise launch." · confidence 0.82 · source: transcript segment ~1:34
- **Conflict:** with June 18 internal decision · severity medium
- **Action item (detected):** "Sarah to send revised GTM messaging by Friday" · owner Sarah Kim · missing dueDate until user confirms

## Follow-up drafts

- **Internal draft** includes all decisions, all actions, security risk, and references the Q3 GTM Approval doc.
- **External draft** (for a broader Google audience) strips: the Q3 GTM Approval reference (restricted), the security-approval risk phrased as internal, the June 18 conflict decision, any private notes. Shows an exclusion notice: *"Excluded from external draft: 2 items."*

## Ask Meetings — canned responses

Only the queries in `architecture.md` §7 return real results. All others return the unsupported-query fallback.

For **"What is blocking the Gemrise launch?"**, findings are the three current-blocker events from threads A, B, and C, each with source, timestamp, and status.
