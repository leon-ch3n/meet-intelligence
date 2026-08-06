import type { Risk } from "@/types";

export const risks: readonly Risk[] = [
  {
    id: "risk-renewal-timing",
    title: "Launch date may precede security readiness",
    description:
      "Leadership readout is July 15, but the October 15 launch target depends on security approval that has no assigned owner.",
    severity: "medium",
    status: "open",
    sourceIds: [
      "source-meeting-acme-renewal",
      "source-meeting-internal-june-18",
    ],
    threadId: "thread-acme-migration",
    visibility: "internal",
  },
  {
    id: "risk-security-unassigned",
    title: "Security approval remains unassigned",
    description:
      "No named owner on the security-team side for the Gemrise security review.",
    severity: "high",
    status: "open",
    sourceIds: [
      "source-meeting-acme-june-12",
      "source-meeting-internal-june-18",
      "source-meeting-acme-renewal",
    ],
    threadId: "thread-acme-security",
    visibility: "internal",
  },
  {
    id: "risk-pricing-approval",
    title: "GTM approval may delay reveal messaging",
    description:
      "Revised GTM messaging depends on the Q3 GTM Approval doc (restricted). Delay would slip Sarah's Friday commitment.",
    severity: "medium",
    status: "open",
    sourceIds: [
      "source-chat-internal-pricing",
      "source-email-acme-followup",
    ],
    threadId: "thread-acme-pricing",
    visibility: "internal",
  },
];
