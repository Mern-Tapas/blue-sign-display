"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CountBadge } from "@/components/ui/count-badge";
import { cn } from "@/lib/cn";
import { countActiveFilters, emptyFilters, type Facets, type FilterState } from "@/lib/filters";
import { buildFacetSections } from "./facet-sections";

export type FilterSidebarProps = {
  facets: Facets;
  categoryNames: Record<string, string>;
  priceBounds: { min: number; max: number };
  value: FilterState;
  onChange: (next: FilterState) => void;
  /** Hide the header row (e.g. when rendered inside a Sheet with its own title). */
  hideHeader?: boolean;
  /** Sections expanded initially. */
  defaultOpen?: string[];
  className?: string;
};

function Count({ n }: { n: number }) {
  return n > 0 ? (
    <span className="flex items-center">
      <CountBadge count={n} tone="accent" />
      <span className="sr-only"> selected</span>
    </span>
  ) : null;
}

/** Desktop facet column: every facet from buildFacetSections in an accordion, with a Clear all. */
export function FilterSidebar({
  facets,
  categoryNames,
  priceBounds,
  value,
  onChange,
  hideHeader,
  defaultOpen = ["category", "brand", "price", "discount", "delivery"],
  className,
}: FilterSidebarProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch, page: 1 });
  const active = countActiveFilters(value);
  const sections = buildFacetSections({ facets, categoryNames, priceBounds, value, set });

  return (
    <div data-slot="filter-sidebar" className={cn("flex flex-col", className)}>
      {!hideHeader && (
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-heading-sm">
            Filters <Count n={active} />
          </p>
          {active > 0 && (
            <Button variant="link" size="sm" onClick={() => onChange({ ...emptyFilters, sort: value.sort, view: value.view })}>
              Clear all
            </Button>
          )}
        </div>
      )}

      <Accordion type="multiple" defaultValue={defaultOpen}>
        {sections.map((s) => (
          <AccordionItem key={s.id} value={s.id}>
            <AccordionTrigger trailing={<Count n={s.active} />}>{s.label}</AccordionTrigger>
            <AccordionContent>{s.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
