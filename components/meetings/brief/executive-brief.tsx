import type { MeetingSummary } from "@/types";

type Props = { summary: MeetingSummary };

/**
 * Long-form meeting summary — Google Docs / Workspace-notebook aesthetic.
 *
 * We deliberately drop the tinted card container: this is the main reading
 * surface on the page, so it should read as a document, not a widget.
 * H1 title → prominent TL;DR → numbered sections. Numbered anchors give
 * the eye something to grab in a long scroll without inventing color
 * decoration.
 */
export function ExecutiveBrief({ summary }: Props) {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-heading text-[28px] font-medium leading-tight tracking-tight text-foreground sm:text-[32px]">
          {summary.headline}
        </h2>
        {/* TL;DR gets a left rule — familiar "pull-quote" cue that says
            "read this first". */}
        <p className="border-l-2 border-action/70 pl-4 text-[17px] leading-relaxed text-foreground/90">
          {summary.tldr}
        </p>
      </header>

      {summary.sections.length > 0 && (
        <div className="space-y-10">
          {summary.sections.map((section, sectionIdx) => (
            <section
              key={section.heading}
              // Slight anchor id so future in-page nav ("jump to section 3")
              // would work without wiring anything up now.
              id={`summary-${sectionIdx + 1}`}
              className="space-y-3"
            >
              <div className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="font-heading text-[13px] font-medium tabular-nums text-muted-foreground/70"
                >
                  {String(sectionIdx + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-[19px] font-medium leading-snug tracking-tight text-foreground sm:text-[20px]">
                  {section.heading}
                </h3>
              </div>
              <div className="space-y-3 pl-8">
                {section.body.map((block, idx) => {
                  if (block.kind === "paragraph") {
                    return (
                      <p
                        key={idx}
                        className="text-[14.5px] leading-[1.7] text-foreground/85"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  return (
                    <ul
                      key={idx}
                      className="space-y-2 text-[14.5px] leading-[1.7] text-foreground/85"
                    >
                      {block.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-action/70"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
