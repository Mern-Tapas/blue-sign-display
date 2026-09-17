"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DescriptionList, type DescriptionItem } from "@/components/ui/description-list";
import { Inset } from "@/components/ui/inset";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import type { Model } from "@/lib/data/can-products";

function modelFacts(m: Model): DescriptionItem[] {
  const items: DescriptionItem[] = [{ term: "Screen size", description: `${m.size}″` }];
  if (m.pixels) items.push({ term: "Resolution", description: `${m.pixels} px` });
  if (m.brightness) items.push({ term: "Brightness", description: `${m.brightness} nits` });
  if (m.note) items.push({ term: "Note", description: m.note });
  if (m.dimensions) items.push({ term: "Dimensions (W × H × D)", description: m.dimensions });
  if (m.netWeight) items.push({ term: "Net weight", description: m.netWeight });
  if (m.grossWeight) items.push({ term: "Gross weight", description: m.grossWeight });
  return items;
}

/** Pick a size; the facts for that model and a quote link follow the choice. */
export function ModelPicker({ models, specsOnRequest }: { models: Model[]; specsOnRequest?: boolean }) {
  const [selected, setSelected] = useState(models[0]!.name);
  const model = models.find((m) => m.name === selected) ?? models[0]!;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <p id="model-label" className="text-label">
          {models.length === 1 ? "Model" : `Choose a model (${models.length})`}
        </p>
      </div>
      <RadioCardGroup
        aria-labelledby="model-label"
        value={selected}
        onValueChange={setSelected}
        className="grid gap-2 sm:grid-cols-2"
      >
        {models.map((m) => (
          <RadioCard
            key={m.name}
            value={m.name}
            size="sm"
            title={m.name}
            description={[m.pixels && `${m.pixels} px`, m.brightness && `${m.brightness} nits`].filter(Boolean).join(" · ") || "Specifications on request"}
            aside={`${m.size}″`}
          />
        ))}
      </RadioCardGroup>

      <Inset size="md" aria-live="polite">
        {specsOnRequest ? (
          <p className="text-body text-fg-muted">
            {model.name} is listed in the CAN range guide. Ask us for its full specifications and availability.
          </p>
        ) : (
          <DescriptionList items={modelFacts(model)} dividers size="sm" />
        )}
      </Inset>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild size="lg" fullWidth trailingIcon={<ArrowUpRight aria-hidden />}>
          <Link href={`/contact?model=${encodeURIComponent(model.name)}`}>Get a quote for {model.name}</Link>
        </Button>
      </div>
    </div>
  );
}
