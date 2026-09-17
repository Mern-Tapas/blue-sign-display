import { useState } from "react";
import { ReviewToolbar, sampleData } from "@bluesigns/ui";

const { reviews } = sampleData;

type Filters = { sort: "helpful" | "recent" | "high" | "low"; stars: number[]; withMedia: boolean; verified: boolean };
const noFilters: Filters = { sort: "helpful", stars: [], withMedia: false, verified: false };

function Toolbar({ initial }: { initial: Filters }) {
  const [filters, setFilters] = useState(initial);
  return (
    <div style={{ maxWidth: 740 }}>
      <ReviewToolbar reviews={reviews} value={filters} onChange={setFilters} />
    </div>
  );
}

export const Default = () => <Toolbar initial={noFilters} />;

export const Filtered = () => <Toolbar initial={{ sort: "recent", stars: [5], withMedia: false, verified: true }} />;

export const WithPhotosOnly = () => <Toolbar initial={{ ...noFilters, sort: "high", withMedia: true }} />;
