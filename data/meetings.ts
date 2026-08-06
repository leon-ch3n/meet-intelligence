import type { Meeting } from "@/types";

/**
 * IDs match the "Meetings referenced" table in docs/mock-data.md.
 *
 * Gemrise is Google's internal push to weave Gemini across Workspace surfaces.
 * All six meetings sit under that program: a kickoff, a risk review, a
 * launch-readiness readout (the demo meeting), a weekly Aurora ML sync, a
 * design 1:1, and a leadership readout.
 *
 * IDs are unchanged from the earlier Acme seed so services / threads /
 * sources / URLs keep working. Meeting titles and copy are new.
 */
export const meetings: readonly Meeting[] = [
  {
    id: "acme-june-12",
    title: "Gemrise Cross-Functional Kickoff",
    description:
      "First cross-functional kickoff for the Gemrise launch. Concerns raised on launch timing, security-review ownership, and GTM messaging.",
    startTime: "2026-06-12T15:00:00.000Z",
    endTime: "2026-06-12T16:00:00.000Z",
    status: "completed",
    meetingType: "internal",
    organizerId: "person-marcus",
    attendeeIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-jordan",
      "person-elena",
      "person-marcus",
    ],
    topicIds: ["topic-acme-renewal"],
    transcriptId: "transcript-june-12-kickoff",
    visibility: "all-attendees",
  },
  {
    id: "internal-june-18",
    title: "Gemrise Launch Risk Review",
    description:
      "Small-group risk review. Team decides not to commit a public launch date before security approval lands.",
    startTime: "2026-06-18T17:00:00.000Z",
    endTime: "2026-06-18T17:45:00.000Z",
    status: "completed",
    meetingType: "internal",
    organizerId: "person-maya",
    attendeeIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
    ],
    topicIds: ["topic-acme-renewal", "topic-security-review"],
    transcriptId: "transcript-june-18-risk-review",
    visibility: "internal",
  },
  {
    id: "acme-renewal",
    title: "Gemrise Launch Readiness Review",
    description:
      "Cross-functional readiness review for the Gemrise launch. Confirm launch timing, security-review ownership, and GTM messaging.",
    startTime: "2026-07-14T19:00:00.000Z",
    endTime: "2026-07-14T19:45:00.000Z",
    status: "upcoming",
    meetingType: "internal",
    organizerId: "person-maya",
    attendeeIds: [
      "person-maya",
      "person-sarah",
      "person-jordan",
      "person-elena",
    ],
    topicIds: ["topic-acme-renewal"],
    transcriptId: "transcript-acme-renewal",
    visibility: "all-attendees",
  },
  {
    id: "aurora-weekly",
    title: "Aurora ML Model Weekly",
    description:
      "Weekly Aurora ML model status — Gemrise dependency, eval progress, risks, and next milestones.",
    startTime: "2026-07-14T21:00:00.000Z",
    endTime: "2026-07-14T21:30:00.000Z",
    status: "upcoming",
    meetingType: "internal",
    organizerId: "person-daniel",
    attendeeIds: [
      "person-maya",
      "person-daniel",
      "person-priya",
    ],
    topicIds: ["topic-project-aurora"],
    transcriptId: "transcript-aurora-weekly",
    visibility: "internal",
  },
  {
    id: "mobile-onboarding-review",
    title: "Gemrise Mobile Design 1:1",
    description:
      "1:1 with Design on Gemrise mobile onboarding v2 — hand-off, edge cases, empty states.",
    startTime: "2026-07-14T23:00:00.000Z",
    endTime: "2026-07-15T00:00:00.000Z",
    status: "upcoming",
    meetingType: "internal",
    organizerId: "person-maya",
    attendeeIds: ["person-maya", "person-elena"],
    topicIds: [],
    transcriptId: "transcript-mobile-1-1",
    visibility: "internal",
  },
  {
    id: "q3-leadership-update",
    title: "Gemrise Q3 Leadership Readout",
    description:
      "Leadership readout on Q3 Gemrise launch goals and open risks.",
    startTime: "2026-07-15T18:00:00.000Z",
    endTime: "2026-07-15T18:30:00.000Z",
    status: "upcoming",
    meetingType: "internal",
    organizerId: "person-maya",
    attendeeIds: ["person-maya", "person-sarah", "person-priya"],
    topicIds: ["topic-acme-renewal"],
    transcriptId: "transcript-q3-leadership",
    visibility: "internal",
  },
  {
    id: "paul-1-1-cloud-next",
    title: "Paul 1:1 Sync — Google Cloud Next",
    description:
      "Weekly 1:1 with Paul. Focus: Gemrise readiness talking points for Cloud Next, Maya's speaker slot, and career pacing after launch.",
    startTime: "2026-07-15T16:00:00.000Z",
    endTime: "2026-07-15T16:20:00.000Z",
    status: "completed",
    meetingType: "internal",
    organizerId: "person-paul",
    attendeeIds: ["person-maya", "person-paul"],
    topicIds: ["topic-manager-1-1"],
    transcriptId: "transcript-paul-1-1-cloud-next",
    visibility: "internal",
  },
];
