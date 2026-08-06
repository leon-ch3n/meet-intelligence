"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  Info,
  Keyboard,
  Plus,
  Search,
  Send,
  Sparkles,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { TextReveal } from "@/components/ui/text-reveal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ModelPicker, type ModelId } from "@/components/shared/model-picker";
import { askMeetings } from "@/server/services/meeting-search-service";
import { suggestedQueries } from "@/data/search-responses";
import { CURRENT_USER_ID } from "@/data/people";

/**
 * Landing page — Google Meet clone on the left, embedded Ask Gemini on the
 * right. The Ask surface is the same greeting + suggestion widgets + chat
 * flow as the standalone `/ask` route, tuned to live inside a column
 * instead of hijacking the viewport.
 */
export function JoinLanding() {
  const [code, setCode] = useState("");

  return (
    <div className="mx-auto flex min-h-full max-w-[1600px] flex-col px-6 py-8 sm:px-10">
      <div className="grid w-full flex-1 grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* Left column — Meet hero + CTAs */}
        <div className="flex flex-col items-center justify-center pt-6 pb-10 text-center">
          <h1 className="whitespace-nowrap font-heading text-[42px] font-normal leading-[1.15] tracking-tight text-foreground sm:text-[48px]">
            Secure video conferencing
            <br />
            for everyone
          </h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground">
            Connect, collaborate, and celebrate from anywhere with Google Meet
          </p>

          <div className="mt-9 flex items-center gap-3">
            <NewMeetingButton />
            <div className="flex h-12 items-center gap-3 rounded-full border border-input bg-transparent px-5 focus-within:border-foreground">
              <Keyboard className="size-5 text-foreground" aria-hidden />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter a code or nickname"
                aria-label="Enter a code or nickname"
                className="w-[180px] border-0 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="button"
              disabled={!code.trim()}
              className="rounded-full px-3 py-2 text-[14px] font-medium text-action transition-colors hover:bg-action-subtle disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
            >
              Join
            </button>
          </div>

          <UpcomingMeetings />

          <p className="mt-6 text-[13px] text-muted-foreground">
            From your Google Calendar account: chenle27@berkeley.edu
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-action hover:underline"
          >
            <Info className="size-4" aria-hidden />
            Learn more about Google Meet
          </a>
        </div>

        {/* Right column — embedded Ask Gemini */}
        <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
          <EmbeddedAsk />
        </div>
      </div>
    </div>
  );
}

type Upcoming = { time: string; title: string };

const UPCOMING_MEETINGS: readonly Upcoming[] = [
  { time: "3:00 PM", title: "Gemrise Launch — GTM Approval Review" },
  { time: "4:30 PM", title: "Aurora ML weekly sync" },
];

function UpcomingMeetings() {
  return (
    <div
      role="list"
      aria-label="Upcoming meetings"
      className="mt-8 w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="h-px bg-transparent" />
      {UPCOMING_MEETINGS.map((m, i) => (
        <div
          key={m.title}
          role="listitem"
          className={`flex items-center gap-6 px-6 py-5 ${
            i > 0 ? "border-t border-border" : ""
          }`}
        >
          <span className="w-16 shrink-0 text-[15px] text-muted-foreground">
            {m.time}
          </span>
          <span className="text-[15px] text-foreground">{m.title}</span>
        </div>
      ))}
    </div>
  );
}

function NewMeetingButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-0 bg-action px-6 text-[14px] font-medium text-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none"
      >
        <Video className="size-5" aria-hidden />
        New meeting
        <ChevronDown className="size-4" aria-hidden />
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-popover py-2 shadow-lg"
          >
            <MenuItem label="Create a meeting for later" />
            <MenuItem label="Start an instant meeting" />
            <MenuItem label="Schedule in Google Calendar" />
          </div>
        </>
      ) : null}
    </div>
  );
}

