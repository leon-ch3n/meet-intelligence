import { topics } from "@/data";
import type { Topic } from "@/types";

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function listTopics(): readonly Topic[] {
  return topics;
}

/** Return the topic's summary or undefined. Phase 6 will make this evolving. */
export function getSummary(id: string): string | undefined {
  return getTopicById(id)?.summary;
}
