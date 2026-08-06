# Screens

Every screen has an **aha moment** — the specific reaction a reviewer should have in the first 5 seconds of seeing it. If the aha moment isn't obvious from the layout, the screen isn't done.

Nav: **Home · Meetings · Topics · People · Ask**. Optional: Action Items, Decisions, Settings. Selected state always visually clear.

---

## 1. Command Center Home (`/`)

**Aha moment:** "This is triage for my week, not a meeting archive." The first fold shows the *next meeting that needs prep* with unresolved threads pre-surfaced — not just a list of upcoming events.

**Sections (in order):**

1. **Next meeting up** — hero card for the imminent meeting. Shows title, time, attendees, internal/external label, unresolved thread count ("3 open items · pricing overdue"), prep status, primary CTA "Open Brief."
2. **Needs follow-up** — meetings that ended without a saved follow-up draft. Shows suggested action per row.
3. **Open commitments** — commitments owned by Maya, sorted by due date. Overdue at top.
4. **Recent decisions** — 5 most recent, with topic, owner, source meeting, confirmation status.
5. **Active topics** — cards showing meeting count, open actions, current risks, most-recent thread change, key participants.

**Seed content:** Gemrise Launch Readiness Review (next up), Aurora ML Model Weekly, Gemrise Mobile Design 1:1, Gemrise Q3 Leadership Readout.

---

## 2. Pre-Meeting Brief (`/meetings/[id]`)

Use: **Gemrise Launch Readiness Review**.

**Aha moment:** "I know exactly what happened last time and what's unresolved *before* I click into the meeting." Recurring concerns are cited with source excerpts, not summarized vaguely.

**Sections:**

1. **Overview** — title, time, attendees, internal/external, objective, related topic (link to Topic Workspace).
2. **Executive brief** — 2–3 sentences of seeded prose:
   > The team previously raised concerns about Gemrise launch timing, security-review ownership, and revised GTM messaging. The launch timeline remains unresolved. Sarah committed to sending revised GTM messaging by July 10, but no document has been shared.
3. **Recurring concerns** — the three Gemrise threads (launch timeline, security-review ownership, GTM messaging). Each shows the earliest raising, most recent mention, current status, source excerpt.
4. **Previous meeting summary** — date, discussion points, decisions, commitments, open questions.
5. **Open action items** — task, owner, due date, status (overdue highlighted), source meeting.
6. **Relevant context** — mock references to a Gmail thread, a Drive doc, a Meet transcript, a Calendar event, an internal project note. Include one **restricted source** placeholder ("Q3 GTM Approval — restricted").
7. **Suggested agenda** — 4 items ranked by AgendaService.
8. **Suggested questions** — clickable chips that jump into Ask Meetings with a pre-run canned query:
   - What concerns has the team repeated on Gemrise?
   - What did we commit for the Gemrise launch?
   - What remains unresolved?
   - What changed since the previous Gemrise meeting?

**CTA:** Join meeting → `/live/[id]`.

---

## 3. Live Meeting Intelligence (`/live/[id]`)

**Aha moment:** "It's helping me during the meeting without stealing my attention." The intelligence panel is calm and cites sources inline; the meeting stage still feels like Google Meet.

**Layout:** Meet-style stage on the left (60%), intelligence side panel on the right (40%).

**Meeting stage:**
- Participant tiles (seeded avatars for Maya, Jimmy, Elena, Sarah).
- Current speaker indicator.
- Meeting controls (mute, camera, hang up — non-functional).
- Recording indicator + AI note-taking disclosure banner.

**Side panel tabs:** Agenda · Notes · Decisions · Actions · Context.

**Live agenda progress:**
- Migration timeline — In progress
- Security review — Not started
- Pricing — Not started
- Renewal timing — Not started

**Detected Decision card** (appears mid-demo):
> Tentative decision: Target October 15 for the Gemrise launch.
Controls: **Confirm · Edit · Dismiss**. Below the text: source (transcript timestamp), confidence badge.

**Contextual Conflict card** (appears immediately after decision is confirmed):
> This may conflict with the June 18 decision to avoid a public launch date before security approval.
Includes: source meeting, date, transcript timestamp, severity (medium), **Dismiss** control. Language is **suggestive**, not authoritative.

**Detected Action Item card:**
> Sarah to send revised GTM messaging by Friday.
Editable fields: task, owner, due date, visibility.

**Visibility controls** on every note/decision/action:
- Private to me
- Internal attendees
- Everyone in the meeting
- Selected participants

**End meeting** CTA → processing sequence → `/meetings/[id]/recap`.

---

## 4. Processing (transient)

**Aha moment:** "This feels like real intelligence work, not a spinner." Six timed steps (~500–700ms each), no network calls:

```
Analyzing meeting…
Identifying decisions…
Extracting action items…
Comparing previous meetings…
Updating Gemrise Launch…
Drafting follow-up…
```

