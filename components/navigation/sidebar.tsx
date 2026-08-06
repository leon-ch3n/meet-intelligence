"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Calendar, Folder, Video } from "lucide-react";
import { Wordmark } from "@/components/navigation/wordmark";
import { PaletteTrigger } from "@/components/palette/palette-trigger";
import { listFolders } from "@/server/services/home-list-service";
import { cn } from "@/lib/utils";

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeFolder = params?.get("folder");
  const folders = listFolders();

  const isMeetings = pathname === "/" && !activeFolder;
  const isJoin = pathname.startsWith("/join");

  return (
    <nav
      aria-label="Primary"
      className="flex h-full flex-col gap-3 border-r border-border bg-sidebar px-3 py-4"
    >
      <div className="px-2 pt-1 pb-2">
        <Wordmark size="md" />
      </div>

      <div className="mx-1">
        <PaletteTrigger />
      </div>

      <ul className="flex flex-col gap-0.5">
        <SidebarLink
          href="/join"
          active={isJoin}
          icon={Video}
          label="Join Meeting"
          onNavigate={onNavigate}
        />
        <SidebarLink
          href="/"
          active={isMeetings}
          icon={Calendar}
          label="All Meetings"
          onNavigate={onNavigate}
        />
      </ul>

      {folders.length > 0 && (
        <div className="mt-1">
          <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            Folders
          </p>
          <ul className="flex flex-col">
            {folders.map((f) => {
              const isActive = activeFolder === f.topic.id;
              return (
                <li key={f.topic.id}>
                  <Link
                    href={`/?folder=${f.topic.id}`}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-r-full py-1.5 pl-4 pr-3 text-[13px] text-sidebar-foreground/85 hover:bg-sidebar-accent",
                      isActive &&
                        "bg-action-subtle font-medium text-action hover:bg-action-subtle",
                    )}
                  >
                    <Folder
                      className={cn(
                        "size-4",
                        isActive ? "text-action" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{f.topic.name}</span>
                    <span
                      className={cn(
                        "text-[11px]",
                        isActive ? "text-action" : "text-muted-foreground",
                      )}
                    >
                      {f.meetingCount}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 px-3 pt-4">
        <div
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-action text-[13px] font-medium text-white"
        >
          LC
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">
            Welcome Leon!
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            chenle27@berkeley.edu
          </p>
        </div>
      </div>
    </nav>
  );
}

type SidebarLinkProps = {
  href: string;
  active: boolean;
  icon: React.ElementType;
  label: string;
  onNavigate?: () => void;
};

function SidebarLink({
  href,
  active,
  icon: Icon,
  label,
  onNavigate,
}: SidebarLinkProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          // Rail-item shape: pill-clipped to the right, no left radius —
          // matches Gmail/Docs/Calendar nav rows.
          "group flex min-h-9 items-center gap-3 rounded-r-full py-1.5 pl-4 pr-3 text-[14px] text-sidebar-foreground/85 hover:bg-sidebar-accent",
          active && "bg-action-subtle font-medium text-action hover:bg-action-subtle",
        )}
      >
        <Icon
          className={cn(
            "size-[18px]",
            active ? "text-action" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <span>{label}</span>
      </Link>
    </li>
  );
}
