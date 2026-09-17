"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

export type TextareaProps = React.ComponentProps<"textarea"> & {
  variant?: "surface" | "sunken";
  /** Grow with the content between minRows and maxRows instead of scrolling. */
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
};

export function Textarea({
  variant = "surface",
  autosize = false,
  minRows,
  maxRows = 12,
  className,
  id,
  required,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  rows = 4,
  onChange,
  ref: forwardedRef,
  ...props
}: TextareaProps) {
  const control = useFieldControl({ id, required, "aria-describedby": describedBy, "aria-invalid": invalid });
  const innerRef = useRef<HTMLTextAreaElement>(null);

  // The height is written straight to the node rather than held in state: it is a measurement
  // of the DOM, so round-tripping it through a render only adds a frame where they disagree.
  const measure = useCallback(() => {
    const el = innerRef.current;
    if (!el || !autosize) return;
    const styles = getComputedStyle(el);
    const line = parseFloat(styles.lineHeight) || 20;
    const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const border = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
    const min = (minRows ?? rows) * line + padding + border;
    const max = maxRows * line + padding + border;
    // Collapse first: scrollHeight only shrinks once the box is smaller than its content.
    el.style.height = "auto";
    const content = el.scrollHeight + border;
    el.style.height = `${Math.min(Math.max(content, min), max)}px`;
    // Past the limit it scrolls, which is the whole point of maxRows.
    el.style.overflowY = content > max ? "auto" : "hidden";
  }, [autosize, maxRows, minRows, rows]);

  // Layout effect, so the first paint is already the right height rather than one row that jumps.
  useLayoutEffect(() => {
    if (!autosize) return;
    measure();
    const el = innerRef.current;
    if (!el?.parentElement || typeof ResizeObserver === "undefined") return;
    // Observe the parent, not the textarea: observing the element we resize would re-fire on
    // our own write. A narrower column or a late-loading font changes the wrap, so re-measure.
    const observer = new ResizeObserver(measure);
    observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [autosize, measure, props.value, props.defaultValue]);

  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      ref={(node) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      style={props.style}
      onChange={(event) => {
        onChange?.(event);
        if (autosize) measure();
      }}
      className={cn(
        "w-full resize-y rounded-lg border px-4 py-3 text-body text-fg transition-[border-color,background-color] duration-(--dur-fast) focus-ring-inset aria-invalid:[--focus-ring:var(--danger)]",
        "placeholder:text-fg-placeholder",
        "aria-invalid:border-danger disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-fg",
        "read-only:border-transparent read-only:bg-surface-sunken",
        variant === "surface" ? "border-border bg-surface hover:border-border-strong" : "border-transparent bg-surface-sunken focus:bg-surface",
        // Nothing to drag when the box sizes itself; the caret can still reach every line.
        autosize && "resize-none overflow-hidden",
        className,
      )}
      {...control}
      {...props}
    />
  );
}
