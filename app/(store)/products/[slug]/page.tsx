import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppWindow, Check } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";
import { ModelPicker } from "@/components/store/model-picker";
import { SeriesCard } from "@/components/store/series-card";
import { SeriesGallery } from "@/components/store/series-gallery";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSeries, placementLabel, placements, series, WARRANTY } from "@/lib/data/can-products";

export const dynamicParams = false;

export function generateStaticParams() {
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const s = getSeries((await params).slug);
  if (!s) return {};
  return { title: `${s.name}: ${s.headline.replace(/\.$/, "")}`, description: s.summary };
}

export default async function SeriesPage({ params }: PageProps<"/products/[slug]">) {
  const s = getSeries((await params).slug);
  if (!s) notFound();

  const placement = placements.find((p) => p.value === s.placement)!;
  const related = series.filter((x) => x.slug !== s.slug && x.placement === s.placement).slice(0, 3);
  const others = related.length ? related : series.filter((x) => x.slug !== s.slug).slice(0, 3);
  const hasDetails = s.models.some((m) => m.dimensions);

  return (
    <div className="container-ds flex flex-col gap-(--section-gap)">
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Displays", href: "/products" },
            { label: placement.label, href: `/products?placement=${placement.value}` },
            { label: s.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <SeriesGallery images={s.images} name={s.name} />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {/* The separator is bound to the name with a non-breaking space so it can never
                  orphan onto the start of a wrapped line, and the size steps like the catalogue
                  detail h1 so a long name does not run to three lines on a phone. */}
              <h1 className="text-heading-lg text-balance sm:text-display-lg">
                {s.name}
                <span className="text-fg-muted">
                  {" · "}
                  {s.headline}
                </span>
              </h1>
              <p className="text-body-lg text-fg-muted">{s.summary}</p>
              <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
                <li>
                  <Badge tone="accent">{placementLabel(s.placement)}</Badge>
                </li>
                {s.resolutions.map((r) => (
                  <li key={r}>
                    <Badge tone={r === "4K Ultra HD" ? "solid" : "neutral"}>{r}</Badge>
                  </li>
                ))}
                {s.highlights.map((h) => (
                  <li key={h}>
                    <Badge tone="outline">{h}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <ModelPicker models={s.models} specsOnRequest={s.specsOnRequest} />

            <p className="flex items-center gap-2 text-caption text-fg-muted">
              <Check aria-hidden className="size-icon-sm text-success-fg" />
              {WARRANTY} · Pricing on request
            </p>
          </div>
        </div>
      </div>

      {!s.specsOnRequest && (
        <section aria-labelledby="specs-title" className="flex flex-col gap-6">
          <h2 id="specs-title" className="text-heading-lg sm:text-display-lg">
            Specifications <span className="text-fg-muted">for every {s.name}</span>
          </h2>

          {hasDetails && s.models.length > 1 && (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Brightness</TableHead>
                    <TableHead>W × H × D</TableHead>
                    <TableHead>Net / gross weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.models.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell className="whitespace-nowrap text-body-strong text-fg">
                        {m.name}
                        {m.note && <span className="block text-caption font-normal text-fg-muted">{m.note}</span>}
                      </TableCell>
                      <TableCell className="figures">{m.size}″</TableCell>
                      <TableCell className="whitespace-nowrap figures">{m.pixels}</TableCell>
                      <TableCell className="whitespace-nowrap figures">{m.brightness ? `${m.brightness} nits` : "-"}</TableCell>
                      <TableCell className="figures">{m.dimensions}</TableCell>
                      <TableCell className="whitespace-nowrap figures">
                        {m.netWeight} / {m.grossWeight}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {s.specs.map((group) => (
              <Card key={group.title}>
                <CardHeader title={group.title} />
                <DescriptionList layout="rows" dividers items={group.rows.map((r) => ({ term: r.label, description: r.value }))} />
              </Card>
            ))}
            <Card>
              <CardHeader title="Software & features" />
              {s.apps.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Apps">
                  {s.apps.map((a) => (
                    <li key={a}>
                      <Badge tone="neutral" className="gap-1">
                        <AppWindow aria-hidden className="size-icon-sm" />
                        {a}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              <ul className="flex flex-col gap-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-body">
                    <Check aria-hidden className="mt-0.5 size-icon-md shrink-0 text-accent-fg" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>
      )}

      <section aria-label="Related displays">
        <SectionHeader
          title={related.length ? `More ${placement.label.toLowerCase()}` : "More"}
          muted="displays"
          href={`/products?placement=${placement.value}`}
          linkLabel="View all"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((x) => (
            <SeriesCard key={x.slug} series={x} />
          ))}
        </div>
      </section>
    </div>
  );
}
