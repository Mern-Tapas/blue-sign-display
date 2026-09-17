"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Chip } from "./chip";
import { useFieldControl } from "./field";
import { controlShellVariants } from "./input";

export type TagInputProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  /** Stop accepting new tags at this many. */
  max?: number;
  /** Per-tag character limit. */
  maxLength?: number;
  /** Return a message to reject a tag; undefined accepts it. Duplicates are rejected already. */
  validate?: (tag: string, existing: string[]) => string | undefined;
  /** Keys that end a tag, besides Enter. */
  delimiters?: string[];
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  className?: string;
};

/**
 * Free text in, chips out: search tags, size lists, PIN groups.
 *
 * Enter or a delimiter commits, Backspace on an empty field removes the last chip, and a
 * paste splits on the delimiters — so pasting a comma-separated list does the obvious thing.
 * Every add and remove is announced, because the input clears itself and a chip appearing
 * elsewhere is otherwise silent.
 */
export function TagInput({
  value,
  onValueChange,
  placeholder = "Add and press Enter",
  max,
  maxLength = 32,
  validate,
  delimiters = [",", "Tab"],
  disabled,
  id,
  name,
  required,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  className,
}: TagInputProps) {
  const control = useFieldControl({ id, required, "aria-describedby": describedBy, "aria-invalid": invalid });
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState<string>();
  const [announcement, setAnnouncement] = useState("");

  const full = max !== undefined && value.length >= max;

  function add(raw: string) {
    const tag = raw.trim().slice(0, maxLength);
    if (!tag) return;
    if (full) return setMessage(`That's the limit of ${max}`);
    if (value.includes(tag)) {
      setMessage(`"${tag}" is already in the list`);
      return;
    }
    const rejected = validate?.(tag, value);
    if (rejected) return setMessage(rejected);
    setMessage(undefined);
    onValueChange([...value, tag]);
    setAnnouncement(`${tag} added, ${value.length + 1} total`);
    setDraft("");
  }

  function remove(tag: string) {
    onValueChange(value.filter((t) => t !== tag));
    setAnnouncement(`${tag} removed, ${value.length - 1} remaining`);
    setMessage(undefined);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        data-slot="tag-input"
        className={cn(
          controlShellVariants({ shape: "rounded" }),
          "h-auto min-h-control-md flex-wrap items-center gap-1.5 py-1.5",
          disabled && "cursor-not-allowed border-transparent bg-disabled",
        )}
      >
        {value.map((tag) => (
          <Chip key={tag} size="xs" variant="sunken" onRemove={disabled ? undefined : () => remove(tag)} removeLabel={`Remove ${tag}`}>
            {tag}
          </Chip>
        ))}
        <input
          type="text"
          value={draft}
          disabled={disabled}
          maxLength={maxLength}
          aria-label={ariaLabel}
          placeholder={full ? `Limit of ${max} reached` : value.length === 0 ? placeholder : undefined}
          className="h-control-sm w-0 min-w-24 flex-1 bg-transparent outline-none placeholder:text-fg-placeholder disabled:cursor-not-allowed"
          onChange={(e) => {
            setDraft(e.target.value);
            if (message) setMessage(undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || delimiters.includes(e.key)) {
              // Tab only commits when there is something to commit, so it still moves on.
              if (e.key === "Tab" && !draft.trim()) return;
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
              remove(value[value.length - 1]!);
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            const splitter = delimiters.filter((d) => d.length === 1);
            if (!splitter.some((d) => text.includes(d))) return;
            e.preventDefault();
            const parts = text.split(new RegExp(`[${splitter.join("")}\n]`));
            let next = value;
            for (const part of parts) {
              const tag = part.trim().slice(0, maxLength);
              if (tag && !next.includes(tag) && !(max !== undefined && next.length >= max) && !validate?.(tag, next)) next = [...next, tag];
            }
            onValueChange(next);
            setAnnouncement(`${next.length - value.length} added, ${next.length} total`);
            setDraft("");
          }}
          onBlur={() => draft.trim() && add(draft)}
          {...control}
        />
        {name && <input type="hidden" name={name} value={value.join(",")} />}
      </div>
      {message && (
        <p role="alert" className="text-caption text-danger-fg">
          {message}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
