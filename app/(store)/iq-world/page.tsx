import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { iqWorldCapabilities, iqWorldPlans, iqWorldPlatforms } from "@/lib/data/can-products";

export const metadata: Metadata = {
  title: "IQ World display control app",
  description: "IQ World is the centralized display screen control app for CAN signage. Compare the Basic and PRO plans.",
};

function Mark({ on, label }: { on: boolean; label: string }) {
  return on ? (
    <Check aria-label={`Included in ${label}`} className="size-icon-base text-success-fg" />
  ) : (
    <Minus aria-label={`Not in ${label}`} className="size-icon-base text-fg-subtle" />
  );
}

export default function IqWorldPage() {
  return (
    <div className="container-ds flex flex-col gap-(--section-gap)">
      <div className="flex flex-col gap-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IQ World" }]} />
        <Card variant="contrast" padding="lg" className="items-start gap-5 sm:p-12">
          <Badge tone="solid">IQ World · India ka IQ</Badge>
          <h1 className="max-w-3xl text-display-lg sm:text-display-xl">Centralized display screen control app.</h1>
          <p className="max-w-2xl text-body-lg text-fg-on-contrast-muted">
            With IQ World, controlling your CAN is even more powerful. Access information in all-new ways, boost daily
            performance and discover even more ways to personalise your screens. Manage with your choice of plans.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Available on">
            {iqWorldPlatforms.map((p) => (
              <li key={p} className="rounded-pill bg-tile-on-color px-3 py-1.5 text-label">
                {p}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section aria-labelledby="capabilities-title" className="flex flex-col gap-6">
        <h2 id="capabilities-title" className="text-heading-lg sm:text-display-lg">
          What you can do <span className="text-fg-muted">from one app</span>
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {iqWorldCapabilities.map((c) => (
            <li key={c}>
              <Card padding="sm" variant="outline" className="h-full flex-row items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-accent-soft text-accent-soft-fg">
                  <Check aria-hidden className="size-icon-md" />
                </span>
                <span className="text-body-strong">{c}</span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="plans-title" className="flex flex-col gap-6">
        <div>
          <h2 id="plans-title" className="text-heading-lg sm:text-display-lg">
            Basic <span className="text-fg-muted">or</span> PRO
          </h2>
          <p className="mt-2 max-w-xl text-body-lg text-fg-muted">
            Both plans cover content, schedules and devices. PRO adds analytics, split screens and the IQ Editor.
          </p>
        </div>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>List of features</TableHead>
                <TableHead className="w-28 text-center">Basic</TableHead>
                <TableHead className="w-28 text-center">
                  <Badge tone="solid" size="sm">
                    PRO
                  </Badge>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iqWorldPlans.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="text-fg">{row.feature}</TableCell>
                  <TableCell>
                    <span className="flex justify-center">
                      <Mark on={row.basic} label="Basic" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex justify-center">
                      <Mark on={row.pro} label="PRO" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <Card padding="lg" className="items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-heading-md">Not sure which plan fits?</h2>
          <p className="mt-1 text-body text-fg-muted">Tell us how many screens you run and we&apos;ll recommend Basic or PRO.</p>
        </div>
        <Button asChild size="lg" trailingIcon={<ArrowUpRight aria-hidden />}>
          <Link href="/contact">Talk to us</Link>
        </Button>
      </Card>
    </div>
  );
}
