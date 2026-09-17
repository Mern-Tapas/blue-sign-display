"use client";

import { useId, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

const sizes = { md: "size-7", lg: "size-9", xl: "size-11" } as const;

export const defaultRatingLabels = ["Terrible", "Bad", "Okay", "Good", "Loved it"];

export type RatingInputProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  size?: keyof typeof sizes;
  /** Word shown next to the stars for the hovered / chosen score. */
  labels?: string[];
  showLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
};

/**
 * Star picker built on native radio inputs: arrow keys move between scores, the group
 * has one tab stop, and each star is labelled "4 stars, Good". Hover previews the score
 * on fine pointers; the label word means colour is never the only feedback.
 */
export function RatingInput({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  size = "lg",
  labels = defaultRatingLabels,
  showLabel = true,
  disabled = false,
  required,
  name,
  id,
  "aria-label": ariaLabel = "Rating",
  className,
}: RatingInputProps) {
  const uid = useId();
  const groupName = name ?? `rating-${uid}`;
  const control = useFieldControl({ id, required });
  const [valueState, setValueState] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const value = valueProp ?? valueState;
  const shown = hover || value;

  function set(next: number) {
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next);
  }

  return (
    <div
      data-slot="rating-input"
      role="radiogroup"
      id={control.id}
      aria-label={ariaLabel}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control["aria-invalid"]}
      aria-required={control.required || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "group/rating inline-flex items-center gap-3",
        // The stars are the control, so the invalid ring goes around the row of them.
        "aria-invalid:rounded-md aria-invalid:outline-2 aria-invalid:outline-offset-4 aria-invalid:outline-danger",
        className,
      )}
    >
      <div className="flex items-center" onPointerLeave={() => setHover(0)}>
        {Array.from({ length: max }, (_, i) => {
          const score = i + 1;
          const on = score <= shown;
          const word = labels[i];
          return (
            <label
              key={score}
              onPointerEnter={(e) => e.pointerType === "mouse" && !disabled && setHover(score)}
              className={cn(
                "group/star relative flex cursor-pointer items-center justify-center rounded-pill p-0.5",
                "has-focus-visible:outline-2 has-focus-visible:outline-focus-ring",
                disabled && "cursor-not-allowed",
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={score}
                checked={value === score}
                required={control.required && i === 0}
                disabled={disabled}
                onChange={() => set(score)}
                className="peer sr-only"
                aria-label={`${score} ${score === 1 ? "star" : "stars"}${word ? `, ${word}` : ""}`}
              />
              <Star
                aria-hidden
                strokeWidth={1.5}
                className={cn(
                  sizes[size],
                  "transition-[color,fill,transform] duration-(--dur-fast) ease-out motion-safe:group-active/star:scale-90",
                  on ? "fill-rating text-rating" : "fill-surface-sunken text-border-strong",
                  !on && "group-aria-invalid/rating:text-danger",
                  disabled && (on ? "fill-disabled-fg text-disabled-fg" : "fill-disabled text-disabled"),
                )}
              />
            </label>
          );
        })}
      </div>
      {showLabel && (
        <span aria-hidden className={cn("min-w-16 text-label", shown ? "text-fg" : "text-fg-muted")}>
          {shown ? labels[shown - 1] : "Tap to rate"}
        </span>
      )}
    </div>
  );
}
