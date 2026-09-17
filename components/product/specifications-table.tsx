"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DescriptionList } from "@/components/ui/description-list";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";

export type SpecGroup = { title: string; rows: [label: string, value: string][] };

export type SpecificationsTableProps = {
  groups: SpecGroup[];
  title?: string;
  /** Groups shown before "Show all specifications". */
  initialGroups?: number;
  className?: string;
};

/** Grouped key–value specifications with the long tail behind a disclosure. */
export function SpecificationsTable({ groups, title = "Specifications", initialGroups = 2, className }: SpecificationsTableProps) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? groups : groups.slice(0, initialGroups);
  const hasMore = groups.length > initialGroups;

  return (
    <section data-slot="specifications-table" aria-labelledby={`${id}-title`} className={cn("flex flex-col gap-4", className)}>
      <h2 id={`${id}-title`} className="text-title">
        {title}
      </h2>
      <div id={`${id}-groups`} className="flex flex-col gap-5">
        {shown.map((g) => (
          <div key={g.title} className="flex flex-col gap-2">
            <h3 className="text-label text-fg-muted">{g.title}</h3>
            <DescriptionList layout="table" size="sm" dividers items={g.rows.map(([term, description]) => ({ term, description, key: term }))} />
          </div>
        ))}
      </div>
      {hasMore && (
        <TextButton aria-expanded={expanded} aria-controls={`${id}-groups`} onClick={() => setExpanded((e) => !e)} className="self-start">
          {expanded ? "Show fewer specifications" : `Show all specifications (${groups.reduce((n, g) => n + g.rows.length, 0)})`}
          <ChevronDown aria-hidden className={cn("size-icon-sm transition-transform duration-(--dur-fast)", expanded && "rotate-180")} />
        </TextButton>
      )}
    </section>
  );
}
