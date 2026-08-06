/**
 * Referential-integrity check for the seeded mock dataset. Run with:
 *   npx tsx scripts/check-integrity.ts
 * Every cross-reference in `/data/*.ts` must resolve. Failures are printed and
 * the process exits non-zero — do not loosen the assertions to make output
 * pass. Fix the seed data.
 */
import {
  actionItems,
  decisions,
  meetings,
  people,
  risks,
  sources,
  threadEvents,
  threads,
  topics,
  transcripts,
} from "@/data";

const personIds = new Set(people.map((p) => p.id));
const sourceIds = new Set(sources.map((s) => s.id));
const meetingIds = new Set(meetings.map((m) => m.id));
const threadIds = new Set(threads.map((t) => t.id));
const topicIds = new Set(topics.map((t) => t.id));
const eventIds = new Set(threadEvents.map((e) => e.id));

const errors: string[] = [];

function checkId(
  set: Set<string>,
  value: string | undefined | null,
  context: string,
): void {
  if (value == null) return;
  if (!set.has(value)) errors.push(`${context}: unknown id "${value}"`);
}

function checkIds(
  set: Set<string>,
  values: readonly string[] | undefined,
  context: string,
): void {
  if (!values) return;
  for (const v of values) checkId(set, v, context);
}

// people
for (const p of people) {
  if (!p.id.startsWith("person-")) errors.push(`person id shape: ${p.id}`);
}

// meetings
for (const m of meetings) {
  checkId(personIds, m.organizerId, `meeting ${m.id}.organizerId`);
  checkIds(personIds, m.attendeeIds, `meeting ${m.id}.attendeeIds`);
  checkIds(topicIds, m.topicIds, `meeting ${m.id}.topicIds`);
}

// transcripts
for (const t of transcripts) {
  checkId(meetingIds, t.meetingId, `transcript ${t.meetingId}`);
  for (const seg of t.segments) {
    checkId(personIds, seg.speakerId, `transcript ${t.meetingId}.${seg.id}.speakerId`);
  }
}

// sources
for (const s of sources) {
  checkIds(personIds, s.permittedUserIds, `source ${s.id}.permittedUserIds`);
  checkId(personIds, s.ownerId, `source ${s.id}.ownerId`);
  checkIds(personIds, s.participantIds, `source ${s.id}.participantIds`);
}

// threads (Thread has: id, name, topicId, eventIds)
for (const t of threads) {
  checkId(topicIds, t.topicId, `thread ${t.id}.topicId`);
  checkIds(eventIds, t.eventIds, `thread ${t.id}.eventIds`);
}

// thread events
for (const e of threadEvents) {
  checkId(threadIds, e.threadId, `event ${e.id}.threadId`);
  checkId(sourceIds, e.sourceId, `event ${e.id}.sourceId`);
  if (e.speakerId) checkId(personIds, e.speakerId, `event ${e.id}.speakerId`);
  if (e.ownerId) checkId(personIds, e.ownerId, `event ${e.id}.ownerId`);
  checkIds(eventIds, e.linkedEventIds, `event ${e.id}.linkedEventIds`);
}

// decisions
for (const d of decisions) {
  checkId(threadIds, d.threadId, `decision ${d.id}.threadId`);
  checkId(sourceIds, d.sourceId, `decision ${d.id}.sourceId`);
  if (d.ownerId) checkId(personIds, d.ownerId, `decision ${d.id}.ownerId`);
  if (d.supersedesId)
    checkId(new Set(decisions.map((x) => x.id)), d.supersedesId, `decision ${d.id}.supersedesId`);
}

// action items
for (const a of actionItems) {
  checkId(threadIds, a.threadId, `action ${a.id}.threadId`);
  checkId(sourceIds, a.sourceId, `action ${a.id}.sourceId`);
  if (a.ownerId) checkId(personIds, a.ownerId, `action ${a.id}.ownerId`);
}

// risks
for (const r of risks) {
  checkId(threadIds, r.threadId, `risk ${r.id}.threadId`);
  checkIds(sourceIds, r.sourceIds, `risk ${r.id}.sourceIds`);
}

// topics
for (const t of topics) {
  checkIds(personIds, t.participantIds, `topic ${t.id}.participantIds`);
  checkIds(meetingIds, t.meetingIds, `topic ${t.id}.meetingIds`);
  checkIds(threadIds, t.threadIds, `topic ${t.id}.threadIds`);
  checkIds(
    new Set(decisions.map((d) => d.id)),
    t.decisionIds,
    `topic ${t.id}.decisionIds`,
  );
  checkIds(
    new Set(actionItems.map((a) => a.id)),
    t.actionItemIds,
    `topic ${t.id}.actionItemIds`,
  );
  checkIds(
    new Set(risks.map((r) => r.id)),
    t.riskIds,
    `topic ${t.id}.riskIds`,
  );
}

if (errors.length > 0) {
  console.error(`Referential-integrity failed: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `OK — ${people.length} people, ${meetings.length} meetings, ${threads.length} threads, ${threadEvents.length} thread events, ${decisions.length} decisions, ${actionItems.length} actions, ${risks.length} risks, ${sources.length} sources, ${topics.length} topics.`,
);
