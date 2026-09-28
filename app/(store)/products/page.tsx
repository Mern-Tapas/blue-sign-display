import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlacementFilter } from "@/components/store/placement-filter";
import { SeriesCard } from "@/components/store/series-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Inset } from "@/components/ui/inset";
import { moreModels, placements, series, type Placement } from "@/lib/data/displays";

export const metadata: Metadata = {
  title: "Digital signage displays",
  description: "Every display: floor-standing, portable, wall-mounted and desk signage from 10.1″ to 65″.",
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
            
          </h1>
          <p className="max-w-2xl text-body-lg text-fg-muted">
            {current
              ? current.description
              : "Different styles for different spaces. Manage every screen with DisplayNode; every display comes with a 1 year warranty."}
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
          {/* Lucide icon, not a literal "→": a glyph is read aloud, ignores the icon scale and
              can't animate with the rest. min-h-row-sm carries the target; hit-area tops it up. */}
          <Link
            href="/contact"
            className="group hit-area relative inline-flex min-h-row-sm items-center gap-1.5 self-start text-label text-accent-fg hover:underline sm:self-auto"
          >
            Ask about these models
            <ArrowRight
              aria-hidden
              className="size-icon-sm transition-transform duration-(--dur-base) ease-(--ease-out) group-hover:translate-x-0.5"
            />
          </Link>
        </Inset>
      )}
    </div>
  );
}