function MenuItem({ label }: { label: string }) {
  return (
    <button
      type="button"
      role="menuitem"
      className="flex w-full items-center px-4 py-2.5 text-left text-[14px] text-foreground transition-colors hover:bg-muted"
    >
      {label}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Embedded Ask Gemini — same visual language as `/ask`, sized for a column.
// ────────────────────────────────────────────────────────────────────────

type ResultShape = ReturnType<typeof askMeetings>;

type ChatMessage =
  | { kind: "user"; text: string; id: string }
  | { kind: "thinking"; id: string }
  | { kind: "assistant"; result: ResultShape; id: string };

const THINKING_MS = 820;

function EmbeddedAsk() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [model, setModel] = useState<ModelId>("thinking");
  const seqRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const nextId = () => `m-${++seqRef.current}`;

  const runQuery = (q: string) => {
    if (pending) return;
    const trimmed = q.trim();
    if (!trimmed) return;

    const userId = nextId();
    const thinkingId = nextId();
    setMessages((prev) => [
      ...prev,
      { kind: "user", text: trimmed, id: userId },
      { kind: "thinking", id: thinkingId },
    ]);
    setDraft("");
    setPending(true);

    const result = askMeetings({ query: trimmed, userId: CURRENT_USER_ID });
    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { kind: "assistant", result, id: thinkingId }
            : m,
        ),
      );
      setPending(false);
    }, THINKING_MS);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  const empty = messages.length === 0;

  const resetChat = () => {
    setMessages([]);
    setDraft("");
    setPending(false);
    seqRef.current = 0;
    router.refresh();
  };

  const form = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        runQuery(draft);
      }}
      className="mx-auto flex w-full items-center gap-2 rounded-full bg-muted px-2 py-1 focus-within:bg-card focus-within:shadow-md"
    >
      <button
        type="button"
        onClick={resetChat}
        disabled={pending || empty}
        aria-label="New chat"
        title="New chat"
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-transparent px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-card disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
      >
        <Plus className="size-4" aria-hidden />
        New chat
      </button>
      <Search className="size-5 text-muted-foreground" aria-hidden />
      <label htmlFor="embedded-ask-query" className="sr-only">
        Ask Gemini about your meetings
      </label>
      <input
        id="embedded-ask-query"
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Ask Gemini about your meetings…"
        disabled={pending}
        className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[14px] outline-none placeholder:text-muted-foreground disabled:opacity-60"
      />
      <ModelPicker
        value={model}
        onChange={setModel}
        disabled={pending}
        size="md"
      />
      <button
        type="submit"
        disabled={pending || !draft.trim()}
        aria-label="Send"
        className="inline-flex size-9 items-center justify-center rounded-full bg-action text-action-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <Send className="size-4" aria-hidden />
      </button>
    </form>
  );

  if (empty) {
    return (
      <AuroraBackground className="h-full min-h-[720px] w-full">
        <div className="relative z-10 flex h-full min-h-[720px] w-full flex-col px-4">
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-xl">
              <EmbeddedEmptyState disabled={pending} onPick={runQuery} />
            </div>
          </div>
          <div className="sticky bottom-4 z-20 pb-4">{form}</div>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <div className="flex h-full min-h-[720px] w-full flex-col bg-background px-4">
      <div className="mx-auto w-full max-w-xl flex-1 space-y-4 overflow-y-auto py-6">
        {messages.map((msg) => {
          if (msg.kind === "user") {
            return (
              <div
                key={msg.id}
                className="animate-chat-rise flex justify-end"
              >
                <div className="max-w-[80%] rounded-2xl bg-action px-4 py-2.5 text-[14px] leading-snug text-action-foreground">
                  {msg.text}
                </div>
              </div>
            );
          }
          if (msg.kind === "thinking") {
            return <EmbeddedThinkingBubble key={msg.id} />;
          }
          return (
            <div key={msg.id} className="animate-chat-rise">
              <EmbeddedAnswer
                result={msg.result}
                onFollowUp={runQuery}
                disabled={pending}
              />
            </div>
          );
        })}
        <div ref={scrollRef} aria-hidden />
      </div>
      <div className="sticky bottom-4 z-20 pb-4">{form}</div>
    </div>
  );
}

