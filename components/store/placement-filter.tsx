"use client";

import { useRouter } from "next/navigation";
import { ChipGroup } from "@/components/ui/chip";
import { placements, series, type Placement } from "@/lib/data/can-products";

const ALL = "all";

const options = [
  { value: ALL, label: "All displays", count: series.length },
  ...placements.map((p) => ({ value: p.value, label: p.label, count: series.filter((s) => s.placement === p.value).length })),
];

/** Single-choice placement chips; the choice lives in the URL (?placement=) so results are shareable. */
export function PlacementFilter({ value }: { value: Placement | null }) {
  const router = useRouter();
  return (
    <ChipGroup
      type="single"
      aria-label="Filter by placement"
      scroll
      showCheck={false}
      options={options}
      value={value ?? ALL}
      onValueChange={(next) => {
        if (!next) return;
        router.replace(next === ALL ? "/products" : `/products?placement=${next}`, { scroll: false });
      }}
    />
  );
}
