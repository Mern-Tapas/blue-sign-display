import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from "@bluesigns/ui";

const faqs = [
  ["What is the return policy?", "Return unused items within 14 days of delivery for a full refund. Pickup is free across Bengaluru, Mumbai and Delhi NCR."],
  ["When will my order arrive?", "Standard delivery takes 3–5 days. Express delivery (₹99) reaches most metro pincodes the next day."],
  ["Is cash on delivery available?", "Yes, on orders up to ₹10,000. A ₹19 handling fee applies; UPI on delivery is free."],
];

export const Default = () => (
  <div style={{ maxWidth: 560 }}>
    <Accordion type="single" collapsible defaultValue="q0">
      {faqs.map(([q, a], i) => (
        <AccordionItem key={q} value={"q" + i}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export const WithTrailing = () => (
  <div style={{ maxWidth: 560 }}>
    <Accordion type="single" collapsible defaultValue="specs">
      <AccordionItem value="specs">
        <AccordionTrigger trailing={<Badge size="sm">4</Badge>}>Specifications</AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-1">
            <li>Adaptive noise cancelling</li>
            <li>40-hour battery, USB-C fast charge</li>
            <li>Bluetooth 5.3 multipoint</li>
            <li>Weight 254 g</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="offers">
        <AccordionTrigger trailing={<Badge tone="success" size="sm">3 offers</Badge>}>Bank offers</AccordionTrigger>
        <AccordionContent>10% instant discount on HDFC Bank credit cards, up to ₹1,500.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="warranty" disabled>
        <AccordionTrigger>Extended warranty (not available for this item)</AccordionTrigger>
        <AccordionContent>—</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const InCards = () => (
  <div style={{ maxWidth: 560 }}>
    <Accordion type="multiple" variant="cards" defaultValue={["q0", "q2"]}>
      {faqs.map(([q, a], i) => (
        <AccordionItem key={q} value={"q" + i}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
