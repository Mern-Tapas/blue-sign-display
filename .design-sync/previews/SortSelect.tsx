import { useState } from "react";
import { SortSelect } from "@bluesigns/ui";

type SortKey = "featured" | "newest" | "rating" | "price-asc" | "price-desc";

export const Default = () => {
  const [sort, setSort] = useState<SortKey>("featured");
  return <SortSelect value={sort} onValueChange={setSort} />;
};

export const Variants = () => {
  const [a, setA] = useState<SortKey>("price-asc");
  const [b, setB] = useState<SortKey>("rating");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SortSelect value={a} onValueChange={setA} variant="sunken" />
      <SortSelect value={b} onValueChange={setB} size="md" />
    </div>
  );
};

export const Disabled = () => <SortSelect value="newest" onValueChange={() => {}} disabled />;
