"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useListbox } from "@/lib/form/use-listbox";
import { Popover as PopoverPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Loader2, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";
import { controlShellVariants } from "./input";

export type ComboboxOption = {
  value: string;
  label: string;
  /** Secondary line or trailing meta (e.g. result count, state code). */
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Extra text matched by search but not shown (aliases, codes). */
  keywords?: string[];
};

type Common = VariantProps<typeof controlShellVariants> & {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  /**
   * Take over filtering: its presence switches the built-in match off, so `options` is
   * shown as given. The debounce, the request and its cancellation stay with the caller.
   */
  onSearchChange?: (query: string) => void;
  /** Controlled search text, for when the query lives outside. */
  searchValue?: string;
  /** Results are on their way. Shows a row and marks the listbox busy. */
  loading?: boolean;
  /** Replace the match rule without going fully async. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Offer "Add <query>" when nothing matches. */
  creatable?: boolean;
  createLabel?: (query: string) => React.ReactNode;
  onCreate?: (label: string) => void;
  /** Pinned group above the filtered results, shown only while the search is empty. */
  popularValues?: string[];
  popularLabel?: string;
};

type Single = Common & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

type Multiple = Common & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Max labels listed in the trigger before collapsing to "+N". */
  maxDisplay?: number;
};

export type ComboboxProps = Single | Multiple;

function matches(o: ComboboxOption, q: string) {
  if (!q) return true;
  const hay = [o.label, o.description, ...(o.keywords ?? [])].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((part) => hay.includes(part));
}

/**
 * Searchable select. The trigger opens a popover with a search field (role="combobox")
 * driving a listbox via aria-activedescendant. Single mode closes on pick; multiple mode
 * toggles options and stays open. Use for long lists: states, banks, brands, cities.
 */
