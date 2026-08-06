import type { Person } from "@/types";

/**
 * Gemrise — the internal push to weave Gemini across Google Workspace.
 * All seven people are Google-internal; the "external" relationshipType is
 * unused in this seed but the field remains for type parity.
 *
 * IDs are preserved from the prior seed so services / threads / sources that
 * reference them keep working.
 */

export const CURRENT_USER_ID = "person-maya";

export const people: readonly Person[] = [
  {
    id: "person-maya",
    name: "Maya Patel",
    role: "Product Manager, Gemrise",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-sarah",
    name: "Sarah Kim",
    role: "Marketing Lead, Workspace",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-daniel",
    name: "Daniel Brooks",
    role: "Data Science Lead, Workspace",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-priya",
    name: "Priya Shah",
    role: "Security PM, Gemini Platform",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-jordan",
    name: "Jimmy Lee",
    role: "Engineering Director, Gemini Platform",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-elena",
    name: "Elena Garcia",
    role: "Design Director, Workspace",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-marcus",
    name: "Marcus Chen",
    role: "Program Manager, Gemrise Launch",
    company: "Google",
    relationshipType: "internal",
  },
  {
    id: "person-paul",
    name: "Paul Nguyen",
    role: "Group Product Manager, Workspace (Maya's manager)",
    company: "Google",
    relationshipType: "internal",
  },
];
