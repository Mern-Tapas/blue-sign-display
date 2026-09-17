"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { CountBadge } from "@/components/ui/count-badge";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetBody, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------- FilterBar */

export type FilterDef = { id: string; label: string; options: { value: string; label: string; count?: number }[] };
export type FilterValues = Record<string, string[]>;

export type FilterBarProps = {
  search: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDef[];
  values?: FilterValues;
  onValuesChange?: (v: FilterValues) => void;
  /** Extra controls in the same row (date range, view switch). */
  children?: React.ReactNode;
  className?: string;
};

/** One row above what it scopes: search, filter menus with counts, removable active chips, clear all. */
export function FilterBar({ search, onSearchChange, searchPlaceholder = "Search", filters = [], values = {}, onValuesChange, children, className }: FilterBarProps) {
  const active = filters.flatMap((f) => (values[f.id] ?? []).map((v) => ({ f, v, label: f.options.find((o) => o.value === v)?.label ?? v })));
  const set = (id: string, next: string[]) => onValuesChange?.({ ...values, [id]: next });

  return (
    <div data-slot="filter-bar" className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          size="sm"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          wrapperClassName="w-full sm:w-64"
          startSlot={<Search aria-hidden />}
          endSlot={
            search ? (
              <IconButton label="Clear search" variant="ghost" size="xs" onClick={() => onSearchChange("")}>
                <X aria-hidden />
              </IconButton>
            ) : undefined
          }
        />
        {filters.map((f) => {
          const sel = values[f.id] ?? [];
          return (
            <Popover key={f.id}>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" leadingIcon={<SlidersHorizontal aria-hidden />} aria-label={sel.length ? `${f.label}, ${sel.length} selected` : f.label}>
                  {f.label}
                  {sel.length > 0 && <CountBadge count={sel.length} tone="accent" size="sm" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2">
                <fieldset className="flex flex-col gap-1">
                  <legend className="px-2 pt-1 pb-2 text-overline text-fg-muted">{f.label}</legend>
                  {f.options.map((o) => (
                    <Checkbox
                      key={o.value}
                      label={o.label}
                      trailing={o.count !== undefined ? <span className="text-caption text-fg-muted figures">{o.count}</span> : undefined}
                      checked={sel.includes(o.value)}
                      onCheckedChange={(on) => set(f.id, on ? [...sel, o.value] : sel.filter((x) => x !== o.value))}
                      className="rounded-md px-2 py-1.5 hover:bg-highlight"
                    />
                  ))}
                </fieldset>
              </PopoverContent>
            </Popover>
          );
        })}
        {children}
      </div>
      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters" role="group">
          {active.map(({ f, v, label }) => (
            <Chip key={`${f.id}-${v}`} size="xs" variant="sunken" onRemove={() => set(f.id, (values[f.id] ?? []).filter((x) => x !== v))} removeLabel={`Remove ${f.label}: ${label}`}>
              {`${f.label}: ${label}`}
            </Chip>
          ))}
          <Button variant="ghost" size="sm" onClick={() => onValuesChange?.({})}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- DetailPanel */

export type DetailPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/**
 * Master–detail: an inline side panel next to the list from lg (the list stays usable), a sheet
 * below lg. Render it as a sibling of the list inside a flex row.
 */
export function DetailPanel({ open, onOpenChange, title, description, footer, children, className }: DetailPanelProps) {
  const wide = useMediaQuery("(min-width: 1024px)", true);
  if (!open) return null;
  if (!wide) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <SheetHeader title={title} description={description} />
          <SheetBody className="flex flex-col gap-5 pb-6">{children}</SheetBody>
          {footer && <div className="m-2 flex gap-2 rounded-lg bg-surface-sunken p-3">{footer}</div>}
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Card asChild variant="surface" padding="none" className={cn("sticky top-[calc(var(--nav-h)+1.5rem)] max-h-[calc(100dvh-var(--nav-h)-3rem)] w-96 shrink-0 overflow-hidden motion-safe:animate-fade-in", className)}>
      <aside aria-label={title}>
        <div className="flex items-start gap-3 border-b border-border-subtle p-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-title">{title}</h2>
            {description && <p className="text-caption text-fg-muted">{description}</p>}
          </div>
          <IconButton label="Close details" variant="sunken" size="sm" onClick={() => onOpenChange(false)}>
            <X aria-hidden />
          </IconButton>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex gap-2 border-t border-border-subtle p-4">{footer}</div>}
      </aside>
    </Card>
  );
}

/* ---------------------------------------------------------------- FormActionsBar */

export type FormActionsBarProps = {
  dirty: boolean;
  saving?: boolean;
  onDiscard: () => void;
  /** Submit is a real submit button: put the bar inside the <form>. */
  saveLabel?: string;
  className?: string;
};

/** Sticky unsaved-changes bar for settings and editors. Appears only when something changed. */
export function FormActionsBar({ dirty, saving = false, onDiscard, saveLabel = "Save changes", className }: FormActionsBarProps) {
  if (!dirty && !saving) return null;
  return (
    <div
      role="region"
      aria-label="Unsaved changes"
      className={cn("sticky bottom-4 z-(--z-sticky) flex flex-wrap items-center gap-3 rounded-2xl bg-surface-raised p-3 pl-5 shadow-popover motion-safe:animate-slide-up", className)}
    >
      <p className="flex-1 text-body" aria-live="polite">
        You have unsaved changes
      </p>
      <Button type="button" variant="ghost" onClick={onDiscard} disabled={saving}>
        Discard
      </Button>
      <Button type="submit" loading={saving}>
        {saveLabel}
      </Button>
    </div>
  );
}

/* ---------------------------------------------------------------- Confirm-able local state helper */

/**
 * Lives in `lib/form/use-draft` now, so `components/ui/*` and the rest of `lib/` can use it
 * too (neither may import from `components/admin/*`). Re-exported here so the original
 * import path keeps working.
 */
export { useDraft, type DraftOptions } from "@/lib/form/use-draft";
