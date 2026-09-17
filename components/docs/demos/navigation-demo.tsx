"use client";

import { useState } from "react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pagination } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsDemo() {
  return (
    <DsGrid>
      <DsPreview label="Pill tabs" className="flex-col items-stretch">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews" count={1284}>
              Reviews
            </TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="text-body text-fg-muted">
            Adaptive noise cancelling, 40-hour battery and memory-foam cushions.
          </TabsContent>
          <TabsContent value="reviews" className="text-body text-fg-muted">
            4.7 average from 1,284 verified buyers.
          </TabsContent>
          <TabsContent value="shipping" className="text-body text-fg-muted">
            Free delivery above ₹499. Express delivery available at checkout.
          </TabsContent>
        </Tabs>
      </DsPreview>
      <DsPreview label="Underline tabs" className="flex-col items-stretch">
        <Tabs defaultValue="all">
          <TabsList variant="underline">
            <TabsTrigger value="all">All orders</TabsTrigger>
            <TabsTrigger value="open" count={2}>
              Open
            </TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="text-body text-fg-muted">
            All orders from the last 12 months.
          </TabsContent>
          <TabsContent value="open" className="text-body text-fg-muted">
            Orders being processed or shipped.
          </TabsContent>
          <TabsContent value="returns" className="text-body text-fg-muted">
            No returns in progress.
          </TabsContent>
        </Tabs>
      </DsPreview>
    </DsGrid>
  );
}

const faqs = [
  ["What is your return policy?", "Return any unworn item within 30 days for a full refund. Return shipping is free in the US."],
  ["How long does shipping take?", "Standard shipping takes 4–6 business days; express arrives in 1–2."],
  ["Do you ship internationally?", "We ship to 42 countries. Duties are calculated at checkout."],
];

export function AccordionDemo() {
  return (
    <DsGrid>
      <DsPreview label="Plain accordion" className="flex-col items-stretch">
        <Accordion type="single" collapsible defaultValue="q0">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={`q${i}`}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DsPreview>
      <DsPreview label="Card accordion, several open" className="flex-col items-stretch">
        <Accordion type="multiple" variant="cards" defaultValue={["q1"]}>
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={`q${i}`}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DsPreview>
    </DsGrid>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(4);
  const pageCount = 12;
  return (
    <DsPreview label="Pagination" className="flex-col items-stretch">
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        summary={
          <>
            Showing <span className="text-fg figures">{(page - 1) * 12 + 1}–{page * 12}</span> of{" "}
            <span className="text-fg figures">{pageCount * 12}</span> products
          </>
        }
      />
      <Pagination page={1} pageCount={3} onPageChange={() => {}} className="sm:justify-center" />
    </DsPreview>
  );
}
