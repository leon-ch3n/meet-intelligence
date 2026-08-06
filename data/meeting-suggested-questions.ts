/**
 * Per-meeting suggested questions surfaced by the right-rail chat.
 *
 * Wording matters — these should sound like something a person actually types
 * when they're trying to remember what happened in a meeting. Every entry
 * MUST classify to a supported intent through `lib/query-classifier`; the
 * dev-time assertion in `query-classifier.test.ts` guards that.
 *
 * Order matters — the first two are rendered as widgets by default.
 */
export const meetingSuggestedQuestions: Record<string, string[]> = {
  // Gemrise Cross-Functional Kickoff — Jun 12
  "acme-june-12": [
    "What did we agree to in the kickoff?",
    "Who owns each next step?",
    "Where do we stand on the Gemrise launch?",
    "What are the risks for the launch?",
  ],

  // Gemrise Launch Risk Review — Jun 18
  "internal-june-18": [
    "What did we decide about the launch date?",
    "What's blocking the Gemrise launch?",
    "What did we commit to next?",
    "What are the risks for the launch?",
  ],

  // Gemrise Launch Readiness Review — Jul 14 (the demo meeting)
  "acme-renewal": [
    "When are we launching Gemrise?",
    "What did we commit to next?",
    "What's blocking the Gemrise launch?",
    "What changed since the last Gemrise meeting?",
  ],

  // Aurora ML Model Weekly — Jul 14
  "aurora-weekly": [
    "What was decided about the Aurora checkpoint?",
    "What did we commit to next?",
    "Where do we stand on Aurora?",
    "What are the risks for the launch?",
  ],

  // Gemrise Mobile Design 1:1 — Jul 14
  "mobile-onboarding-review": [
    "What did we decide on the mobile empty state?",
    "What did I commit to next?",
    "What's blocking the mobile hand-off?",
    "What did we agree to on assistant tone?",
  ],

  // Gemrise Q3 Leadership Readout — Jul 15
  "q3-leadership-update": [
    "What did leadership hear about the launch date?",
    "What are the risks for the launch?",
    "What did we commit to next?",
    "Where do we stand on the Gemrise launch?",
  ],

  // Paul 1:1 Sync — Google Cloud Next — Jul 15
  "paul-1-1-cloud-next": [
    "What did we decide about Cloud Next?",
    "What did I commit to next?",
    "What are the risks for the launch?",
    "Where do we stand on the Gemrise launch?",
  ],
};

/**
 * Fallback questions when a meeting has no bespoke list — should never fire
 * for the seeded set above, but keeps the surface non-empty.
 */
export const defaultMeetingSuggestedQuestions: readonly string[] = [
  "What was decided in this meeting?",
  "What did we commit to next?",
  "What's blocking the launch?",
];
