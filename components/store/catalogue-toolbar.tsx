"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ChipGroup } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const ALL = "all";

export type CatalogueToolbarProps = {
  categories: { slug: string; name: string; productCount: number }[];
  total: number;
  category: string | null;
  query: string;
};

function href(category: string | null, query: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query.trim()) params.set("q", query.trim());
  const qs = params.toString();
  return qs ? `/catalogue?${qs}` : "/catalogue";
}

/** Search box + category chips. Both live in the URL (?q=, ?category=) so results can be shared. */
export function CatalogueToolbar({ categories, total, category, query }: CatalogueToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(query);
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      startTransition(() => router.replace(href(category, value), { scroll: false }));
    }, 250);
    return () => window.clearTimeout(id);
    // Only typing schedules a search; category changes navigate directly below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="search"
        size="lg"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, specs or categories"
        aria-label="Search the catalogue"
        startSlot={<Search aria-hidden />}
        endSlot={pending ? <Spinner size="sm" /> : undefined}
        clearable
        onClear={() => setValue("")}
      />
      <ChipGroup
        type="single"
        aria-label="Filter by category"
        scroll
        showCheck={false}
        options={[
          { value: ALL, label: "All", count: total },
          ...categories.map((c) => ({ value: c.slug, label: c.name, count: c.productCount })),
        ]}
        value={category ?? ALL}
        onValueChange={(next) => {
          if (!next) return;
          startTransition(() => router.replace(href(next === ALL ? null : next, value), { scroll: false }));
        }}
      />
    </div>
  );
}
