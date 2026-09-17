"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { ChipGroup } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import type { Faq } from "@/lib/data/support";

export type FaqListProps = {
  faqs: Faq[];
  categories: { id: string; label: string }[];
  /** Shown when a search finds nothing, e.g. a link to the contact form. */
  noResultsAction?: React.ReactNode;
  /** Initial topic, e.g. from ?topic=returns. */
  defaultCategory?: string;
  className?: string;
};

function matches(f: Faq, words: string[]) {
  const text = `${f.question} ${f.answer}`.toLowerCase();
  return words.every((w) => text.includes(w));
}

/**
 * Help-center questions: search across questions and answers, narrow by topic chips, and read
 * answers in an accordion. Searching ignores the topic so an answer is never hidden behind the
 * wrong chip.
 */
export function FaqList({ faqs, categories, noResultsAction, defaultCategory, className }: FaqListProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(defaultCategory && categories.some((c) => c.id === defaultCategory) ? defaultCategory : "all");
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  const results = faqs.filter((f) => (searching ? matches(f, words) : category === "all" || f.category === category));
  const sections = categories
    .map((c) => ({ ...c, items: results.filter((f) => f.category === c.id) }))
    .filter((c) => c.items.length > 0);

  return (
    <section data-slot="faq-list" aria-label="Frequently asked questions" className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-3">
        <Input
          type="search"
          size="lg"
          aria-label="Search help articles"
          placeholder="Search for ‘refund’, ‘COD’, ‘OTP’…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          startSlot={<Search aria-hidden className="size-icon-md text-fg-muted" />}
          endSlot={
            query ? (
              <IconButton label="Clear search" variant="ghost" size="xs" onClick={() => setQuery("")}>
                <X aria-hidden />
              </IconButton>
            ) : undefined
          }
        />
        {searching ? (
          <p role="status" className="text-body text-fg-muted">
            {results.length === 0 ? "No answers found" : `${results.length} ${results.length === 1 ? "answer" : "answers"} for “${query.trim()}”`}
          </p>
        ) : (
          <ChipGroup
            type="single"
            aria-label="Help topics"
            scroll
            showCheck={false}
            value={category}
            onValueChange={(v) => setCategory(v || "all")}
            options={[{ value: "all", label: "All topics" }, ...categories.map((c) => ({ value: c.id, label: c.label }))]}
          />
        )}
      </div>

      {sections.length === 0 ? (
        <EmptyState
          compact
          icon={<Search aria-hidden />}
          title="We couldn’t find an answer"
          description="Try fewer or different words, or ask us directly. We reply within a few hours."
          action={
            <>
              <Button variant="secondary" onClick={() => setQuery("")}>
                Clear search
              </Button>
              {noResultsAction}
            </>
          }
          className={cardVariants({ variant: "outline", padding: "none" })}
        />
      ) : (
        sections.map((s) => (
          <div key={s.id} className="flex flex-col gap-2">
            <h3 className="text-title">{s.label}</h3>
            <Accordion type="single" collapsible variant="cards">
              {s.items.map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger>{f.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="max-w-prose">{f.answer}</p>
                    {f.href && (
                      <TextLink href={f.href.url} size="md" className="mt-2">
                        {f.href.label}
                      </TextLink>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))
      )}
    </section>
  );
}
