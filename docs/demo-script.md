# Demo Script — 2:30

Three surfaces, three reviewer moments. Every screen is designed backward from the moment it must produce.

**Persona:** Maya Patel, PM at Google Workspace, on the Gemrise team. **Scenario:** Reviewing the Gemrise Launch thread after the readiness review.

---

## Beat 1 · Home · 0:00–0:30

**Click:** Open `/`.

**On screen:** Sans wordmark "Command Center" top-left. A calm, paper-cream page. Meetings grouped by day — "Today, Jul 13" first, then earlier days. Each row is a document-shaped icon, meeting title, one-line description, duration, time. No dashboard widgets, no counters. Sidebar shows Home · Ask · Folders (Gemrise Launch · Aurora ML · Workspace Integration · Security Review · GTM Approval).

**Voiceover:**
> "This is not a dashboard. It's a paper-quiet meeting archive. Every meeting Maya's been in — grouped by day, one line each, calm on the eyes. Two navs: Home and Ask. Folders are her topics, tucked away."

**Reviewer moment:** "This looks like Google Docs or Pocket — nothing shouting. But I know from the sidebar there's more depth under it."

---

## Beat 2 · Meeting detail · 0:30–1:45

**Click:** The row for "Gemrise Launch Readiness Review." Land on `/meetings/acme-renewal`.

**On screen:** Sans title, meeting metadata pills (date · folder · internal). Below the header: a pill-shaped `Notes | Sources` tab bar. Notes is default.

**Notes tab · Summary sub-tab (default):**
- Executive brief card at the top.
- A "What changed on Gemrise Launch" callout — priorState "Do not commit a public launch date before security approval" → newState "Target October 15 for Gemrise launch" — cited to the meeting's transcript.
- Open questions listed below.

**Click:** "Decisions" sub-tab.
- The October 15 decision surfaces, with an **arrow-down lineage block** pointing to the earlier June 18 decision it supersedes. Both cite their sources.

**Click:** "Sources" tab.
- User-notes stub (read-only), audio scrubber placeholder, transcript panel: speaker-attributed segments with timestamps and per-segment play buttons.
- "Cited sources" panel underneath — the same set of documents/emails/calendar entries the Notes tab pulled from, including the Q3 GTM Approval doc that stays visible even when restricted.

**Voiceover:**
> "One meeting. Two lenses. Notes is what the assistant derived — every insight citing a source. And when a later decision supersedes an earlier one, the lineage arrow makes it visible right in the row. Sources is the raw truth — transcript, notes, cited docs. Permissions are shown, not hidden."

**Reviewer moment:** "That lineage arrow is the whole product — this system remembers a decision was made two weeks ago, and shows me when a new one overrides it."

---

## Beat 3 · Chat rail, then Ask · 1:45–2:30

**Still on the Gemrise meeting.** Right-side chat rail is open by default on wide screens.

**On screen:** Sans "Hello, Maya" · "What needs remembering?" Below it, an **assistant note** already rendered:
> "Heads up: Target October 15 for the Gemrise launch supersedes an earlier position — Do not commit a public launch date before security approval. Both events cite the same thread."

Two suggested-question chips underneath ("What concerns has the team repeated on Gemrise?" · "What did we commit for the Gemrise launch?"). Input at the bottom.

**Click:** Ask "What did we commit for the Gemrise launch?"

**On screen:** Answer card + one or two condensed finding cards (Sarah's GTM messaging commitment, dated July 10, cited to the kickoff meeting).

**Click:** Ask (nav). Full-page Ask.

**On screen:** Sans hero, suggested chips. Click "What is blocking the Gemrise launch?" → three findings — Launch timeline · Security-review ownership · GTM messaging — each cited, each labeled with its status.

**Voiceover:**
> "The chat inside a meeting is scoped to that meeting — and it opens with a proactive note about the lineage the assistant already noticed. Ask, in the sidebar, is the same thing over every meeting Maya's ever had. Same graph, same citations, same permission rules. It looks like a chatbot, but every answer is typed, cited, permission-aware — no LLM, no hallucination."

**Reviewer moment:** "It looks like a chatbot but every answer is grounded in the same thread graph that powered the Notes tab. Two surfaces, one memory."

---

## Timing table

| Beat | Screen | Duration |
|---|---|---|
| 1 | Home | 0:30 |
| 2 | Meeting detail (Notes + Sources) | 1:15 |
| 3 | Chat rail + Ask | 0:45 |
| — | **Total** | **~2:30** |

## Rehearsal checklist

- [ ] Home loads with the meetings grouped by day, Today first.
- [ ] Meeting detail lands on Notes → Summary by default.
- [ ] The Decisions sub-tab shows an arrow-down lineage row on the October 15 decision.
- [ ] Sources tab shows speaker-attributed transcript with timestamps.
- [ ] Restricted source (Q3 GTM Approval) is visible, labeled restricted.
- [ ] Chat rail opens with the proactive lineage note pre-rendered.
- [ ] Meeting-scoped chat returns findings whose sources belong to that meeting.
- [ ] Ask (nav) returns three cited findings for "What is blocking the Gemrise launch?"