Each step ticks with a subtle check when complete.

---

## 5. Post-Meeting Intelligence (`/meetings/[id]/recap`)

**Aha moment:** "This isn't a summary — it's a diff. I can see exactly what changed and what to do about it." The "What Changed" section is prominent.

**Sections:**

1. **Executive summary** — 2–3 seeded sentences.
2. **What changed** (elevated) — deltas vs. the previous Gemrise meeting:
   > The team is now open to an October launch target, partially resolving the timing concern first raised on June 12.
   Each delta shows: prior state → new state, source, timestamp.
3. **Decisions** — cards with decision text, owner, date, status, source timestamp, visibility. Includes the confirmed October 15 decision + a lineage arrow to the June 18 conflicting decision (now marked *superseded* if user chose to override, or *active* if conflict was dismissed).
4. **Action items** — task, owner, due date, status, visibility, source timestamp.
5. **Open questions:**
   - Who owns the final Gemrise security review?
   - Do engineering and design agree on the proposed launch sequence?
   - Is the revised GTM messaging approved internally?
6. **Risks:**
   - Launch date may precede security readiness
   - Security approval remains unassigned
   - GTM approval may delay reveal messaging
7. **Related topics** — Gemrise Launch, Workspace Integration, Security Review, GTM Approval.
8. **Follow-up email draft** — toggle: Internal | External. External strips internal-only content and shows an *"Excluded from external draft: 2 items"* notice with expandable list.
9. **Project memory update** — preview of what will be written to the Gemrise Launch topic:
   - Launch-timing concern marked partially resolved
   - October 15 target added
   - Two action items created
   - Security ownership risk remains open
   - CTA: **Review & save**.

---

## 6. Ask Meetings (`/ask`)

**Aha moment:** "This looks like a chatbot but it's giving me structured, cited answers — not paragraphs of confident-sounding prose." Every finding has a source link.

**Layout:** Query input at top, suggested queries below as chips, results below.

**Suggested queries** (chips):
- What decisions were reversed this month?
- What commitments have I made?
- What are the recurring blockers across Aurora ML?
- Prepare me for my Gemrise readiness meeting.
- Which action items assigned to me are overdue?
- What did leadership say about the launch date?

**Canned response for "What is blocking the Gemrise launch?":**
Structured findings — one card per blocker:
1. **Launch timeline** — explanation, current status, related meeting, date, transcript timestamp, source link.
2. **Security-review ownership** — same structure.
3. **GTM messaging** — same structure.

Below findings: **Interpreted intent: identify_blockers · 3 sources cited**.

**Unsupported query** returns the controlled fallback (see `architecture.md` §10).

---

## 7. Topic Workspace (`/topics/[id]`) — optional but strongly recommended

Use: **Gemrise Launch**.

**Aha moment:** "I can see the entire history of this program in one page, with lineage between decisions." The thread timeline is the primary artifact.

**Sections:**

1. **Topic summary** — evolving seeded prose.
2. **Stats row** — meeting count, participant count, open actions, confirmed decisions, current risks.
3. **Thread timeline** (elevated) — one column per thread (Launch timeline, Security-review ownership, GTM messaging). Events stack vertically with dates. Lineage arrows connect linked events (e.g., detected → confirmed → superseded). This is the visual proof of the linking mechanic.
4. **Decision log** — table with states: Active · Reversed · Superseded · Pending.
5. **Open commitments** — same shape as home.
6. **Key participants** — internal + external, grouped.
7. **Related documents** — with restricted-source example.
8. **Evolving project brief** — seeded prose that visibly *changes* after the demo user saves the topic memory update in step 5.

---

## Visual direction (applies to all screens)

**Feels like:** polished, calm, intelligent, trustworthy, Google-native, enterprise-ready, accessible.

**Typography:** Google Sans (if locally available) → Inter → Roboto → Geist. Do not embed proprietary font files.

**Layout:** spacious padding, clear section hierarchy, rounded cards, subtle borders, soft shadows, responsive grids, sticky nav where useful, consistent max-width containers.

**Semantic color** (do not rely on color alone):
- Blue — primary actions
- Green — completed / resolved
- Yellow — needs attention
- Red — risk / overdue
- Purple — generated insight
- Gray — secondary

**Avoid:** excessive gradients, neon colors, dense dashboards, giant charts, decorative animations, generic AI sparkle icons everywhere, excessive pill-shaped UI, unnecessary modals.

## Required interactions

Navigation between all screens · open meeting · open source citation · confirm/edit/dismiss decision · confirm/edit/complete action · change visibility · open restricted-source state · run supported Ask query · open topic page · review follow-up draft · save topic memory update.

## State-per-widget checklist

Loading · empty · error · restricted · low-confidence · missing source · partial · unsupported-query.
