import { Field, Textarea } from "@bluesigns/ui";

export const OrderNote = () => (
  <div style={{ maxWidth: 400 }}>
    <Field label="Order note" hint="Optional — delivery instructions, gift message…">
      <Textarea placeholder="Leave at the front desk" />
    </Field>
  </div>
);

export const Autosize = () => (
  <div style={{ maxWidth: 400 }}>
    <Field label="Description" hint="Grows to 8 rows, then scrolls" counter={{ value: 142, max: 300 }}>
      <Textarea
        autosize
        minRows={2}
        maxRows={8}
        defaultValue="Lightweight everyday sneakers with a cushioned sole. Breathable recycled knit upper, removable insole and a grippy rubber outsole for city walks."
      />
    </Field>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 400 }}>
    <Textarea aria-label="Review" variant="sunken" rows={2} placeholder="Write a review of the Aura Wireless Headphones" />
    <Field label="Return reason" error="Tell us what went wrong (at least 20 characters).">
      <Textarea rows={2} defaultValue="Too small" />
    </Field>
    <Textarea aria-label="Locked note" rows={2} disabled placeholder="Notes are locked once the order ships" />
  </div>
);
