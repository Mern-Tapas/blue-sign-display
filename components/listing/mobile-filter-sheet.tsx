"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive, Tabs as TabsPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { buildFacetSections } from "@/components/filters/facet-sections";
import { DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CountBadge } from "@/components/ui/count-badge";
import { cn } from "@/lib/cn";
import { countActiveFilters, emptyFilters, type Facets, type FilterState } from "@/lib/filters";
import { formatNumber } from "@/lib/format";

export type MobileFilterSheetProps = {
  /** Button that opens the sheet (rendered with asChild). */
  trigger: React.ReactElement;
  value: FilterState;
  /** Called only on Apply — changes are drafted inside the sheet. */
  onApply: (next: FilterState) => void;
  facets: Facets;
  categoryNames: Record<string, string>;
  priceBounds: { min: number; max: number };
  /** Live result count for the draft, shown on the Apply button. */
  countResults: (draft: FilterState) => number;
};

/**
 * Phone filters in the two-pane pattern shoppers know from Indian fashion apps: facet names on
 * the left with selection counts, values on the right, and "Show N results" that applies the
 * whole draft at once. Closing without applying discards the draft.
 */
export function MobileFilterSheet({ trigger, value, onApply, facets, categoryNames, priceBounds, countResults }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [tab, setTab] = useState("category");

  const set = (patch: Partial<FilterState>) => setDraft((d) => ({ ...d, ...patch, page: 1 }));
  const sections = buildFacetSections({ facets, categoryNames, priceBounds, value: draft, set });
  const results = countResults(draft);
  const active = countActiveFilters(draft);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        if (o) setDraft(value);
        setOpen(o);
      }}
    >
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="mobile-filter-sheet"
          className="fixed inset-x-0 bottom-0 z-(--z-modal) flex h-[min(100dvh,48rem)] flex-col rounded-t-2xl bg-surface text-fg shadow-modal outline-none data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
            <div className="flex items-baseline gap-2">
              <DialogPrimitive.Title className="text-heading-sm">Filters</DialogPrimitive.Title>
              {active > 0 && <span className="text-caption text-fg-muted figures">{active} applied</span>}
            </div>
            <DialogPrimitive.Description className="sr-only">Choose filters, then show results</DialogPrimitive.Description>
            <div className="flex items-center gap-1">
              {active > 0 && (
                <Button variant="link" size="sm" onClick={() => setDraft({ ...emptyFilters, sort: draft.sort, view: draft.view })}>
                  Clear all
                </Button>
              )}
              <DialogPrimitive.Close
                aria-label="Close filters"
                className="press state-layer hit-area relative flex size-control-sm items-center justify-center rounded-pill bg-surface-sunken text-fg-muted transition-[color,transform] duration-(--dur-fast) hover:text-fg"
              >
                <X aria-hidden className="size-icon-md" />
              </DialogPrimitive.Close>
            </div>
          </div>

          <TabsPrimitive.Root value={tab} onValueChange={setTab} orientation="vertical" className="flex min-h-0 flex-1">
            <TabsPrimitive.List aria-label="Filter groups" className="scrollbar-none flex w-36 shrink-0 flex-col overflow-y-auto bg-surface-sunken">
              {sections.map((s) => (
                <TabsPrimitive.Trigger
                  key={s.id}
                  value={s.id}
                  className={cn(
                    "relative flex min-h-row-lg items-center justify-between gap-2 px-4 text-left text-label text-fg-muted focus-ring-row",
                    "transition-colors duration-(--dur-fast) data-[state=active]:bg-surface data-[state=active]:text-fg",
                    "data-[state=active]:before:absolute data-[state=active]:before:inset-y-2 data-[state=active]:before:left-0 data-[state=active]:before:w-0.5 data-[state=active]:before:rounded-pill data-[state=active]:before:bg-accent",
                  )}
                >
                  {s.label}
                  {s.active > 0 && (
                    <span className="flex items-center">
                      <CountBadge count={s.active} tone="accent" size="sm" />
                      <span className="sr-only"> selected</span>
                    </span>
                  )}
                </TabsPrimitive.Trigger>
              ))}
            </TabsPrimitive.List>
            {sections.map((s) => (
              <TabsPrimitive.Content key={s.id} value={s.id} className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 outline-none">
                {s.content}
              </TabsPrimitive.Content>
            ))}
          </TabsPrimitive.Root>

          <div className="flex items-center gap-3 border-t border-border-subtle p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <DialogPrimitive.Close asChild>
              <Button variant="secondary" size="lg" className="flex-1">
                Cancel
              </Button>
            </DialogPrimitive.Close>
            <Button
              size="lg"
              className="flex-[2]"
              disabled={results === 0}
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
            >
              {results === 0 ? "No results" : `Show ${formatNumber(results)} ${results === 1 ? "result" : "results"}`}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
