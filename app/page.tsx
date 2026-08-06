import { Suspense } from "react";
import { MeetingList } from "@/components/home/meeting-list";
import { listMeetings } from "@/server/services/home-list-service";
import { topicRepository } from "@/server/repositories";
import { DEMO_NOW } from "@/lib/dates";

type Props = {
  searchParams: Promise<{ folder?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { folder } = await searchParams;
  const groups = listMeetings({ topicId: folder }, DEMO_NOW);
  const folderTopic = folder ? topicRepository.getTopicById(folder) : undefined;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
          Loading meetings…
        </div>
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="mb-6 flex items-baseline justify-between px-3">
          <h1 className="font-heading text-[28px] leading-tight text-foreground">
            {folderTopic ? folderTopic.name : "All Meetings"}
          </h1>
          {folderTopic ? (
            <span className="text-[12px] text-muted-foreground">Folder</span>
          ) : null}
        </header>
        <MeetingList groups={groups} />
      </div>
    </Suspense>
  );
}
