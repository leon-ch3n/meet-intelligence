import type { Source } from "@/types";
import { FileText, Mail, Calendar, MessageSquare, Video, Captions } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  source: Source;
  timestamp?: string;
  className?: string;
};

const iconByType = {
  document: FileText,
  email: Mail,
  calendar: Calendar,
  chat: MessageSquare,
  meeting: Video,
  transcript: Captions,
} as const;

export function SourceCitation({ source, timestamp, className }: Props) {
  const Icon = iconByType[source.sourceType];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="truncate">{source.title}</span>
      {timestamp && (
        <span className="text-muted-foreground/70">· {timestamp}</span>
      )}
    </span>
  );
}
