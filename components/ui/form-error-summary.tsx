"use client";

import { useEffect, useRef } from "react";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/cn";
import type { ValidationResult } from "@/lib/form/types";

export type FormErrorSummaryProps = {
  /** The result of the last validation run. */
  result: Pick<ValidationResult, "errors" | "order">;
  /** Usually `attempted`: the summary appears once someone has tried to submit. */
  show?: boolean;
  /** Field id for a path, when it isn't the path itself. Return undefined to drop the link. */
  hrefFor?: (path: string) => string | undefined;
  title?: string;
  className?: string;
};

const count = (n: number) => `${n} ${n === 1 ? "problem" : "problems"}`;

/**
 * What stopped the submit, once, at the top of the form — with a link per problem that puts
 * focus on the field.
 *
 * It takes focus itself when it appears, so a keyboard or screen-reader user lands on the
 * explanation instead of being left wherever the submit button was. Pair it with
 * `announce="off"` on the Fields so a failed submit reads one list, not every field at once.
 */
export function FormErrorSummary({ result, show = true, hrefFor = (p) => p, title, className }: FormErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const total = result.order.length;
  const visible = show && total > 0;

  useEffect(() => {
    if (visible) ref.current?.focus();
  }, [visible, total]);

  if (!visible) return null;

  return (
    <Alert
      ref={ref}
      data-slot="form-error-summary"
      tone="danger"
      tabIndex={-1}
      title={title ?? `${count(total)} to fix before this can be saved`}
      className={cn("scroll-mt-24 outline-none", className)}
    >
      <ul className="flex list-disc flex-col gap-1 pl-4">
        {result.order.map((path) => {
          const href = hrefFor(path);
          const message = result.errors[path];
          return (
            <li key={path}>
              {href ? (
                <a
                  href={`#${href}`}
                  className="focus-ring rounded-xs underline underline-offset-2"
                  onClick={(e) => {
                    // Focus the control, not just the anchor target: an input reached by a
                    // hash jump keeps the caret wherever it was.
                    const el = document.getElementById(href);
                    if (!el) return;
                    e.preventDefault();
                    el.focus();
                    el.scrollIntoView({ block: "center", behavior: "smooth" });
                  }}
                >
                  {message}
                </a>
              ) : (
                message
              )}
            </li>
          );
        })}
      </ul>
    </Alert>
  );
}
