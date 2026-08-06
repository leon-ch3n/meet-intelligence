"use client";

import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Model picker for both the meeting-scoped chat and the Ask panel.
 *
 * Illustrative only — this prototype ships without a Gemini wrapper, so the
 * selection is decorative. Kept as a widget because the Google audience will
 * expect to see the model chip; also lets us match the Gemini surface's
 * "Fast · Thinking · Pro" tiering without wiring an actual runtime.
 *
 * Full name shows in the dropdown; the trigger only shows the short tier
 * label (Flash / Thinking / Pro).
 */

export type ModelId = "flash" | "thinking" | "pro";

export type ModelOption = {
  id: ModelId;
  label: string;        // shown in the dropdown menu
  shortLabel: string;   // shown on the closed trigger
  description: string;
};

export const MODEL_OPTIONS: readonly ModelOption[] = [
  {
    id: "flash",
    label: "Gemini 3.5 Flash",
    shortLabel: "Flash",
    description: "Fastest — best for quick lookups",
  },
  {
    id: "thinking",
    label: "Gemini 3.5 Thinking",
    shortLabel: "Thinking",
    description: "Reasons before answering",
  },
  {
    id: "pro",
    label: "Gemini 3.1 Pro",
    shortLabel: "Pro",
    description: "Most capable — deeper synthesis",
  },
];

type Size = "sm" | "md";

type Props = {
  value: ModelId;
  onChange: (id: ModelId) => void;
  disabled?: boolean;
  size?: Size;
};

export function ModelPicker({
  value,
  onChange,
  disabled,
  size = "sm",
}: Props) {
  const active = MODEL_OPTIONS.find((m) => m.id === value) ?? MODEL_OPTIONS[0];
  const triggerClass =
    size === "sm"
      ? "h-7 gap-1 px-2 text-[11px]"
      : "h-8 gap-1.5 px-2.5 text-[12px]";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label={`Model: ${active.label}`}
        className={`inline-flex items-center rounded-full border border-border bg-background font-medium text-muted-foreground transition-colors hover:border-action/30 hover:text-foreground disabled:opacity-50 ${triggerClass}`}
      >
        <span className="text-foreground">{active.shortLabel}</span>
        <ChevronDown className="size-3 opacity-60" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {MODEL_OPTIONS.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onSelect={() => onChange(m.id)}
            className="flex flex-col items-start gap-0.5 py-2"
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-[13px] font-medium">{m.label}</span>
              {m.id === value && (
                <Check className="size-3.5 text-action" aria-hidden />
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {m.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
