"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PanelRightClose, PanelRightOpen, Send, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TextReveal } from "@/components/ui/text-reveal";
import { SourceCitation } from "@/components/shared/source-citation";
import { ModelPicker, type ModelId } from "@/components/shared/model-picker";
import { askMeetings } from "@/server/services/meeting-search-service";
import { CURRENT_USER_ID } from "@/data/people";
import type { ProactiveNote } from "@/server/services/meeting-detail-service";
import type { AskMeetingsResponse } from "@/types";

type Props = {
  meetingId: string;
  proactiveNote: ProactiveNote | undefined;
  suggestedQuestions: string[];
};

type ResultShape = ReturnType<typeof askMeetings>;

// Simulated "the model is thinking" latency. Deterministic on purpose —
// there's no live LLM, so we still want the room-cadence of a real answer.
const THINKING_MS = 720;

type ChatMessage =
  | { kind: "user"; text: string; id: string }
  | { kind: "thinking"; id: string }
  | { kind: "assistant"; result: ResultShape; id: string };

export function ChatRail({
  meetingId,
  proactiveNote,
  suggestedQuestions,
}: Props) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [model, setModel] = useState<ModelId>("thinking");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef(0);

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

    // Deterministic query — synchronous — but delay the reveal so the
    // "thinking" indicator actually breathes.
    const result = askMeetings({
      query: trimmed,
      userId: CURRENT_USER_ID,
      filters: { meetingIds: [meetingId] },
    });
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

  // Auto-scroll on new messages / thinking transition.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, pending]);

  const showEmptyState = messages.length === 0;

  if (!open) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <PanelRightOpen className="size-4" aria-hidden />
          Chat
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Meeting chat"
      // Rail is fixed-height so a long summary doesn't stretch the panel down
      // the page. The outer column is `sticky` — this box's height is capped
      // to the viewport, and the messages area inside is its own scroll
      // container.
      className="flex h-[calc(100vh-4rem)] min-h-[520px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card xl:w-[360px]"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-[14px] font-medium">
          {/* Gemini-side-panel motif: blue-tinted circular badge for the
              assistant identity. Same shape Google uses for the Gemini avatar. */}
          <span
            aria-hidden
            className="inline-flex size-6 items-center justify-center rounded-full bg-action-subtle text-action"
          >
            <Sparkles className="size-3.5" />
          </span>
          Chat
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setPending(false);
            }}
            className="inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            New chat
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Collapse chat"
            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <PanelRightClose className="size-4" aria-hidden />
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {showEmptyState && (
          <ChatEmptyState
            proactiveNote={proactiveNote}
            suggestedQuestions={suggestedQuestions}
            disabled={pending}
            onPick={runQuery}
          />
        )}

        {messages.map((msg) => {
          if (msg.kind === "user") {
            return (
              <div
                key={msg.id}
                className="animate-chat-rise flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl bg-action px-3.5 py-2 text-[13px] leading-snug text-action-foreground">
                  {msg.text}
                </div>
              </div>
            );
          }
          if (msg.kind === "thinking") {
            return <ThinkingBubble key={msg.id} />;
          }
          return (
            <div key={msg.id} className="animate-chat-rise">
              <AssistantAnswer
                result={msg.result}
                suggestedQuestions={suggestedQuestions}
                onPick={runQuery}
                disabled={pending}
              />
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runQuery(draft);
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-3"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Gemini about this meeting…"
          aria-label="Ask Gemini about this meeting"
          disabled={pending}
          className="min-w-0 flex-1 rounded-full bg-muted px-4 py-2 text-[13px] outline-none placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-action/50 disabled:opacity-60"
        />
        <ModelPicker
          value={model}
          onChange={setModel}
          disabled={pending}
          size="sm"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={pending || !draft.trim()}
          className="inline-flex size-9 items-center justify-center rounded-full bg-action text-action-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Send className="size-4" aria-hidden />
        </button>
      </form>
    </aside>
  );
}

type EmptyStateProps = {
  proactiveNote: ProactiveNote | undefined;
  suggestedQuestions: string[];
  disabled: boolean;
  onPick: (q: string) => void;
};

function ChatEmptyState({
  proactiveNote,
  suggestedQuestions,
  disabled,
  onPick,
}: EmptyStateProps) {
  // Stagger the widget entrance. Header first, note next, then chips one by
  // one — reads as "the assistant is composing itself for you."
  const widgets = useMemo(
    () => suggestedQuestions.slice(0, 4),
    [suggestedQuestions],
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <TextReveal
          as="p"
          className="font-heading text-[22px] leading-tight text-action"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.2}
        >
          Hello, Maya
        </TextReveal>
        <TextReveal
          as="p"
          className="text-[14px] text-muted-foreground"
          per="word"
          preset="fade-in-blur"
          delay={0.3}
          speedReveal={1.1}
        >
          What needs remembering?
        </TextReveal>
      </div>

      {proactiveNote && (
        <Card
          className="animate-chat-rise gap-2 border-action/25 bg-action-subtle p-4"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-action">
            <Sparkles className="size-3.5" aria-hidden />
            Assistant note
          </div>
          <p className="text-[13px] leading-relaxed text-foreground">
            {proactiveNote.message}
          </p>
          {proactiveNote.source && (
            <SourceCitation source={proactiveNote.source} />
          )}
        </Card>
      )}

      {widgets.length > 0 && (
        <div className="space-y-2">
          <p
            className="animate-chat-rise text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            style={{ animationDelay: `${proactiveNote ? 200 : 120}ms` }}
          >
            Try asking
          </p>
          {widgets.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => onPick(q)}
              disabled={disabled}
              className="animate-chat-rise block w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-left text-[13px] font-medium text-foreground transition-colors hover:border-action/30 hover:bg-action-subtle/60 disabled:opacity-60"
              style={{
                animationDelay: `${(proactiveNote ? 260 : 180) + i * 80}ms`,
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="animate-chat-rise flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-action-subtle text-action"
      >
        <Sparkles className="size-3.5" />
      </span>
      <div className="inline-flex items-center gap-1 rounded-2xl bg-muted px-3 py-2">
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
        <span className="ml-1 text-[11px] text-muted-foreground">thinking</span>
      </div>
    </div>
  );
}

function AssistantAnswer({
  result,
  suggestedQuestions,
  onPick,
  disabled,
}: {
  result: ResultShape;
  suggestedQuestions: string[];
  onPick: (q: string) => void;
  disabled: boolean;
}) {
  // Dead-end states (unsupported / empty) always resurface the widget chips
  // so the user can bounce straight into a valid question instead of staring
  // at a "try a suggested question" message with nothing to click.
  if (result.status === "unsupported_query" || result.status === "empty") {
    return (
      <RecoveryCard
        message={
          ("message" in result && result.message) || "No results."
        }
        suggestedQuestions={suggestedQuestions}
        onPick={onPick}
        disabled={disabled}
      />
    );
  }
  if (
    result.status === "error" ||
    result.status === "loading" ||
    result.status === "restricted"
  ) {
    return (
      <RecoveryCard
        message={
          ("message" in result && result.message) || "Something went wrong."
        }
        suggestedQuestions={suggestedQuestions}
        onPick={onPick}
        disabled={disabled}
      />
    );
  }
  const data = result.data as AskMeetingsResponse;
  // Chat-style rendering: the answer paragraph carries all the content.
  // We deliberately drop the finding cards and citations here — the surface
  // reads as a conversational assistant response, not a search-result page.
  return (
    <div className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-action-subtle text-action"
      >
        <Sparkles className="size-3.5" />
      </span>
      <Card className="gap-2 border-action/20 bg-action-subtle/50 p-3">
        <p className="text-[13px] leading-relaxed text-foreground">
          {data.answer}
        </p>
      </Card>
    </div>
  );
}

function RecoveryCard({
  message,
  suggestedQuestions,
  onPick,
  disabled,
}: {
  message: string;
  suggestedQuestions: string[];
  onPick: (q: string) => void;
  disabled: boolean;
}) {
  const widgets = suggestedQuestions.slice(0, 4);
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-action-subtle text-action"
        >
          <Sparkles className="size-3.5" />
        </span>
        <Card className="gap-1 p-3 text-[12px] text-muted-foreground">
          {message}
        </Card>
      </div>
      {widgets.length > 0 && (
        <div className="space-y-2 pl-8">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Try one of these
          </p>
          {widgets.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => onPick(q)}
              disabled={disabled}
              className="animate-chat-rise block w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-left text-[13px] font-medium text-foreground transition-colors hover:border-action/30 hover:bg-action-subtle/60 disabled:opacity-60"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
