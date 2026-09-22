import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Fullscreen, ShieldCheck, Smartphone, X } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";
import { HomeHero } from "@/components/store/home-hero";
import { SeriesCard } from "@/components/store/series-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { activeCategories, catalogueEntries } from "@/lib/data/catalogue";
import {
  DISPLAYNODE_NAME,
  DISPLAYNODE_URL,
  displayNodeFeatures,
  displayNodeHeadline,
  displayNodeTagline,
  placements,
  series,
  signageComparison,
  WARRANTY,
  type Placement,
} from "@/lib/data/can-products";

/** Photo and grid footprint for each placement tile (floor leads, then portable, wall, desk). */
const placementTiles: Record<Placement, { image: string; span: string }> = {
  floor: { image: "/products/can/canvue-finishes.webp", span: "sm:col-span-2 lg:row-span-2" },
  portable: { image: "/products/can/canwalk-views.webp", span: "sm:col-span-2" },
  wall: { image: "/products/can/cannx-range.webp", span: "" },
  desk: { image: "/products/can/candesk-touch.webp", span: "" },
};

const valueProps = [
  { icon: <Fullscreen aria-hidden />, title: "10.1″ to 65″", text: "HD, Full HD and 4K Ultra HD panels" },
  { icon: <ShieldCheck aria-hidden />, title: "IPS + toughened glass", text: "A+ grade panels, 178° viewing" },
  { icon: <Smartphone aria-hidden />, title: `Run it from ${DISPLAYNODE_NAME}`, text: "Schedule content remotely" },
  { icon: <BadgeCheck aria-hidden />, title: WARRANTY, text: "On every CAN display" },
];

const featured = ["canvue", "can", "canmount", "canlit", "canwalk", "candesk-touch"]
  .map((slug) => series.find((s) => s.slug === slug)!)
  .filter(Boolean);

