import { getSourceById } from "@/server/repositories/source-repository";

/**
 * Permission surface for the intelligence layer. Phase 1 wires the source-level
 * check to `permittedUserIds` since sources already carry that array. Insight-
 * level checks are stubbed to `true`; Phase 3 will compose them from the
 * insight's source citations.
 */

export function canUserViewSource(userId: string, sourceId: string): boolean {
  const source = getSourceById(sourceId);
  if (!source) return false;
  return source.permittedUserIds.includes(userId);
}

/** TODO(phase-3): resolve the insight and check every citation. */
export function canUserViewInsight(
  _userId: string,
  _insightId: string,
): boolean {
  return true;
}
