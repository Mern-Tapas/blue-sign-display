"use client";

import { useState } from "react";
import { Flag, ThumbsDown, ThumbsUp } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export type HelpfulVoteProps = {
  /** Existing helpful votes (excluding this shopper). */
  helpful: number;
  notHelpful?: number;
  onVote?: (vote: "up" | "down" | null) => void;
  onReport?: () => void;
  /** What is being rated, for accessible names ("review by Ananya"). */
  subject?: string;
  className?: string;
};


/**
 * "Was this helpful?" with up / down toggles (one choice at a time, pressing again undoes it),
 * counts that include the shopper's vote, and an optional Report link.
 */
export function HelpfulVote({ helpful, notHelpful, onVote, onReport, subject, className }: HelpfulVoteProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  function cast(next: "up" | "down") {
    const value = vote === next ? null : next;
    setVote(value);
    onVote?.(value);
  }

  return (
    <div data-slot="helpful-vote" role="group" aria-label={subject ? `Rate ${subject}` : "Was this helpful?"} className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-caption text-fg-muted">Helpful?</span>
      <Chip
        size="xs"
        selected={vote === "up"}
        showCheck={false}
        onClick={() => cast("up")}
        icon={<ThumbsUp aria-hidden className={cn(vote === "up" && "fill-current")} />}
        className="text-fg-muted"
      >
        Yes <span className="font-normal figures">({formatNumber(helpful + (vote === "up" ? 1 : 0))})</span>
      </Chip>
      {notHelpful !== undefined && (
        <Chip
          size="xs"
          selected={vote === "down"}
          showCheck={false}
          onClick={() => cast("down")}
          icon={<ThumbsDown aria-hidden className={cn(vote === "down" && "fill-current")} />}
          className="text-fg-muted"
        >
          No <span className="font-normal figures">({formatNumber(notHelpful + (vote === "down" ? 1 : 0))})</span>
        </Chip>
      )}
      {onReport && (
        <TextButton tone="muted" size="sm" onClick={onReport} className="ml-auto font-normal">
          <Flag aria-hidden />
          Report
        </TextButton>
      )}
      <span aria-live="polite" className="sr-only">
        {vote === "up" ? "Marked helpful" : vote === "down" ? "Marked not helpful" : ""}
      </span>
    </div>
  );
}
