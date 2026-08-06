import type { Topic } from "@/types";

export const topics: readonly Topic[] = [
  {
    id: "topic-acme-renewal",
    name: "Gemrise Launch",
    summary:
      "The Gemrise launch program — Gemini across Google Workspace. Three active threads: launch timeline, security-review ownership, and GTM messaging. Leadership readout on July 14; proposed launch target October 15 pending security sign-off.",
    meetingIds: [
      "acme-june-12",
      "internal-june-18",
      "acme-renewal",
      "q3-leadership-update",
    ],
    participantIds: [
      "person-maya",
      "person-sarah",
      "person-daniel",
      "person-priya",
      "person-jordan",
      "person-elena",
      "person-marcus",
    ],
    threadIds: [
      "thread-acme-migration",
      "thread-acme-security",
      "thread-acme-pricing",
    ],
    decisionIds: ["decision-mig-jun18", "decision-mig-jul13"],
    actionItemIds: [
      "action-pricing-jul10",
      "action-pricing-jul13",
      "action-security-owner",
    ],
    riskIds: [
      "risk-renewal-timing",
      "risk-security-unassigned",
      "risk-pricing-approval",
    ],
  },
  {
    id: "topic-project-aurora",
    name: "Aurora ML",
    summary:
      "Internal model program that Gemrise depends on. Weekly Aurora sync tracks eval progress, checkpoint freezes, and dependencies with the launch timeline.",
    meetingIds: ["aurora-weekly"],
    participantIds: ["person-maya", "person-daniel", "person-priya"],
    threadIds: [],
    decisionIds: [],
    actionItemIds: ["action-onboarding-prototype", "action-experiment-metrics"],
    riskIds: [],
  },
  {
    id: "topic-enterprise-migration",
    name: "Workspace Integration",
    summary:
      "Cross-surface integration patterns for Workspace. Overlaps with the Gemrise launch timeline thread.",
    meetingIds: [],
    participantIds: ["person-daniel", "person-priya"],
    threadIds: [],
    decisionIds: [],
    actionItemIds: [],
    riskIds: [],
  },
  {
    id: "topic-security-review",
    name: "Security Review",
    summary:
      "Security-review ownership across the Gemrise launch. Currently unassigned on the security team side.",
    meetingIds: ["internal-june-18"],
    participantIds: ["person-priya", "person-maya"],
    threadIds: [],
    decisionIds: [],
    actionItemIds: ["action-security-owner"],
    riskIds: ["risk-security-unassigned"],
  },
  {
    id: "topic-pricing-approval",
    name: "GTM Approval",
    summary:
      "Q3 GTM approvals gate the Gemrise reveal messaging. Approval doc is restricted.",
    meetingIds: [],
    participantIds: ["person-sarah"],
    threadIds: [],
    decisionIds: [],
    actionItemIds: ["action-pricing-jul10", "action-pricing-jul13"],
    riskIds: ["risk-pricing-approval"],
  },
  {
    id: "topic-manager-1-1",
    name: "Manager 1:1",
    summary:
      "Weekly 1:1 with Paul Nguyen, Maya's manager. Standing agenda: Gemrise health, Cloud Next positioning, career growth.",
    meetingIds: ["paul-1-1-cloud-next"],
    participantIds: ["person-maya", "person-paul"],
    threadIds: [],
    decisionIds: [],
    actionItemIds: [],
    riskIds: [],
  },
];
