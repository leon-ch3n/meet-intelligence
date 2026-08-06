import type { MeetingSearchIntent } from "@/types";

/**
 * Deterministic keyword+entity classifier for Ask Meetings. No ML, no LLM.
 * Rule of thumb: the LONGEST matched phrase wins; ties broken by rule order.
 *
 * Returning `null` means the query didn't match any supported intent — the
 * caller should return the unsupported-query envelope (docs/architecture.md
 * §7). We never guess.
 */

type Rule = {
  intent: MeetingSearchIntent;
  // Every phrase must appear in the (lowercased) query for the rule to fire.
  // A rule with multiple phrases models an AND, e.g. ["overdue", "action"].
  phrases: string[][];
};

const rules: readonly Rule[] = [
  // Prep — highest priority so "prepare me for my Gemrise meeting" doesn't
  // trigger identify_blockers on "gemrise".
  {
    intent: "prepare_for_meeting",
    phrases: [
      ["prepare me for"],
      ["prep me for"],
      ["prepare for", "meeting"],
      ["what should i know"],
      ["brief me on"],
      ["what do i need to know"],
      ["catch me up"],
      ["remind me what"],
    ],
  },
  {
    intent: "identify_blockers",
    phrases: [
      ["preventing", "signing"],
      ["blocking"],
      ["blockers"],
      ["what is holding"],
      ["what's blocking"],
      ["what is preventing"],
      ["what's holding up"],
      ["what's in the way"],
      ["what are the risks"],
      ["risks", "launch"],
    ],
  },
  {
    intent: "find_commitments",
    phrases: [
      ["what did we promise"],
      ["what did i promise"],
      ["what have we promised"],
      ["commitments"],
      ["what did we commit"],
      ["what did we agree to"],
      ["who owns", "next step"],
      ["who is on the hook"],
      ["next steps"],
      ["what did i commit to"],
      ["what did", "commit to"],
    ],
  },
  {
    intent: "find_overdue_actions",
    phrases: [
      ["overdue"],
      ["action items", "overdue"],
      ["past due"],
      ["late"],
      ["missed", "deadline"],
      ["slipped"],
      ["behind schedule"],
    ],
  },
  {
    intent: "find_decisions",
    phrases: [
      ["decisions were reversed"],
      ["decisions", "reversed"],
      ["decisions", "changed"],
      ["what decisions"],
      ["what was decided"],
      ["decision"],
      ["did we agree"],
      ["did we decide"],
      ["what did we settle on"],
      ["launch date"],
      ["when are we launching"],
    ],
  },
  {
    intent: "compare_meetings",
    phrases: [
      ["what changed since"],
      ["changed since the last"],
      ["compare", "meeting"],
      ["diff", "meetings"],
      ["how has", "evolved"],
      ["what's different"],
      ["what moved"],
    ],
  },
  {
    intent: "summarize_topic",
    phrases: [
      ["summarize"],
      ["summary of"],
      ["recap of"],
      ["state of"],
      ["where do we stand"],
      ["where are we on"],
      ["what's the status"],
      ["where does", "stand"],
    ],
  },
  {
    intent: "find_mentions",
    phrases: [
      ["did anyone mention"],
      ["mentions of"],
      ["mentioned"],
      ["said about", "launch"],
      ["what did leadership say"],
      ["did", "say anything about"],
      ["who talked about"],
      ["who said"],
    ],
  },
];

export type ClassifyResult =
  | { intent: MeetingSearchIntent; matchedPhrase: string }
  | null;

export function classifyQuery(query: string): ClassifyResult {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  let best: { intent: MeetingSearchIntent; phrase: string; length: number } | null =
    null;

  for (const rule of rules) {
    for (const phraseGroup of rule.phrases) {
      const allMatch = phraseGroup.every((p) => q.includes(p));
      if (!allMatch) continue;
      const phrase = phraseGroup.join(" + ");
      const length = phraseGroup.reduce((n, p) => n + p.length, 0);
      if (!best || length > best.length) {
        best = { intent: rule.intent, phrase, length };
      }
    }
  }

  return best ? { intent: best.intent, matchedPhrase: best.phrase } : null;
}
