"use client";

import { Check, Star, Truck } from "lucide-react";
import { isLightColor } from "@/components/commerce/swatch-group";
import { FacetSearchList } from "@/components/listing/facet-search-list";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import type { Facets, FilterState } from "@/lib/filters";
import { PriceRange } from "./price-range";

export type FacetSection = {
  id: string;
  label: string;
  /** Number of values selected in this facet (for badges and the mobile facet list). */
  active: number;
  content: React.ReactNode;
};

export type FacetSectionsInput = {
  facets: Facets;
  categoryNames: Record<string, string>;
  priceBounds: { min: number; max: number };
  value: FilterState;
  /** Receives a partial update; callers reset the page. */
  set: (patch: Partial<FilterState>) => void;
};

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

/**
 * One definition of every listing facet, rendered by both FilterSidebar (accordion) and
 * MobileFilterSheet (two-pane), so desktop and phone filters can never drift apart.
 */
export function buildFacetSections({ facets, categoryNames, priceBounds, value, set }: FacetSectionsInput): FacetSection[] {
  return [
    {
      id: "category",
      label: "Category",
      active: value.categories.length,
      content: (
        <div className="flex flex-col gap-3">
          {facets.categories.map((c) => (
            <Checkbox
              key={c.value}
              label={categoryNames[c.value] ?? c.value}
              trailing={c.count}
              checked={value.categories.includes(c.value)}
              onCheckedChange={() => set({ categories: toggle(value.categories, c.value) })}
            />
          ))}
        </div>
      ),
    },
    {
      id: "brand",
      label: "Brand",
      active: value.brands.length,
      content: (
        <FacetSearchList
          name="Brands"
          options={facets.brands.map((b) => ({ value: b.value, count: b.count }))}
          selected={value.brands}
          onToggle={(b) => set({ brands: toggle(value.brands, b) })}
          searchThreshold={5}
          visibleCount={5}
        />
      ),
    },
    {
      id: "price",
      label: "Price",
      active: value.price ? 1 : 0,
      content: <PriceRange min={priceBounds.min} max={priceBounds.max} value={value.price} onValueCommit={(price) => set({ price })} className="pt-2" />,
    },
    {
      id: "discount",
      label: "Discount",
      active: value.discount ? 1 : 0,
      content: (
        <RadioGroup aria-label="Minimum discount" value={value.discount ? String(value.discount) : "any"} onValueChange={(v) => set({ discount: v === "any" ? null : Number(v) })}>
          <Radio value="any" label="Any discount" />
          {facets.discounts.map((d) => (
            <Radio
              key={d.value}
              value={String(d.value)}
              disabled={d.count === 0}
              label={
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="figures">{d.value}% and above</span>
                  <span className="text-caption text-fg-muted figures">{d.count}</span>
                </span>
              }
            />
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "delivery",
      label: "Delivery time",
      active: value.delivery ? 1 : 0,
      content: (
        <RadioGroup aria-label="Delivery time" value={value.delivery ? String(value.delivery) : "any"} onValueChange={(v) => set({ delivery: v === "any" ? null : Number(v) })}>
          <Radio value="any" label="Any time" />
          {facets.delivery.map((d) => (
            <Radio
              key={d.days}
              value={String(d.days)}
              disabled={d.count === 0}
              label={
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    {d.days === 1 && <Truck aria-hidden className="size-icon-sm text-accent-fg" />}
                    {d.label}
                  </span>
                  <span className="text-caption text-fg-muted figures">{d.count}</span>
                </span>
              }
            />
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "color",
      label: "Color",
      active: value.colors.length,
      content: (
        <ul className="flex flex-wrap gap-2.5">
          {facets.colors.map((c) => {
            const on = value.colors.includes(c.name);
            return (
              <li key={c.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => set({ colors: toggle(value.colors, c.name) })}
                  className={cn(
                    "hit-area relative flex size-8 items-center justify-center rounded-pill ring-1 ring-border-strong ring-offset-2 ring-offset-surface transition-shadow duration-(--dur-fast)",
                    on && "ring-2 ring-fg",
                  )}
                  style={{ background: c.value }}
                >
                  {/* Check sits on the swatch's own colour, so it picks black or white by luminance */}
                  {on && <Check aria-hidden className={cn("size-icon-sm", isLightColor(c.value) ? "text-black" : "text-white")} strokeWidth={3} />}
                </button>
              </li>
            );
          })}
        </ul>
      ),
    },
    {
      id: "size",
      label: "Size",
      active: value.sizes.length,
      content: (
        <ul className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => {
            const on = value.sizes.includes(s);
            return (
              <li key={s}>
                <Chip selected={on} showCheck={false} onClick={() => set({ sizes: toggle(value.sizes, s) })} className="min-w-11 justify-center figures">
                  {s}
                </Chip>
              </li>
            );
          })}
        </ul>
      ),
    },
    {
      id: "rating",
      label: "Customer rating",
      active: value.rating ? 1 : 0,
      content: (
        <RadioGroup aria-label="Minimum rating" value={value.rating ? String(value.rating) : "any"} onValueChange={(v) => set({ rating: v === "any" ? null : Number(v) })}>
          <Radio value="any" label="Any rating" />
          {[4.5, 4, 3].map((r) => (
            <Radio
              key={r}
              value={String(r)}
              label={
                <span className="inline-flex items-center gap-1">
                  <Star aria-hidden className="size-icon-sm fill-rating text-rating" />
                  <span className="figures">{r}</span> & above
                </span>
              }
            />
          ))}
        </RadioGroup>
      ),
    },
    {
      id: "availability",
      label: "Availability",
      active: (value.inStock ? 1 : 0) + (value.sale ? 1 : 0),
      content: (
        <div className="flex flex-col gap-4">
          <Switch size="sm" label="In stock only" checked={value.inStock} onCheckedChange={(inStock) => set({ inStock })} />
          <Switch size="sm" label="On sale" checked={value.sale} onCheckedChange={(sale) => set({ sale })} />
        </div>
      ),
    },
  ];
}
