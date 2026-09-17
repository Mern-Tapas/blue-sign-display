"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatSlugInput, slugify } from "@/lib/form/slugify";
import { Input, type InputProps } from "./input";
import { TextButton } from "./text-button";

export type SlugInputProps = Omit<InputProps, "value" | "onChange" | "prefix"> & {
  value: string;
  onValueChange: (value: string) => void;
  /** The field this is derived from — usually a name or title. */
  source?: string;
  /** Names the source in the button: "Use product name". */
  sourceLabel?: string;
  /**
   * Follow `source` until someone edits the slug by hand, then stop. Editing is permanent
   * for the life of the field: a handle that silently re-derives after you have changed it
   * is a URL that changes under a link.
   */
  autoSync?: boolean;
  /** Shown before the field, e.g. "bluesigns.shop/products/". */
  prefix?: React.ReactNode;
};

/**
 * A URL handle: generated from another field, overridable by hand, and never silently
 * re-generated once it has been touched.
 */
export function SlugInput({ value, onValueChange, source, sourceLabel = "name", autoSync = true, prefix, className, ...props }: SlugInputProps) {
  const [edited, setEdited] = useState(false);
  const derived = source ? slugify(source) : "";
  const following = autoSync && !edited && Boolean(source);
  // While it follows the source, the source is the value — no effect, no second state.
  const shown = following ? derived : value;
  const canApply = Boolean(derived) && derived !== value;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Input
        value={shown}
        onChange={(e) => {
          setEdited(true);
          onValueChange(formatSlugInput(e.target.value));
        }}
        startSlot={prefix ? <span className="shrink-0 truncate text-fg-muted">{prefix}</span> : undefined}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="text-code"
        {...props}
      />
      <p className="flex flex-wrap items-center gap-x-2 text-caption text-fg-muted">
        {following ? (
          <span>Follows the {sourceLabel}. Editing it stops that.</span>
        ) : (
          <>
            <span>Edited by hand.</span>
            {canApply && (
              <TextButton
                type="button"
                size="sm"
                onClick={() => {
                  setEdited(false);
                  onValueChange(derived);
                }}
              >
                Use the {sourceLabel}
              </TextButton>
            )}
          </>
        )}
      </p>
    </div>
  );
}
