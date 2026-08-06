/**
 * Deterministic id helper for seed data and client-side mutation objects.
 * Never use crypto.randomUUID() in seeds — it breaks referential integrity
 * across restarts. This helper enforces a stable slug shape.
 */
export function id(prefix: string, slug: string): string {
  return `${prefix}-${slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
