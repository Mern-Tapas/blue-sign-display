import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FileText } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";
import { CatalogueCard } from "@/components/store/catalogue-card";
import { SeriesGallery } from "@/components/store/series-gallery";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import {
  catalogueProducts,
  getCatalogueCategory,
  getCatalogueProduct,
  productOverview,
  summarySpecs,
} from "@/lib/data/catalogue";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogueProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogue/[slug]">): Promise<Metadata> {
  const p = getCatalogueProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: productOverview(p).slice(0, 160) || p.name,
    openGraph: p.images[0] ? { images: [p.images[0]] } : undefined,
  };
}

export default async function CatalogueProductPage({ params }: PageProps<"/catalogue/[slug]">) {
  const p = getCatalogueProduct((await params).slug);
  if (!p) notFound();

  const category = getCatalogueCategory(p.category);
  const overview = productOverview(p);
  const related = catalogueProducts.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const summary = summarySpecs(p);
  const quoteHref = `/contact?model=${encodeURIComponent(p.title)}`;

  return (
    <div className="container-ds flex flex-col gap-(--section-gap)">
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Catalogue", href: "/catalogue" },
            ...(category ? [{ label: category.name, href: `/catalogue?category=${category.slug}` }] : []),
            { label: p.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {p.images.length > 0 ? (
            <SeriesGallery
              name={p.title}
              images={p.images.slice(0, 10).map((src, i) => ({ src, alt: `${p.title}, photo ${i + 1}`, width: 1200, height: 1200 }))}
            />
          ) : (
            <div className="aspect-square rounded-2xl bg-surface-sunken" />
          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {category && (
                <Link href={`/catalogue?category=${category.slug}`} className="text-label text-accent-fg hover:underline">
                  {category.name}
                </Link>
              )}
              <h1 className="text-heading-lg sm:text-display-lg">{p.title}</h1>
              {p.highlights.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
                  {p.highlights.map((h) => (
                    <li key={h}>
                      <Badge tone="neutral" size="lg">
                        {h}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              {overview && p.specs.length === 0 && <p className="text-body-lg text-fg-muted">{overview}</p>}
            </div>

            {summary.length > 0 && (
              <Card variant="sunken" padding="sm">
                <DescriptionList
                  size="sm"
                  dividers
                  items={summary.map((s, i) => ({ key: `${s.label}-${i}`, term: s.label, description: s.value }))}
                />
                {p.specs.length > summary.length && (
                  <a href="#specifications" className="text-label text-accent-fg hover:underline">
                    All {p.specs.length} specifications ↓
                  </a>
                )}
              </Card>
            )}

            <div className={p.brochure ? "grid gap-2 sm:grid-cols-2" : "grid"}>
              <Button asChild size="lg" fullWidth trailingIcon={<ArrowUpRight aria-hidden />}>
                <Link href={quoteHref}>Get a quote</Link>
              </Button>
              {p.brochure && (
                <Button asChild size="lg" variant="secondary" fullWidth leadingIcon={<FileText aria-hidden />}>
                  <a href={p.brochure} target="_blank" rel="noreferrer">
                    Download brochure
                  </a>
                </Button>
              )}
            </div>
            <p className="text-caption text-fg-muted">Pricing on request · GST and delivery terms below</p>
          </div>
        </div>
      </div>

      {(p.specs.length > 0 || p.terms.length > 0) && (
        <section id="specifications" aria-labelledby="specs-title" className="flex scroll-mt-28 flex-col gap-6">
          <h2 id="specs-title" className="text-heading-lg sm:text-display-lg">
            Specifications
          </h2>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
            {p.specs.length > 0 && (
              <Card>
                <DescriptionList
                  layout="table"
                  dividers
                  items={p.specs.map((s, i) => ({ key: `${s.label}-${i}`, term: s.label, description: s.value }))}
                />
              </Card>
            )}
            {p.terms.length > 0 && (
              <Card variant="sunken">
                <CardHeader title="Warranty, tax & delivery" />
                <DescriptionList
                  layout="stacked"
                  dividers
                  items={p.terms.map((s, i) => ({ key: `${s.label}-${i}`, term: s.label, description: s.value }))}
                />
              </Card>
            )}
          </div>
        </section>
      )}

      {p.videos.length > 0 && (
        <section aria-labelledby="videos-title" className="flex flex-col gap-6">
          <h2 id="videos-title" className="text-heading-lg sm:text-display-lg">
            See it <span className="text-fg-muted">in action</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {p.videos.map((src, i) => (
              <video
                key={src}
                src={src}
                controls
                preload="metadata"
                playsInline
                aria-label={`${p.title} video ${i + 1}`}
                className="aspect-video w-full rounded-2xl bg-surface-contrast shadow-card"
              />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && category && (
        <section aria-label="Related products">
          <SectionHeader title="More in" muted={category.name} href={`/catalogue?category=${category.slug}`} linkLabel="View all" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((x) => (
              <li key={x.slug}>
                <CatalogueCard product={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