export function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No matches",
    onSearchChange,
    searchValue,
    loading = false,
    filter,
    creatable = false,
    createLabel,
    onCreate,
    disabled,
    required,
    id,
    name,
    className,
    variant,
    size,
    shape,
    popularValues,
    popularLabel = "Popular",
    "aria-label": ariaLabel,
  } = props;
  const uid = useId();
  const listId = `${uid}-list`;
  const control = useFieldControl({ id, required });
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");


  const [single, setSingle] = useState<string | null>(props.multiple ? null : (props.defaultValue ?? null));
  const [multi, setMulti] = useState<string[]>(props.multiple ? (props.defaultValue ?? []) : []);
  const selected: string[] = props.multiple
    ? (props.value ?? multi)
    : (() => {
        const v = props.value !== undefined ? props.value : single;
        return v ? [v] : [];
      })();

  const q = (searchValue ?? query).trim();
  const sections = useMemo(() => {
    // An async caller has already filtered server-side; filtering again would hide results.
    const filtered = onSearchChange ? options : options.filter((o) => (filter ? filter(o, q) : matches(o, q)));
    if (q || !popularValues?.length) return [{ label: "", items: filtered }];
    const popular = popularValues.map((v) => options.find((o) => o.value === v)).filter((o): o is ComboboxOption => Boolean(o));
    return [
      { label: popularLabel, items: popular },
      { label: "All", items: filtered.filter((o) => !popularValues.includes(o.value)) },
    ];
  }, [options, q, popularValues, popularLabel, onSearchChange, filter]);
  const flat = sections.flatMap((s) => s.items);

  const listbox = useListbox({
    count: flat.length,
    // A picker always has a candidate, so the first option starts active.
    initialIndex: 0,
    isDisabled: (i) => Boolean(flat[i]?.disabled),
    scrollContainer: listRef,
    // This search field filters a list rather than holding prose, so the list earns Home and End.
    homeEnd: true,
  });
  const { active, setActive } = listbox;
  // Index of each section's first option within `flat` (for aria-activedescendant ids)
  const offsets = sections.map((_, si) => sections.slice(0, si).reduce((n, s) => n + s.items.length, 0));

  function commit(option: ComboboxOption) {
    if (option.disabled) return;
    if (props.multiple) {
      const next = selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value];
      if (props.value === undefined) setMulti(next);
      props.onValueChange?.(next);
    } else {
      if (props.value === undefined) setSingle(option.value);
      props.onValueChange?.(option.value);
      setOpen(false);
    }
  }

  function clear() {
    if (props.multiple) {
      if (props.value === undefined) setMulti([]);
      props.onValueChange?.([]);
    } else {
      if (props.value === undefined) setSingle(null);
      props.onValueChange?.(null);
    }
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (listbox.handleKeyDown(e)) return;
    // Enter stays here: only this component knows that it picks an option.
    if (e.key === "Enter") {
      e.preventDefault();
      const option = flat[active];
      if (option) commit(option);
    }
  }

  const labels = selected.map((v) => options.find((o) => o.value === v)?.label ?? v);
  const maxDisplay = props.multiple ? (props.maxDisplay ?? 2) : 1;
  const summary =
    labels.length === 0 ? null : labels.length <= maxDisplay ? labels.join(", ") : `${labels.slice(0, maxDisplay).join(", ")} +${labels.length - maxDisplay}`;

  const clearable = Boolean(summary) && !disabled && !required;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setQuery("");
          const first = options.findIndex((o) => o.value === selected[0]);
          setActive(first >= 0 && !popularValues?.length ? first : 0);
        }
      }}
    >
      <div data-slot="combobox" className="relative w-full">
        <PopoverPrimitive.Trigger
          data-slot="combobox-trigger"
          id={control.id}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control["aria-invalid"]}
          aria-required={control.required || undefined}
          className={cn(controlShellVariants({ variant, size, shape }), "justify-between text-left outline-none", className)}
        >
          <span className={cn("min-w-0 flex-1 truncate", !summary && "text-fg-placeholder")}>{summary ?? placeholder}</span>
          {props.multiple && selected.length > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-pill bg-accent-soft px-1.5 text-caption-strong text-accent-soft-fg figures">
              {selected.length}
            </span>
          )}
          {/* Reserve room for the clear button, which sits outside the trigger (no nested buttons) */}
          {clearable && <span aria-hidden className="w-6 shrink-0" />}
          <ChevronDown aria-hidden className="transition-transform duration-(--dur-base) ease-out group-data-[state=open]/control:rotate-180" />
        </PopoverPrimitive.Trigger>
        {clearable && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={clear}
            className={cn(
              "state-layer hit-area absolute top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-pill text-fg-muted hover:text-fg",
              size === "sm" ? "right-9.5" : size === "lg" ? "right-11" : "right-10",
            )}
          >
            <X aria-hidden className="size-3.5" />
          </button>
        )}
      </div>
      {name && <input type="hidden" name={name} value={selected.join(",")} />}

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="combobox-content"
          sideOffset={6}
          align="start"
          collisionPadding={16}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            searchRef.current?.focus();
          }}
          className={cn(
            "z-(--z-popover) flex max-h-[min(24rem,var(--radix-popover-content-available-height))] w-(--radix-popover-trigger-width) min-w-64 flex-col overflow-hidden rounded-xl bg-surface-raised text-fg shadow-popover outline-none",
            "origin-(--radix-popover-content-transform-origin) data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          )}
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-3.5 [&_svg]:size-icon-md [&_svg]:text-fg-muted">
            <Search aria-hidden />
            <input
              ref={searchRef}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={flat[active] ? `${uid}-opt-${active}` : undefined}
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={searchValue ?? query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearchChange?.(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKeyDown}
              className="h-11 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-fg-placeholder"
            />
          </div>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={ariaLabel ?? placeholder}
            aria-multiselectable={props.multiple || undefined}
            aria-busy={loading || undefined}
            className="min-h-0 flex-1 overflow-y-auto p-1.5"
          >
            {sections.map((section, si) =>
              section.items.length === 0 ? null : (
                <li key={section.label || "all"} role="presentation">
                  {section.label && <p className="px-3 pt-2 pb-1 text-caption text-fg-muted">{section.label}</p>}
                  <ul role="group" aria-label={section.label || undefined}>
                    {section.items.map((o, oi) => {
                      const i = offsets[si]! + oi;
                      const isSelected = selected.includes(o.value);
                      return (
                        <li
                          key={`${section.label}-${o.value}`}
                          id={`${uid}-opt-${i}`}
                          data-index={i}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={o.disabled || undefined}
                          data-active={i === active || undefined}
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseMove={() => i !== active && setActive(i)}
                          onClick={() => commit(o)}
                          className={cn(
                            "relative flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md py-2 pr-9 pl-3 text-body select-none",
                            "transition-colors duration-(--dur-instant) data-active:bg-highlight [&_svg]:size-icon-md",
                            o.disabled && "cursor-not-allowed text-disabled-fg",
                          )}
                        >
                          {props.multiple && (
                            <span
                              aria-hidden
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-xs border transition-colors duration-(--dur-fast)",
                                isSelected ? "border-accent bg-accent text-fg-on-accent" : "border-border-strong bg-surface",
                              )}
                            >
                              {isSelected && <Check className="size-3!" strokeWidth={3} />}
                            </span>
                          )}
                          {o.icon}
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate">{o.label}</span>
                            {o.description && <span className="truncate text-caption text-fg-muted">{o.description}</span>}
                          </span>
                          {!props.multiple && isSelected && <Check aria-hidden className="absolute right-3 text-accent" />}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ),
            )}
          </ul>
          {loading && (
            <p role="status" className="flex items-center justify-center gap-2 px-4 py-4 text-body text-fg-muted">
              <Loader2 aria-hidden className="size-icon-md motion-safe:animate-spin" />
              Searching…
            </p>
          )}
          {!loading && flat.length === 0 && !(creatable && q) && (
            <p role="status" className="px-4 pt-2 pb-5 text-center text-body text-fg-muted">
              {emptyText}
            </p>
          )}
          {!loading && creatable && q && !options.some((o) => o.label.toLowerCase() === q.toLowerCase()) && (
            <div className="border-t border-border-subtle p-1.5">
              <button
                type="button"
                className="state-layer focus-ring-row relative flex h-row-md w-full items-center gap-2 rounded-md px-3 text-left text-body"
                onClick={() => {
                  onCreate?.(q);
                  setQuery("");
                  onSearchChange?.("");
                  if (!props.multiple) setOpen(false);
                }}
              >
                <Plus aria-hidden className="size-icon-md text-fg-muted" />
                {createLabel ? createLabel(q) : <span>Add “{q}”</span>}
              </button>
            </div>
          )}
          {props.multiple && (
            <div className="flex items-center justify-between gap-2 border-t border-border-subtle px-3 py-2 text-caption text-fg-muted">
              <span aria-live="polite" className="figures">
                {selected.length} selected
              </span>
              <PopoverPrimitive.Close className="hit-area relative rounded-xs px-1 text-label text-accent-fg hover:underline">
                Done
              </PopoverPrimitive.Close>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
