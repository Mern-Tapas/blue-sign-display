import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Backpack, BadgeCheck, Check, Fullscreen, Monitor, RectangleVertical, ShieldCheck, Smartphone, Tablet, X } from "lucide-react";
import { SectionHeader } from "@/components/layout/section-header";
import { SeriesCard } from "@/components/store/series-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { iqWorldCapabilities, placements, series, signageComparison, WARRANTY, type Placement } from "@/lib/data/can-products";

const placementIcon: Record<Placement, React.ReactNode> = {
  floor: <RectangleVertical aria-hidden />,
  portable: <Backpack aria-hidden />,
  wall: <Monitor aria-hidden />,
  desk: <Tablet aria-hidden />,
};

const valueProps = [
  { icon: <Fullscreen aria-hidden />, title: "10.1″ to 65″", text: "HD, Full HD and 4K Ultra HD panels" },
  { icon: <ShieldCheck aria-hidden />, title: "IPS + toughened glass", text: "A+ grade panels, 178° viewing" },
  { icon: <Smartphone aria-hidden />, title: "Run it from IQ World", text: "Playlists and schedules, managed remotely" },
  { icon: <BadgeCheck aria-hidden />, title: WARRANTY, text: "On every CAN display" },
];

const featured = ["canvue", "can", "canmount", "canlit", "canwalk", "candesk-touch"]
  .map((slug) => series.find((s) => s.slug === slug)!)
  .filter(Boolean);

export default function HomePage() {
  return (
    <div className="container-ds flex flex-col gap-(--section-gap)">
      <div className="flex flex-col gap-4">
        <section aria-labelledby="hero-title" className="relative isolate overflow-hidden rounded-2xl bg-surface-contrast shadow-card">
          <Image
            src="/products/can/can-range-hero.webp"
            alt="The CAN range: pedestal, easel, totem, wall, backpack and desk displays"
            width={1600}
            height={896}
            preload
            sizes="(min-width: 1320px) 1272px, 100vw"
            className="h-[26rem] w-full object-cover object-bottom sm:h-[32rem] lg:h-[36rem]"
          />
          <div className="absolute inset-0 -z-0 bg-gradient-to-t from-[rgb(5_12_18/0.85)] via-[rgb(5_12_18/0.35)] to-transparent lg:bg-gradient-to-r" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 text-white sm:p-10 lg:top-0 lg:max-w-xl lg:justify-center">
            <Badge tone="solid">CAN digital signage</Badge>
            <h1 id="hero-title" className="text-display-lg sm:text-display-xl">
              Stands out in any space.
            </h1>
            <p className="max-w-md text-body-lg text-white/85">
              Floor, wall, desk or on your back: one range of IPS displays, all managed from the IQ World app.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
                <Link href="/products">Explore displays</Link>
              </Button>
              <Button asChild size="lg" variant="inverse">
                <Link href="/contact">Get a quote</Link>
              </Button>
            </div>
          </div>
        </section>

        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Why CAN">
          {valueProps.map((v) => (
            <li key={v.title}>
              <Card padding="sm" variant="outline" className="h-full flex-row items-center gap-3">
                <IconTile tone="accent">{v.icon}</IconTile>
                <div>
                  <p className="text-body-strong">{v.title}</p>
                  <p className="text-caption text-fg-muted">{v.text}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <section aria-label="Shop by placement">
        <SectionHeader title="Which CAN is" muted="right for you?" description="Different styles, for different spaces." href="/products" linkLabel="All displays" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {placements.map((p) => {
            const count = series.filter((s) => s.placement === p.value).length;
            return (
              <Card key={p.value} asChild interactive className="group">
                <Link href={`/products?placement=${p.value}`}>
                  <IconTile size="lg" tone="neutral" className="transition-colors duration-(--dur-fast) group-hover:bg-accent group-hover:text-fg-on-accent">
                    {placementIcon[p.value]}
                  </IconTile>
                  <div>
                    <h3 className="text-title">{p.label}</h3>
                    <p className="mt-1 text-body text-fg-muted">{p.description}</p>
                  </div>
                  <p className="mt-auto text-label text-accent-fg">
                    {count} series →
                  </p>
                </Link>
              </Card>
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

      <section aria-labelledby="iq-title">
        <Card variant="contrast" padding="lg" className="overflow-hidden lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-col items-start gap-4 lg:max-w-md">
            <Badge tone="solid">Included software</Badge>
            <h2 id="iq-title" className="text-heading-lg sm:text-display-lg">
              One app for every screen.
            </h2>
            <p className="text-body-lg text-fg-on-contrast-muted">
              IQ World is the centralized display control app: build playlists, schedule content and switch screens on or off
              from Android, Windows, macOS or the web.
            </p>
            <Button asChild variant="inverse" size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
              <Link href="/iq-world">Compare Basic and PRO</Link>
            </Button>
          </div>
          <ul className="grid flex-1 gap-2 sm:grid-cols-2" aria-label="IQ World capabilities">
            {iqWorldCapabilities.slice(0, 8).map((c) => (
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
          <Link href="/contact">Request a quote</Link>
        </Button>
      </section>
    </div>
  );
}
