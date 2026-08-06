import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { DetailTabs, type TabKey } from "@/components/meeting-detail/tabs";
import { NotesView } from "@/components/meeting-detail/notes-view";
import { SourcesView } from "@/components/meeting-detail/sources-view";
import { ChatRail } from "@/components/meeting-detail/chat-rail";
import { UserDescription } from "@/components/meeting-detail/user-description";
import { getMeetingDetail } from "@/server/services/meeting-detail-service";
import { CURRENT_USER_ID } from "@/data/people";
import { formatDate, formatTime } from "@/lib/dates";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function MeetingDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { tab } = await searchParams;
  const detail = getMeetingDetail(id, CURRENT_USER_ID);
  if (!detail) notFound();

  const activeTab: TabKey = tab === "sources" ? "sources" : "notes";
  const { meeting, topic } = detail;

  return (
    <div className="mx-auto flex w-full max-w-7xl items-start gap-8 px-4 py-8 sm:px-6">
      <div className="min-w-0 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" aria-hidden />
          Back
        </Link>

        <header className="mt-4 space-y-4 border-b border-border pb-6">
          {/* Meta first, then title — Google Docs / news-article ordering.
              Puts the "what/when" flag at the top so title has room to breathe. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
            <span>{formatDate(meeting.startTime)}</span>
            <span aria-hidden>·</span>
            <span>{formatTime(meeting.startTime)}</span>
            {topic && (
              <>
                <span aria-hidden>·</span>
                <span>{topic.name}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="capitalize">{meeting.meetingType}</span>
          </div>
          <h1 className="font-heading text-[32px] font-medium leading-[1.15] tracking-tight sm:text-[38px]">
            {meeting.title}
          </h1>
          <UserDescription meetingId={meeting.id} />
        </header>

        <div className="mt-6">
          <DetailTabs active={activeTab} />
        </div>

        <div className="mt-8">
          {activeTab === "notes" ? (
            <NotesView detail={detail} />
          ) : (
            <SourcesView detail={detail} />
          )}
        </div>
      </div>

      <div className="sticky top-6 hidden self-start xl:block xl:w-[360px] xl:flex-none">
        <ChatRail
          meetingId={meeting.id}
          proactiveNote={detail.proactiveNote}
          suggestedQuestions={detail.suggestedQuestions}
        />
      </div>
    </div>
  );
}
