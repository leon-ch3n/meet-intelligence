import type { MeetingSummary } from "@/types";

/**
 * Long-form, ~5-minute-read briefs for each meeting. These are deterministic
 * seeded prose — no live generation — surfaced via the Notes summary sub-tab.
 *
 * Keyed by meeting ID. Consumers pull from
 * `getMeetingDetail(...).summary` which now returns `MeetingSummary`, not a
 * flat string.
 */
export const meetingSummaries: Record<string, MeetingSummary> = {
  // ── Gemrise Cross-Functional Kickoff — Jun 12 ────────────────────────────
  "acme-june-12": {
    headline: "Gemrise Cross-Functional Kickoff",
    tldr:
      "Kickoff for Gemini-in-Workspace lands three named threads: launch timing, security-review ownership, and GTM messaging. Docs is ready, Sheets is close, Meet needs six more weeks. No public launch date committed. Sarah takes GTM messaging; Priya is the informal security DRI pending confirmation.",
    sections: [
      {
        heading: "Why this meeting happened",
        body: [
          {
            kind: "paragraph",
            text: "Marcus called the cross-functional kickoff to align product, marketing, data, engineering, design, and security on what Gemrise actually is — the internal push to bring Gemini natively into Docs, Sheets, Slides, and Meet. The team walked into the room with different mental models: engineering was scoping a single-surface first launch, marketing was already drafting reveal messaging, design had four different empty states, and security had not been formally looped in. The meeting's job was to leave with one shared picture and a named list of open threads.",
          },
          {
            kind: "paragraph",
            text: "Maya framed the shape of the product before anyone else spoke, which set the working definition for the rest of the discussion: one Gemini entry point in every surface, one shared context spine, and one review pipeline. This framing turned out to be load-bearing — every later disagreement resolved by asking whether it broke that trio or not.",
          },
        ],
      },
      {
        heading: "Where each function landed",
        body: [
          {
            kind: "bullets",
            items: [
              "Engineering (Jimmy) — Cannot commit to Q3 for a full multi-surface push. Docs is production-ready. Sheets is close. Slides needs component work. Meet needs another six weeks minimum. Wants a per-surface readiness matrix before the team picks a launch date.",
              "Data (Daniel) — Aurora eval harness is on track. A single-surface Docs launch has solid eval coverage. Simultaneous multi-surface would stretch coverage thin.",
              "Design (Elena) — Assistant panel is consistent across surfaces. Empty states are not. Docs and Slides can hold the bar today. Meet still has mock content.",
              "Marketing (Sarah) — Positioning drafts exist but the reveal must lead with one benefit, not a feature list. Committed to a revised messaging pass by July 10.",
              "Security (via Marcus) — No named owner yet. Marcus flagged it as blocking. Maya committed to confirming Priya as the DRI in the July 14 readiness review.",
              "Program (Marcus) — Named the three threads to carry forward and set the rhythm: kickoff today, risk review on June 18, readiness review on July 14, leadership readout July 15.",
            ],
          },
        ],
      },
      {
        heading: "The three threads that got named",
        body: [
          {
            kind: "paragraph",
            text: "The team left with three explicit threads that will run through every subsequent Gemrise meeting: launch timeline, security-review ownership, and GTM messaging. Naming them mattered because they map directly to the risks the July 15 leadership readout will be asked about.",
          },
          {
            kind: "bullets",
            items: [
              "Launch timeline — Jimmy's concern about Q3 feasibility, still open. The follow-up is his readiness matrix.",
              "Security-review ownership — Marcus's concern that no one owns the review on our side. Named DRI expected at the readiness review.",
              "GTM messaging — Sarah's own concern about feature-list positioning. Revised pass due July 10.",
            ],
          },
        ],
      },
      {
        heading: "What was decided vs. what was deferred",
        body: [
          {
            kind: "paragraph",
            text: "No launch date was committed on the call. That was deliberate — the group agreed to hold off until Jimmy's readiness matrix and Priya's security-review checklist are in hand. The team also deferred any external messaging until the same two inputs land, which is what pushed Sarah's July 10 commitment. What did get decided was structural: the three-thread frame, the meeting cadence, and the working definition of Gemrise as an entry point plus a context spine plus a review pipeline.",
          },
        ],
      },
      {
        heading: "Commitments leaving the room",
        body: [
          {
            kind: "bullets",
            items: [
              "Sarah — deliver a revised GTM messaging pass by July 10, leading with one benefit.",
              "Jimmy — bring a per-surface readiness matrix to the next sync.",
              "Elena — circulate the design QA doc so functions can flag missing states before the readiness review.",
              "Maya — confirm Priya as security DRI offline; name her at the readiness review.",
              "Marcus — hold the thread map current and drive the cadence to leadership readout on July 15.",
            ],
          },
        ],
      },
      {
        heading: "Signal for the room",
        body: [
          {
            kind: "paragraph",
            text: "This was a healthy first meeting. Every function walked in with a different picture and walked out with the same three threads. The one soft spot is security: naming a DRI in a follow-up is fine, but the team should not let the readiness review start without that name locked. Everything else — Sheets ramp, Meet's six-week gap, Sarah's messaging pass — is planned work with owners.",
          },
        ],
      },
    ],
  },

  // ── Gemrise Launch Risk Review — Jun 18 (internal) ───────────────────────
  "internal-june-18": {
    headline: "Gemrise Launch Risk Review",
    tldr:
      "Small-group risk review closes on a policy call: no public launch date until security approval clears. Priya draws up the security-review checklist. Sarah holds messaging until the window firms up. Aurora eval progress is on track. Security-review owner still unnamed on the security-team side — the largest carry-forward risk.",
    sections: [
      {
        heading: "What the meeting was for",
        body: [
          {
            kind: "paragraph",
            text: "Six days after the kickoff Maya pulled a smaller group into a risk review with one binary question in the room: do we or do we not commit a public Gemrise launch date before security approval clears? The room was intentionally small — Maya, Sarah, Daniel, and Priya — because the question was a policy call that would either enable or constrain everything downstream, including Sarah's GTM messaging, Jimmy's readiness matrix, and the leadership readout narrative.",
          },
        ],
      },
      {
        heading: "The core exchange",
        body: [
          {
            kind: "paragraph",
            text: "Priya opened with a hard no — three open items on the security side (owner assignment, EU data residency, model output review) any of which could push launch by weeks. Daniel backed her with the risk of losing the launch narrative entirely if a date is announced and the review flags something material. Sarah pushed back for marketing: leadership is asking for a date to build the reveal moment against; even a window is workable.",
          },
          {
            kind: "paragraph",
            text: "Maya's compromise was the resolution: reframe the question as a policy, not a date. No public launch date until security clears. Internally the team can plan against a target, but that target does not leave the room. That formulation gave marketing enough to work with (an internal window Sarah can hold Sales and Comms against) without exposing the program to a slip that would be visible externally.",
          },
        ],
      },
      {
        heading: "The decision on record",
        body: [
          {
            kind: "paragraph",
            text: "Do not commit a public launch date before security approval. This is the decision that the July 14 tentative October 15 target will need to reconcile with. If security approval lands on time, the two are compatible; if it slips, the July 14 decision has to be pulled back before it becomes external.",
          },
        ],
      },
      {
        heading: "The security-review checklist Priya committed to",
        body: [
          {
            kind: "bullets",
            items: [
              "Owner assignment — the specific human on the security team who signs off. Still unnamed at meeting end. This is the biggest single risk item.",
              "Data-residency confirmation — EU-specific. Solvable, but requires legal sign-off.",
              "Model output review — a pass over Aurora outputs for anything the review would flag.",
            ],
          },
        ],
      },
      {
        heading: "Where the other threads sit",
        body: [
          {
            kind: "bullets",
            items: [
              "Marketing — Sarah is holding the revised messaging draft. She'll flag the delay to her lead. This is the seed of the eventual overdue commitment on July 10.",
              "Data — Daniel confirms Aurora eval progress is on track. That dependency is currently green.",
              "Engineering — Jimmy is not in this room. His readiness matrix is expected before the July 14 readiness review.",
            ],
          },
        ],
      },
      {
        heading: "Follow-ups leaving the room",
        body: [
          {
            kind: "bullets",
            items: [
              "Maya — confirm the Gemrise security-review owner on our side by next Friday.",
              "Priya — draft the security-review checklist and share this week.",
              "Sarah — hold the messaging draft; flag the delay upward.",
              "Daniel — carry the Aurora dependency status into the Aurora weekly.",
            ],
          },
        ],
      },
      {
        heading: "Signal for the room",
        body: [
          {
            kind: "paragraph",
            text: "This was the correct call to make. The security-first policy is the right default posture for a program of this scope, and Maya framed it in a way that gave marketing internal air. The remaining risk is not the policy — it's the specific human on the security team who owns the review. Until that name lands, the whole program is one absentee-vote away from a slip.",
          },
        ],
      },
    ],
  },

  // ── Gemrise Launch Readiness Review — Jul 14 (the demo meeting) ──────────
  "acme-renewal": {
    headline: "Gemrise Launch Readiness Review",
    tldr:
      "Team lands October 15 as a tentative Gemrise launch target, contingent on the security review clearing. Sarah re-commits to sending revised GTM messaging by Friday, replacing the overdue July 10 promise. Security-review owner still unnamed on the security-team side — Maya to close that loop today. The July 15 leadership readout will inherit these three threads unchanged.",
    sections: [
      {
        heading: "What this meeting was asked to close",
        body: [
          {
            kind: "paragraph",
            text: "This was the readiness review that the June 12 kickoff and the June 18 risk review pointed at. Three questions were on the table: launch timing, security-review ownership, and revised GTM messaging. Maya framed the meeting explicitly as \"close today so we can go to leadership tomorrow with a real readout\" — the July 15 leadership session cannot open with the same three unanswered threads that opened the June 12 kickoff.",
          },
          {
            kind: "paragraph",
            text: "Two of the three moved. The third — security-review ownership — did not.",
          },
        ],
      },
      {
        heading: "The tentative launch decision",
        body: [
          {
            kind: "paragraph",
            text: "Jimmy opened by re-stating the position he brought to the kickoff: cannot commit to Q3 without knowing when security clears. Sarah offered to align GTM messaging to whatever fixed target engineering picks, giving Jimmy the cover to commit. Elena named October 15 as the design-side working target. Jimmy accepted the date verbatim: \"Yes — let's target October 15 for the Gemrise launch, pending the security review clearing.\"",
          },
          {
            kind: "paragraph",
            text: "The word \"pending\" is doing a lot of work in that sentence. This is a tentative external-shape decision that supersedes the June 18 internal policy (\"do not commit a public launch date before security approval\") on one thread while remaining compatible with it on another: if the security review clears by mid-October, the two align; if it slips, the tentative target has to move before it leaks externally. The proactive assistant note on this meeting surfaces exactly that lineage.",
          },
        ],
      },
      {
        heading: "The revised GTM messaging commitment",
        body: [
          {
            kind: "paragraph",
            text: "Sarah's July 10 commitment (revised GTM messaging) was overdue coming into the meeting. She re-committed in the room: \"I'll send the revised launch messaging by Friday.\" That's a new commitment with the same content and a fresh clock, replacing the overdue one. The detected action item on the meeting surfaces exactly this — with a missing due date until Maya confirms it in the meeting-detail view.",
          },
          {
            kind: "paragraph",
            text: "The underlying blocker is the Q3 GTM Approval doc, which is restricted to Sarah (the demo's restricted-source example) and is waiting on a finance sign-off Sarah has been chasing. Until that clears, the Friday commitment carries the same risk as the July 10 one did.",
          },
        ],
      },
      {
        heading: "The thread that did not move",
        body: [
          {
            kind: "paragraph",
            text: "Elena closed the discussion by asking who owns the security review on our end. Maya committed to closing the loop with Priya today and naming the DRI at the leadership readout tomorrow. As of the end of this meeting the security-review owner on the security-team side is still unnamed. That is the single biggest open risk on the program and the reason the October 15 target has a \"pending\" clause instead of a clean commit.",
          },
        ],
      },
      {
        heading: "What changed on the Gemrise Launch topic",
        body: [
          {
            kind: "bullets",
            items: [
              "Launch timeline: concern → tentative decision. Prior state — do not commit a public launch date before security approval. New state — target October 15 for Gemrise launch (pending security). The lineage arrow between these two events is the artifact the assistant surfaces up front.",
              "GTM messaging: overdue commitment → new commitment. Sarah's Jul 10 promise slipped; she re-committed to Friday.",
              "Security-review owner: unchanged. Still unnamed on the security-team side. This is the critical-path risk into the readout.",
            ],
          },
        ],
      },
      {
        heading: "Commitments leaving the room",
        body: [
          {
            kind: "bullets",
            items: [
              "Sarah — send the revised GTM messaging by Friday.",
              "Maya — close the loop with Priya today; name the security DRI at the July 15 leadership readout.",
              "Jimmy — hold the October 15 date internally, pending security clearance.",
              "Elena — plan design QA around the confirmed security DRI once named.",
            ],
          },
        ],
      },
      {
        heading: "Signal for the readout",
        body: [
          {
            kind: "paragraph",
            text: "Leadership will hear a coherent story on two of three threads. The launch date is a real, dated, workable target with an explicit condition. The GTM messaging has a fresh commit with a real Friday cutoff. What leadership must not hear tomorrow is that the security-review owner is still unnamed on the security-team side, which means Maya's follow-up with Priya today is not a nice-to-have — it is what makes the readout survive contact with the audience.",
          },
        ],
      },
    ],
  },

  // ── Aurora ML Model Weekly — Jul 14 ──────────────────────────────────────
  "aurora-weekly": {
    headline: "Aurora ML Model Weekly",
    tldr:
      "Aurora hits 94% on the summarization eval suite, up three points week-over-week. Multilingual regression fixed after tokenizer swap. Team freezes the 07-11 checkpoint as the artifact Gemrise will ship against. Priya can now start the model output review this week. Maya to circulate Q3 experiment metrics tomorrow; Daniel to share the onboarding prototype with Design.",
    sections: [
      {
        heading: "State of the model",
        body: [
          {
            kind: "paragraph",
            text: "Aurora is the internal model program that Gemrise depends on. This week's checkpoint moved the summarization suite from 91% to 94% and closed a multilingual regression that had been open since the prior tokenizer change. Both improvements matter for Gemrise specifically — Docs is the primary summarization surface, and multilingual has been on the security-review radar as an open area.",
          },
        ],
      },
      {
        heading: "The checkpoint freeze",
        body: [
          {
            kind: "paragraph",
            text: "Daniel proposed freezing the 07-11 checkpoint as the specific artifact Gemrise will launch against. His argument: it's the cleanest current artifact and it already passed the internal red-team review from last week, which is a hard input to the broader security review. Maya accepted the freeze on the spot, which unblocks two things downstream — Priya can start the security model-output review immediately, and Design has a stable target to hook the onboarding prototype into.",
          },
        ],
      },
      {
        heading: "Downstream commitments",
        body: [
          {
            kind: "bullets",
            items: [
              "Priya — start the model output review this week, targeting completion before the July 14 readiness review. Confirmed possible now that Aurora is frozen.",
              "Maya — circulate the finalized Q3 Aurora experiment metrics list tomorrow. Still owed from an earlier week.",
              "Daniel — share the onboarding prototype with Design so Elena's team can hook it into the Gemrise entry surface.",
            ],
          },
        ],
      },
      {
        heading: "Risks and open watches",
        body: [
          {
            kind: "paragraph",
            text: "Aurora dependency status remains green for Gemrise's October target. The only quiet risk is that the frozen checkpoint means new eval regressions on the next checkpoint don't automatically block Gemrise — they'd have to be triaged specifically. Daniel and Priya both flagged that they'll rerun the model-output review if the frozen artifact needs a patch between now and October.",
          },
        ],
      },
      {
        heading: "Signal for the room",
        body: [
          {
            kind: "paragraph",
            text: "This is a healthy weekly. Numbers are moving in the right direction, the biggest downstream dependency (security review) is unblocked, and every open thread has an owner. Nothing about this meeting changes the risk picture on Gemrise; it modestly improves it.",
          },
        ],
      },
    ],
  },

  // ── Gemrise Mobile Design 1:1 — Jul 14 (Maya + Elena) ────────────────────
  "mobile-onboarding-review": {
    headline: "Gemrise Mobile Design 1:1",
    tldr:
      "Working session on Gemrise mobile onboarding v2 before the assistant-panel spec locks. Empty state updated so the compose surface doesn't get pushed off screen; suggestion chips are the anchor. Open item: mobile-to-desktop context hand-off needs the shared context spine engineering-side. Elena wants a warmer assistant tone on mobile — \"What needs remembering?\" replaces \"How can I help?\"",
    sections: [
      {
        heading: "Why this 1:1 happened",
        body: [
          {
            kind: "paragraph",
            text: "Maya asked for a short working session with Elena before the assistant-panel spec locks. Two open questions were driving it: whether the mobile empty state was going to hold up on smaller screens, and whether the context hand-off between mobile and desktop was covered in the current design spec or not.",
          },
        ],
      },
      {
        heading: "The empty state that works",
        body: [
          {
            kind: "paragraph",
            text: "Elena walked Maya through the updated Gemrise mobile empty state. The change from v1 is that the assistant panel no longer pushes the compose surface off screen; suggestion chips are the anchor that stays fixed, and everything else scrolls under. That was the specific v1 complaint from the last usability round, so this closes the loop cleanly.",
          },
        ],
      },
      {
        heading: "The hand-off that isn't covered yet",
        body: [
          {
            kind: "paragraph",
            text: "Maya raised a case that isn't in the current spec: a user taps a suggestion chip on mobile, follows the suggestion on desktop, and the context needs to survive across surfaces. Elena's design has the visuals but the actual context payload is engineering-side — it hinges on the shared context spine Jimmy's team owns. Elena's condition for spec'ing the transitions is that engineering commits to that spine by end of week. Maya said she'd bring the ask into the readiness review this afternoon and lock the commit against whatever launch date the group agrees on there.",
          },
        ],
      },
      {
        heading: "The tone call",
        body: [
          {
            kind: "paragraph",
            text: "Elena's second ask was smaller in scope but did belong in this 1:1 rather than the readiness review. She wants the mobile empty state to lean warmer: \"What needs remembering?\" instead of \"How can I help?\" The argument is that the mobile context is fewer taps and more memory-flavored than desktop. Maya approved on the spot and asked Elena to ship the copy through the Gemrise voice-and-tone doc so it doesn't live only in one spec.",
          },
        ],
      },
      {
        heading: "Commitments leaving the room",
        body: [
          {
            kind: "bullets",
            items: [
              "Maya — carry the shared context spine ask into the readiness review; land a commit against the same date the group picks there.",
              "Elena — spec the mobile-to-desktop hand-off transitions once engineering has committed.",
              "Elena — ship the \"What needs remembering?\" copy into the Gemrise voice-and-tone doc.",
            ],
          },
        ],
      },
      {
        heading: "Signal for the room",
        body: [
          {
            kind: "paragraph",
            text: "Efficient 1:1 — one closed loop, one raised issue, one small tone call ratified. The context-spine dependency is the only thing that follows Maya into the readiness review this afternoon.",
          },
        ],
      },
    ],
  },

  // ── Gemrise Q3 Leadership Readout — Jul 15 ───────────────────────────────
  "q3-leadership-update": {
    headline: "Gemrise Q3 Leadership Readout",
    tldr:
      "Readout closes with a coherent October narrative: tentative Oct 15 target from the readiness review, GTM messaging landing Friday, security review on track for October. Two named risks to leadership: security-review owner unassigned on the security-team side, and Q3 GTM approval doc restricted pending finance sign-off. Sarah owns the GTM unblocker today; Priya to name the security DRI by Friday.",
    sections: [
      {
        heading: "What this meeting was for",
        body: [
          {
            kind: "paragraph",
            text: "This was the first time leadership heard Gemrise as a specific dated program. Prior updates had been shape-only. Maya walked in with three concrete inputs from the previous 24 hours: yesterday's readiness review, this morning's Aurora weekly, and last night's follow-up with Priya on the security review. The goal was not to ask for a decision — it was to describe the current state of the program with full transparency about what's committed, what's pending, and what's still open.",
          },
        ],
      },
      {
        heading: "The readout Maya delivered",
        body: [
          {
            kind: "bullets",
            items: [
              "Launch — tentative October 15 target from the readiness review, contingent on security clearance. The date is real; the clearance path is credible; both would need to be true for a public commit.",
              "Marketing — revised GTM messaging draft goes out Friday. Circulated internally first, ahead of the leadership all-hands.",
              "Security — review is on track for October per Priya. Model output review is running against the frozen Aurora checkpoint. Owner assignment on the security-team side is the one open item.",
              "Aurora — 94% on the summarization eval, frozen 07-11 checkpoint, no eval regressions blocking the program.",
            ],
          },
        ],
      },
      {
        heading: "Two named risks for leadership",
        body: [
          {
            kind: "paragraph",
            text: "The readout was explicit about the two things that could still knock the program off October. Naming them up front — instead of letting them surface as questions — was deliberate.",
          },
          {
            kind: "bullets",
            items: [
              "Security-review owner unassigned. Priya can hold the review in the interim but leadership should treat this as a shared call, not a fait accompli. Priya committed to naming the owner in the thread by Friday.",
              "Q3 GTM approval doc restricted, waiting on finance sign-off. Sarah is chasing the unblocker today. Without it the Friday messaging commitment slips again.",
            ],
          },
        ],
      },
      {
        heading: "Commitments leaving the room",
        body: [
          {
            kind: "bullets",
            items: [
              "Sarah — chase the Q3 GTM approval finance sign-off today; unstick the doc.",
              "Priya — name the Gemrise security-review owner in the thread by Friday.",
              "Maya — hold the three-thread frame across the next two weeks; readout again after the Friday deadlines.",
            ],
          },
        ],
      },
      {
        heading: "Signal for the room",
        body: [
          {
            kind: "paragraph",
            text: "This was the right posture for a first leadership readout on a dated program. Nothing was over-committed, nothing was under-disclosed, and the two open risks were named with owners and Friday deadlines. If the two Friday commitments both land, the next leadership update can commit October externally. If either slips, the tentative target moves — which is exactly the property the June 18 policy was designed to preserve.",
          },
        ],
      },
    ],
  },

  // ── Paul 1:1 Sync — Google Cloud Next — Jul 15 ───────────────────────────
  "paul-1-1-cloud-next": {
    headline: "Paul 1:1 Sync — Google Cloud Next",
    tldr:
      "Weekly manager 1:1. Paul and Maya agree Gemrise should skip the Cloud Next main stage and take a 20-minute breakout instead, with a single-line keynote mention and a same-day blog post — no launch date said out loud. Verbatim public phrasing locked: \"planned for later this year, contingent on our security review.\" Elena to co-present the breakout. Paul signals November promo intent if Gemrise lands clean, and floats a cross-org liaison role Maya defers until after October 15.",
    sections: [
      {
        heading: "Why this meeting happened",
        body: [
          {
            kind: "paragraph",
            text: "This was the first 1:1 after the July 14 readiness review closed the October 15 tentative target. Cloud Next lands August 26–28, and the keynote slate closes in ten days, so Paul used the standing time to make two decisions that only he and Maya could make together: how Gemrise shows up at Cloud Next, and whether Maya is set up for promo consideration in the November committee. The 1:1 opened with a health check — Maya described the readiness review as the first Gemrise meeting since June that left her list shorter, not longer.",
          },
        ],
      },
      {
        heading: "The Cloud Next positioning call",
        body: [
          {
            kind: "paragraph",
            text: "Both Maya and Paul arrived with the same instinct — main stage is too aggressive for a program whose security clearance won't have landed by August 26. Announcing a launch date on the keynote and then slipping it would become the story that follows Gemrise into October. The compromise structure they agreed on has three pieces: a 20-minute breakout with Maya presenting, a single line about Gemrise in Thomas's main-keynote segment, and a same-day blog post going one layer deeper on the review-pipeline story.",
          },
          {
            kind: "paragraph",
            text: "Paul is the one taking the keynote-line ask to Thomas today, while the script is still open. The keynote line has no timing verb — draft phrasing is \"Gemini is coming natively to Docs, Sheets, Slides, and Meet — with a shared context spine and a single review pipeline for anything the assistant surfaces.\" The blog post carries the trust argument that will play best with the enterprise buyers actually attending Cloud Next.",
          },
        ],
      },
      {
        heading: "The verbatim external line",
        body: [
          {
            kind: "paragraph",
            text: "Paul and Maya locked one phrase, to be used verbatim whenever anyone at Cloud Next asks when Gemrise ships — on stage, in the hallway, or in analyst conversations: \"planned for later this year, contingent on our security review.\" It's honest, it's directional, and it puts the security review on the record as the gating item, so a slip past October 15 does not invalidate the framing. Maya committed to briefing Meredith so Analyst Relations uses the same wording. The word \"October\" is not to be said out loud at Cloud Next under any circumstance.",
          },
        ],
      },
      {
        heading: "Speaker slot and staffing",
        body: [
          {
            kind: "paragraph",
            text: "Maya wants Elena on stage with her for the breakout — design carries the review-pipeline story more concretely than product does (empty states, assistant-panel consistency, the visual pieces that make the trust argument legible). The breakout submission form needs both speakers named by next Wednesday. Maya will ask Elena tomorrow. She'll also work with Sarah to align the Friday GTM messaging pass to the same review-pipeline framing, so the keynote line, the breakout, the blog post, and Sarah's GTM copy all sit on one benefit rather than four.",
          },
        ],
      },
      {
        heading: "The career conversation",
        body: [
          {
            kind: "paragraph",
            text: "Maya opened the growth thread directly: the surface area she's holding — three threads, six workstreams, a launch — is above her level on paper, and she doesn't want that to become permanent without a title conversation. Paul's read was clean: she is already operating at the next level, and if Gemrise lands well he intends to put her up in the November promo committee. If it slips or ships broken, the story goes with it and they wait a cycle. That framing sharpens the Cloud Next call — a clean cautious story is worth more to the November case than an aggressive one they can't defend.",
          },
          {
            kind: "paragraph",
            text: "Paul also floated a bench-building move: a cross-org liaison role with Cloud, framed as \"Gemini-in-Workspace liaison,\" which he pitched as low-effort, high-visibility, and the exact kind of external stakeholder relationship the promo committee looks for at Maya's level. Maya deferred — adding surface area this month risks the launch — and asked to revisit in the first week of November. Paul agreed to park it.",
          },
        ],
      },
      {
        heading: "Commitments leaving the room",
        body: [
          {
            kind: "bullets",
            items: [
              "Paul — take the keynote-line ask to Thomas today, while the script is still open.",
              "Paul — revisit the Cloud liaison conversation in the first week of November, after Gemrise lands.",
              "Maya — brief Meredith on the verbatim external phrasing for analyst relations this week.",
              "Maya — ask Elena tomorrow about co-presenting the Cloud Next breakout; submit both names by next Wednesday.",
              "Maya — align Sarah's Friday GTM messaging pass to the review-pipeline framing so keynote line, breakout, blog, and GTM copy stay on one benefit.",
              "Maya — send Paul a written recap by end of day so all four commitments live in one place.",
            ],
          },
        ],
      },
      {
        heading: "Signal for the room",
        body: [
          {
            kind: "paragraph",
            text: "This was the calibration 1:1 the Gemrise program needed. Cloud Next is now a coherent story — one benefit, one phrase, one breakout, one blog post — that stays honest whether October 15 lands or slips. The promo signal is exactly clear enough: land the launch, get the case. And the liaison parking-lot decision keeps Maya's plate manageable through October without closing the door on a real November opportunity.",
          },
        ],
      },
    ],
  },
};
