"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { meetings } from "@/data/meetings";
import { cn } from "@/lib/utils";

type Row =
  | { kind: "meeting"; id: string; label: string; href: string }
  | { kind: "page"; id: string; label: string; href: string; icon: typeof Calendar };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  // Reset input + selection when the dialog closes. Adjusting state during
  // render (React's "you might not need an effect" pattern) avoids a wasted
  // render pass compared to running this in a useEffect.
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setQuery("");
      setSelected(0);
    }
  }

  const rows: Row[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const meetingRows: Row[] = meetings
      .filter((m) => !q || m.title.toLowerCase().includes(q))
      .slice(0, 6)
      .map((m) => ({
        kind: "meeting",
        id: m.id,
        label: m.title,
        href: `/meetings/${m.id}`,
      }));
    const pageDefs: Row[] = [
      {
        kind: "page",
        id: "join",
        label: "Join Meeting",
        href: "/join",
        icon: Video,
      },
      {
        kind: "page",
        id: "meetings",
        label: "All Meetings",
        href: "/",
        icon: Calendar,
      },
    ];
    const pages: Row[] = pageDefs.filter(
      (p) => !q || p.label.toLowerCase().includes(q),
    );
    return [...meetingRows, ...pages];
  }, [query]);

  // Reset selection when the query changes. Same adjust-during-render pattern.
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setSelected(0);
  }

  const go = (row: Row) => {
    onOpenChange(false);
    router.push(row.href);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(rows.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[selected];
      if (row) go(row);
    }
  };

  const meetingRows = rows.filter((r) => r.kind === "meeting");
  const pageRows = rows.filter((r) => r.kind === "page");

  const renderRow = (row: Row, i: number) => {
    const isActive = rows[selected]?.id === row.id;
    const Icon = row.kind === "meeting" ? Search : row.icon;
    return (
      <button
        key={row.id}
        type="button"
        onMouseEnter={() => setSelected(i)}
        onClick={() => go(row)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm",
          isActive ? "bg-muted text-foreground" : "text-muted-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden />
        <span className="truncate text-foreground">{row.label}</span>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Command palette</DialogTitle>
        </DialogHeader>
        <div className="border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search for meetings, conversations, chats…"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {rows.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No matches.
            </p>
          )}
          {meetingRows.length > 0 && (
            <Section title="Search results">
              {meetingRows.map((r) => renderRow(r, rows.indexOf(r)))}
            </Section>
          )}
          {pageRows.length > 0 && (
            <Section title="Pages">
              {pageRows.map((r) => renderRow(r, rows.indexOf(r)))}
            </Section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