export default function HomePage() {
  return (
    <div className="container-ds flex flex-col gap-(--section-gap)">
      <div className="flex flex-col gap-5">
        <HomeHero />

        <ul
          aria-label="Why CAN"
          className="grid gap-x-6 gap-y-5 px-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border-subtle lg:[&>li+li]:pl-6"
        >
          {valueProps.map((v) => (
            <li key={v.title} className="flex items-start gap-3">
              <span className="mt-0.5 text-accent-fg [&_svg]:size-icon-lg">{v.icon}</span>
              <div>
                <p className="text-body-strong">{v.title}</p>
                <p className="text-body text-fg-muted">{v.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section aria-label="Shop by placement">
        <SectionHeader title="Which CAN is" muted="right for you?" description="Different styles, for different spaces." href="/products" linkLabel="All displays" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(0,17rem))]">
          {placements.map((p, i) => {
            const count = series.filter((s) => s.placement === p.value).length;
            const tile = placementTiles[p.value];
            const feature = i === 0;
            return (
              <Link
                key={p.value}
                href={`/products?placement=${p.value}`}
                className={cn(
                  "group lift relative flex min-h-64 flex-col overflow-hidden rounded-2xl bg-surface shadow-card outline-offset-4 active:scale-[0.99] active:duration-(--dur-instant)",
                  tile.span,
                )}
              >
                <div className="relative m-1.5 mb-0 min-h-40 flex-1 overflow-hidden rounded-xl bg-white">
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-contain p-4 transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 px-5 pt-3.5 pb-4">
                  <div className="min-w-0">
                    <h3 className={feature ? "text-heading-sm" : "text-title"}>{p.label}</h3>
                    {(feature || i === 1) && <p className="mt-0.5 max-w-sm text-body text-fg-muted">{p.description}</p>}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-label text-accent-fg">
                    {count} series
                    <ArrowRight aria-hidden className="size-icon-sm transition-transform duration-(--dur-base) ease-(--ease-out) group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label="Popular series">
        <SectionHeader title="Popular" muted="series" href="/products" linkLabel="Compare all" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <SeriesCard key={s.slug} series={s} preload={i < 3} />
          ))}
        </div>
      </section>

      <section aria-label="Product catalogue">
        <SectionHeader
          title="Beyond signage,"
          muted="the full catalogue"
          description={`${catalogueEntries.length} products: kiosks, touch displays, POS, mini PCs, refurbished computing and software.`}
          href="/catalogue"
          linkLabel="Browse catalogue"
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {activeCategories.slice(0, 12).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catalogue?category=${c.slug}`}
                className="group lift flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card outline-offset-4 active:scale-[0.99] active:duration-(--dur-instant)"
              >
                <span className="relative m-1.5 mb-0 block aspect-square overflow-hidden rounded-xl bg-white">
                  {c.image && (
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                      className="object-contain p-2 transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    />
                  )}
                </span>
                <span className="flex flex-col px-3.5 pt-3 pb-3.5">
                  <span className="text-body-strong">{c.name}</span>
                  <span className="text-caption text-fg-muted figures">{c.productCount} products</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="why-digital" aria-labelledby="why-title" className="scroll-mt-28">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          <div className="flex flex-col gap-4 lg:sticky lg:top-28">
            <h2 id="why-title" className="text-heading-lg sm:text-display-lg">
              Why <span className="text-fg-muted">CAN?</span>
            </h2>
            <p className="text-body-lg text-fg-muted">
              Digital signage beats traditional signage on exposure. Update your message quickly and remotely, so it is always
              relevant and up to date.
            </p>
            <Card variant="accent" padding="md" className="gap-2">
              <p className="text-title">Better customer experiences</p>
              <p className="text-body text-fg-on-accent-muted">
                That&apos;s the conclusion of the comparison: CAN digital signage offers better customer experiences.
              </p>
            </Card>
          </div>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consider</TableHead>
                  <TableHead>Digital</TableHead>
                  <TableHead>Traditional</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signageComparison.map((row) => (
                  <TableRow key={row.question}>
                    <TableCell className="text-fg">{row.question}</TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1.5", row.digitalWins ? "text-success-fg" : "text-fg-muted")}>
                        {row.digitalWins ? <Check aria-hidden className="size-icon-md" /> : <X aria-hidden className="size-icon-md" />}
                        {row.digital}
                      </span>
                    </TableCell>
                    <TableCell className="text-fg-muted">{row.traditional}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>

      <section aria-labelledby="displaynode-title">
        <Card variant="contrast" padding="lg" className="overflow-hidden lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-col items-start gap-4 lg:max-w-md">
            <h2 id="displaynode-title" className="text-heading-lg sm:text-display-lg">
              {displayNodeHeadline}
            </h2>
            <p className="text-body-lg text-fg-on-contrast-muted">{displayNodeTagline}</p>
            <Button asChild variant="inverse" size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
              <a href={DISPLAYNODE_URL} target="_blank" rel="noopener noreferrer">
                Visit {DISPLAYNODE_NAME}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </div>
          <ul className="grid flex-1 gap-2 sm:grid-cols-2" aria-label={`${DISPLAYNODE_NAME} features`}>
            {displayNodeFeatures.map((c) => (
              <li key={c} className="flex items-center gap-3 rounded-lg bg-tile-on-color px-4 py-3 text-body">
                <Check aria-hidden className="size-icon-md shrink-0 text-fg-on-contrast" />
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="cta-title" className="flex flex-col items-center gap-4 py-4 text-center">
        <h2 id="cta-title" className="max-w-2xl text-heading-lg sm:text-display-lg">
          Tell us about your space. <span className="text-fg-muted">We&apos;ll match the right CAN.</span>
        </h2>
        <p className="max-w-xl text-body-lg text-fg-muted">
          Share the size, placement and quantity you need, and we&apos;ll come back with pricing and availability.
        </p>
        <Button asChild size="xl" trailingIcon={<ArrowUpRight aria-hidden />}>
          <Link href="/contact">Get a quote</Link>
        </Button>
      </section>
    </div>
  );
}
