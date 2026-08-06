"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Plus } from "lucide-react";

/**
 * User-authored description under the meeting title.
 *
 * Replaces the auto-generated meeting description on the detail page.
 * Persisted per-meeting in localStorage — deterministic (no network,
 * no auth) and matches the prototype's "your notes are yours" story on
 * the Sources tab. Click-to-edit; blur or Esc commits.
 *
 * Reading from localStorage runs through `useSyncExternalStore`. That's
 * the React 19 canonical way to expose external state — it handles the
 * SSR fallback and hydration transition without a setState-in-effect.
 */

const STORAGE_KEY = "cc.meeting-description";
const EVENT_NAME = "cc:meeting-description";

type Store = Record<string, string>;

function readAll(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function writeAll(store: Store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    /* noop — quota / private mode; UI still holds the value in state */
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT_NAME, cb);
  // Cross-tab writes still emit `storage` — treat them the same.
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

function useStoredDescription(meetingId: string) {
  return useSyncExternalStore(
    subscribe,
    () => readAll()[meetingId] ?? "",
    () => "",
  );
}

export function UserDescription({ meetingId }: { meetingId: string }) {
  const stored = useStoredDescription(meetingId);
  const [draft, setDraft] = useState(stored);
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const commit = (next: string) => {
    const all = readAll();
    if (next.trim()) {
      all[meetingId] = next;
    } else {
      delete all[meetingId];
    }
    writeAll(all);
  };

  if (editing) {
    return (
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          commit(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.currentTarget.blur();
          }
        }}
        placeholder="Add a description…"
        aria-label="Meeting description"
        rows={2}
        className="w-full max-w-[62ch] resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:outline-none"
      />
    );
  }

  if (!stored) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft("");
          setEditing(true);
        }}
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="size-3.5" aria-hidden />
        Add a description
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(stored);
        setEditing(true);
      }}
      aria-label="Edit description"
      className="block max-w-[62ch] whitespace-pre-wrap text-left text-[15px] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
    >
      {stored}
    </button>
  );
}
