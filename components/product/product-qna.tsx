"use client";

import { useId, useState } from "react";
import { MessageCircleQuestion, Search, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { Inset } from "@/components/ui/inset";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { formatDate, formatNumber } from "@/lib/format";
import type { ProductQuestion } from "@/lib/data/types";

export type ProductQnAProps = {
  questions: ProductQuestion[];
  /** Submit a new question. Resolve to show the confirmation; throw to show an error. */
  onAsk?: (question: string) => Promise<void>;
  /** Shown instead of the form for signed-out shoppers. */
  askPrompt?: React.ReactNode;
  visibleCount?: number;
  className?: string;
};

function HelpfulButton({ count }: { count: number }) {
  const [voted, setVoted] = useState(false);
  return (
    <Chip
      size="xs"
      selected={voted}
      showCheck={false}
      onClick={() => setVoted((v) => !v)}
      icon={<ThumbsUp aria-hidden className={cn(voted && "fill-current")} />}
      className="text-fg-muted"
    >
      Helpful <span className="font-normal figures">({formatNumber(count + (voted ? 1 : 0))})</span>
    </Chip>
  );
}

/**
 * Questions and answers: search, answered-first list with who answered, helpful votes, and an
 * ask form with a character limit. Unanswered questions stay visible so shoppers know they're
 * being asked.
 */
export function ProductQnA({ questions, onAsk, askPrompt, visibleCount = 3, className }: ProductQnAProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const LIMIT = 250;

  const q = query.trim().toLowerCase();
  const sorted = [...questions].sort((a, b) => Number(Boolean(b.answer)) - Number(Boolean(a.answer)) || b.helpful - a.helpful);
  const matches = q ? sorted.filter((x) => `${x.question} ${x.answer ?? ""}`.toLowerCase().includes(q)) : sorted;
  const shown = expanded || q ? matches : matches.slice(0, visibleCount);

  return (
    <section data-slot="product-qna" aria-labelledby={`${id}-title`} className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="text-heading-sm">
          Questions &amp; answers <span className="text-fg-muted figures">({questions.length})</span>
        </h2>
        {questions.length > 3 && (
          <div className="flex h-control-sm w-full items-center gap-2 rounded-pill bg-surface-sunken px-3 focus-ring-inset sm:w-64">
            <Search aria-hidden className="size-icon-sm text-fg-muted" />
            <input
              type="search"
              aria-label="Search questions"
              placeholder="Search questions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-label outline-none placeholder:text-fg-placeholder"
            />
          </div>
        )}
      </div>

      <ul className="flex flex-col divide-y divide-border-subtle">
        {shown.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 py-4 first:pt-0">
            <p className="text-body-strong text-fg">
              <span className="text-fg-muted">Q: </span>
              {item.question}
            </p>
            {item.answer ? (
              <div className="flex flex-col gap-1">
                <p className="text-body text-fg">
                  <span className="font-medium text-fg-muted">A: </span>
                  {item.answer}
                </p>
                <p className="text-caption text-fg-muted">
                  {item.answeredBy} · {formatDate(item.date)}
                </p>
              </div>
            ) : (
              <p className="text-body text-fg-muted">Not answered yet. Sellers and buyers usually reply within 2 days.</p>
            )}
            {item.answer && (
              <div>
                <HelpfulButton count={item.helpful} />
              </div>
            )}
          </li>
        ))}
        {q && matches.length === 0 && <li className="py-4 text-body text-fg-muted">No questions mention “{query}”. Ask it below.</li>}
      </ul>

      {!q && matches.length > visibleCount && (
        <Button variant="secondary" size="sm" className="self-start" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
          {expanded ? "Show fewer questions" : `See all ${matches.length} questions`}
        </Button>
      )}

      <Inset>
        {sent ? (
          <p role="status" className="flex items-center gap-2 text-body text-success-fg">
            <MessageCircleQuestion aria-hidden className="size-icon-lg" />
            Question posted. We’ll notify you when someone answers.
          </p>
        ) : onAsk ? (
          <form
            noValidate
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const text = draft.trim();
              if (text.length < 10) return setError("Write at least 10 characters so others can answer");
              setPending(true);
              try {
                await onAsk(text);
                setSent(true);
                setDraft("");
              } catch {
                setError("Couldn’t post your question. Try again.");
              } finally {
                setPending(false);
              }
            }}
          >
            <Field id={`${id}-ask`} label="Have a question?" error={error} hint={`Answers come from the seller and verified buyers · ${draft.length}/${LIMIT}`}>
              <Textarea
                value={draft}
                maxLength={LIMIT}
                rows={3}
                placeholder="e.g. Is this water resistant?"
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(undefined);
                }}
              />
            </Field>
            <Button type="submit" loading={pending} className="self-start">
              Post question
            </Button>
          </form>
        ) : (
          askPrompt
        )}
      </Inset>
    </section>
  );
}
