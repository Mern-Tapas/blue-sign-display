import type { Metadata } from "next";
import Link from "next/link";
import { PlacementFilter } from "@/components/store/placement-filter";
import { SeriesCard } from "@/components/store/series-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Inset } from "@/components/ui/inset";
import { moreModels, placements, series, type Placement } from "@/lib/data/can-products";

export const metadata: Metadata = {
  title: "Digital signage displays",
  description: "Every CAN display: floor-standing, portable, wall-mounted and desk signage from 10.1″ to 65″.",
};

function parsePlacement(value: string | string[] | undefined): Placement | null {
  const v = Array.isArray(value) ? value[0] : value;
  return placements.some((p) => p.value === v) ? (v as Placement) : null;
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const placement = parsePlacement((await searchParams).placement);
  const current = placements.find((p) => p.value === placement);
  const results = placement ? series.filter((s) => s.placement === placement) : series;
  const modelCount = results.reduce((n, s) => n + s.models.length, 0);

  return (
    <div className="container-ds flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Displays", href: current ? "/products" : undefined }, ...(current ? [{ label: current.label }] : [])]} />
        <div className="flex flex-col gap-2">
          <h1 className="text-display-lg">
            {current ? current.label : "All displays"}
            <span className="text-fg-muted"> by CAN</span>
          </h1>
          <p className="max-w-2xl text-body-lg text-fg-muted">
            {current
              ? current.description
              : "Different styles for different spaces. Every display runs the IQ World app and comes with a 1 year warranty."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <PlacementFilter value={placement} />
        <p className="text-body text-fg-muted" aria-live="polite">
          {results.length} series · {modelCount} models
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s, i) => (
          <SeriesCard key={s.slug} series={s} preload={i < 3} />
        ))}
      </div>

      {(!placement || placement === "desk") && (
        <Inset className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body">
            Also in the range: <span className="text-body-strong">{moreModels.join(" and ")}</span>.
          </p>
          <Link href="/contact" className="text-label text-accent-fg hover:underline">
            Ask about these models →
          </Link>
        </Inset>
      )}
    </div>
  );
}
