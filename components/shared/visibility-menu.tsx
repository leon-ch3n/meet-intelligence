"use client";

import { Eye, Users, Globe, Lock, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Visibility } from "@/types";

type Props = {
  value: Visibility;
  onChange: (v: Visibility) => void;
};

const labels: Record<Visibility, { label: string; icon: React.ElementType }> = {
  private: { label: "Private to me", icon: Lock },
  internal: { label: "Internal attendees", icon: Users },
  "all-attendees": { label: "Everyone in meeting", icon: Globe },
  "selected-users": { label: "Selected participants", icon: Eye },
};

export function VisibilityMenu({ value, onChange }: Props) {
  const current = labels[value];
  const Icon = current.icon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-action/40 hover:text-foreground">
          <Icon className="size-3.5" aria-hidden />
          {current.label}
          <ChevronDown className="size-3.5" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(labels) as Visibility[]).map((v) => {
          const It = labels[v].icon;
          return (
            <DropdownMenuItem key={v} onSelect={() => onChange(v)}>
              <It className="size-3.5" aria-hidden />
              {labels[v].label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
