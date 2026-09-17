import { useEffect, useRef, useState } from "react";
import { Button, SortSheet, icons } from "@bluesigns/ui";

const { ArrowUpDown } = icons;
type SortKey = "featured" | "newest" | "rating" | "price-asc" | "price-desc";

// Preview only: the sheet keeps its open state internally, so click the trigger once.
function OpenOnMount({ initial, options }: { initial: SortKey; options?: { value: SortKey; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<SortKey>(initial);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
    // Drop the focus ring the sheet puts on its first control when it opens.
    const t = window.setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 300);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div ref={ref}>
      <SortSheet
        value={sort}
        onValueChange={setSort}
        options={options}
        trigger={
          <Button variant="secondary" leadingIcon={<ArrowUpDown aria-hidden />}>
            Sort
          </Button>
        }
      />
    </div>
  );
}

export const PriceLowToHigh = () => <OpenOnMount initial="price-asc" />;

export const Featured = () => <OpenOnMount initial="featured" />;

export const ShortList = () => (
  <OpenOnMount
    initial="rating"
    options={[
      { value: "featured", label: "Recommended" },
      { value: "rating", label: "Customer rating" },
      { value: "newest", label: "New arrivals" },
    ]}
  />
);