function EmbeddedEmptyState({
  disabled,
  onPick,
}: {
  disabled: boolean;
  onPick: (q: string) => void;
}) {
  return (
    <div className="flex flex-col justify-center gap-8 py-8">
      <div className="space-y-2 text-center">
        <TextReveal
          as="p"
          className="font-heading text-5xl font-semibold leading-tight tracking-tight text-action sm:text-6xl"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.2}
        >
          Hello, Maya
        </TextReveal>
        <TextReveal
          as="p"
          className="text-xl font-medium text-muted-foreground sm:text-2xl"
          per="word"
          preset="fade-in-blur"
          delay={0.35}
          speedReveal={1.1}
        >
          What needs remembering?
        </TextReveal>
      </div>

      <div className="space-y-2">
        <p
          className="animate-chat-rise text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
          style={{ animationDelay: "160ms" }}
        >
          Try asking
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {suggestedQueries.slice(0, 4).map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => onPick(q)}
              disabled={disabled}
              className="animate-chat-rise flex items-start gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 text-left text-[13px] font-medium text-foreground transition-colors hover:border-action/30 hover:bg-action-subtle/60 disabled:opacity-60"
              style={{ animationDelay: `${220 + i * 70}ms` }}
            >
              <Sparkles
                className="mt-0.5 size-4 shrink-0 text-action"
                aria-hidden
              />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmbeddedThinkingBubble() {
  return (
    <div className="animate-chat-rise flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-action-subtle text-action"
      >
        <Sparkles className="size-4" />
      </span>
      <div className="inline-flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
        <span
          className="animate-thinking-dot size-1.5 rounded-full bg-muted-foreground/70"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="animate-thinking-dot size-1.5 rounded-full bg-muted-foreground/70"
          style={{ animationDelay: "160ms" }}
        />
        <span
          className="animate-thinking-dot size-1.5 rounded-full bg-muted-foreground/70"
          style={{ animationDelay: "320ms" }}
        />
        <span className="ml-1 text-[12px] text-muted-foreground">
          thinking
        </span>
      </div>
    </div>
  );
}

function EmbeddedAnswer({
  result,
  onFollowUp,
  disabled,
}: {
  result: ResultShape;
  onFollowUp: (q: string) => void;
  disabled: boolean;
}) {
  if (result.status === "unsupported_query") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <EmbeddedAvatar />
          <Card className="flex-1 gap-3 border-attention/30 bg-attention-subtle/60 p-5">
            <div className="flex items-center gap-2 text-[13px] font-medium text-attention-foreground">
              <AlertCircle className="size-4" aria-hidden />
              Unsupported query
            </div>
            <p className="text-[13px]">{result.message}</p>
          </Card>
        </div>
      </div>
    );
  }

  if (result.status === "empty" || result.status === "error") {
    return (
      <div className="flex items-start gap-2">
        <EmbeddedAvatar />
        <Card className="flex-1 p-5 text-[13px] text-muted-foreground">
          {"message" in result ? result.message : "No results."}
        </Card>
      </div>
    );
  }

  if (
    result.status !== "ok" &&
    result.status !== "partial" &&
    result.status !== "low_confidence" &&
    result.status !== "missing_source"
  ) {
    return null;
  }

  const { data } = result;
  const partialMessage =
    result.status === "partial" ||
    result.status === "low_confidence" ||
    result.status === "missing_source"
      ? result.message
      : undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <EmbeddedAvatar />
        <Card className="flex-1 gap-2 border-action/20 bg-action-subtle p-5">
          <p className="text-[14px] leading-relaxed">{data.answer}</p>
        </Card>
      </div>

      {partialMessage && (
        <p className="ml-9 text-[12px] text-muted-foreground">
          {partialMessage}
        </p>
      )}

      {data.suggestedFollowUps.length > 0 && (
        <div className="ml-9 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Follow up
          </span>
          {data.suggestedFollowUps.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onFollowUp(q)}
              disabled={disabled}
              className="rounded-full border border-border bg-background px-3 py-1 text-[12px] font-medium transition-colors hover:border-action/30 hover:bg-action-subtle/60 hover:text-action disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmbeddedAvatar() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-action-subtle text-action"
    >
      <Sparkles className="size-4" />
    </span>
  );
}
