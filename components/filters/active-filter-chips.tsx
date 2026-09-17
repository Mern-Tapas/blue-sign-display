"use client";

import { X } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";
import { deliveryOptions, emptyFilters, type FilterState } from "@/lib/filters";
import { formatPrice } from "@/lib/format";

export type ActiveFilterChipsProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  categoryNames?: Record<string, string>;
  className?: string;
};

type ActiveChip = { key: string; label: string; remove: () => FilterState };

export function ActiveFilterChips({ value, onChange, categoryNames = {}, className }: ActiveFilterChipsProps) {
  const without = (k: "categories" | "brands" | "colors" | "sizes", v: string): FilterState => ({
    ...value,
    [k]: value[k].filter((x) => x !== v),
    page: 1,
  });

  const chips: ActiveChip[] = [
    ...(value.q ? [{ key: "q", label: `“${value.q}”`, remove: () => ({ ...value, q: "", page: 1 }) }] : []),
    ...value.categories.map((c) => ({ key: `c-${c}`, label: categoryNames[c] ?? c, remove: () => without("categories", c) })),
    ...value.brands.map((b) => ({ key: `b-${b}`, label: b, remove: () => without("brands", b) })),
    ...value.colors.map((c) => ({ key: `co-${c}`, label: c, remove: () => without("colors", c) })),
    ...value.sizes.map((s) => ({ key: `s-${s}`, label: `Size ${s}`, remove: () => without("sizes", s) })),
    ...(value.price
      ? [{ key: "price", label: `${formatPrice(value.price[0])} – ${formatPrice(value.price[1])}`, remove: () => ({ ...value, price: null, page: 1 }) }]
      : []),
    ...(value.rating ? [{ key: "rating", label: `${value.rating}★ & up`, remove: () => ({ ...value, rating: null, page: 1 }) }] : []),
    ...(value.inStock ? [{ key: "stock", label: "In stock", remove: () => ({ ...value, inStock: false, page: 1 }) }] : []),
    ...(value.sale ? [{ key: "sale", label: "On sale", remove: () => ({ ...value, sale: false, page: 1 }) }] : []),
    ...(value.discount ? [{ key: "discount", label: `${value.discount}% off and above`, remove: () => ({ ...value, discount: null, page: 1 }) }] : []),
    ...(value.delivery
      ? [{ key: "delivery", label: deliveryOptions.find((o) => o.days === value.delivery)?.label ?? "Fast delivery", remove: () => ({ ...value, delivery: null, page: 1 }) }]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <ul data-slot="active-filter-chips" aria-label="Active filters" className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <li key={chip.key} className="animate-scale-in">
          <Chip onClick={() => onChange(chip.remove())} aria-label={`Remove filter ${chip.label}`} className="pr-2">
            {chip.label}
            <X aria-hidden className="text-fg-muted" />
          </Chip>
        </li>
      ))}
      <li>
        <TextButton onClick={() => onChange({ ...emptyFilters, sort: value.sort, view: value.view })} className="px-2">
          Clear all
        </TextButton>
      </li>
    </ul>
  );
}
