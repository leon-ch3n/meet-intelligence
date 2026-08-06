import { ExecutiveBrief } from "@/components/meetings/brief/executive-brief";
import { ActionList } from "@/components/meetings/recap/action-list";
import type { MeetingDetail } from "@/server/services/meeting-detail-service";

type Props = { detail: MeetingDetail };

/**
 * The Notes surface for a meeting. Editorial layout: the Gemini-generated
 * long-form summary is the star of the page and absorbs decisions, risks,
 * and cross-meeting changes as prose sections. What surrounds it is the
 * interactive matter — open questions and confirm/dismiss action items.
 * No sub-tabs; everything the reader needs is on one scroll.
 */
export function NotesView({ detail }: Props) {
  return (
    <div className="space-y-12">
      <ExecutiveBrief summary={detail.summary} />

      {detail.openQuestions.length > 0 && (
        <section className="space-y-4">
          <SectionEyebrow>Open questions</SectionEyebrow>
          <ul className="space-y-2 text-[14.5px] leading-[1.7] text-foreground/85">
            {detail.openQuestions.map((q) => (
              <li
                key={q}
                className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-attention/80"
              >
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}

      {detail.actions.length > 0 && (
        <section className="space-y-4">
          <SectionEyebrow>Action items</SectionEyebrow>
          <ActionList actions={detail.actions} />
        </section>
      )}
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h3>
  );
}
