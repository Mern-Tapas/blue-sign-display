import type { Metadata } from "next";
import { BadgeCheck, MessageSquare, Ruler, Smartphone } from "lucide-react";
import { QuoteForm } from "@/components/store/quote-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { WARRANTY } from "@/lib/data/can-products";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Tell us which CAN display you need and we'll reply with pricing and availability.",
};

const steps = [
  { icon: <MessageSquare aria-hidden />, title: "Share your requirement", text: "Model, quantity and where the screens will go." },
  { icon: <Ruler aria-hidden />, title: "We confirm the fit", text: "Size, placement and resolution for your space." },
  { icon: <Smartphone aria-hidden />, title: "Set up DisplayNode", text: "Design and schedule content for every screen from one dashboard." },
  { icon: <BadgeCheck aria-hidden />, title: WARRANTY, text: "Every CAN display is covered." },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const model = (await searchParams).model;
  const defaultModel = Array.isArray(model) ? model[0] : model;

  return (
    <div className="container-ds flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Request a quote" }]} />
        <div>
          <h1 className="text-display-lg">
            Request a quote<span className="text-fg-muted">, pricing on request</span>
          </h1>
          <p className="mt-2 max-w-2xl text-body-lg text-fg-muted">
            Tell us which display you need and how many. We&apos;ll come back with pricing and availability.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <QuoteForm defaultModel={defaultModel} />
        <Card variant="sunken" className="gap-5 lg:sticky lg:top-28">
          <h2 className="text-title">What happens next</h2>
          <ol className="flex flex-col gap-4">
            {steps.map((s) => (
              <li key={s.title} className="flex items-start gap-3">
                <IconTile size="sm" tone="accent">
                  {s.icon}
                </IconTile>
                <div>
                  <p className="text-body-strong">{s.title}</p>
                  <p className="text-caption text-fg-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
