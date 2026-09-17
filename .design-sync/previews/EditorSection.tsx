import { Button, EditorSection, Field, Input, Select, TextButton, Textarea } from "@bluesigns/ui";

export const BasicDetails = () => (
  <div style={{ width: 720 }}>
    <EditorSection title="Basic details" description="Shown on the product page and in search.">
      <Field label="Product name" required>
        <Input defaultValue="Aura Wireless Headphones" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Brand">
          <Input defaultValue="Sonora" />
        </Field>
        <Field label="Category" required>
          <Select
            defaultValue="Audio"
            options={["Audio", "Watches", "Footwear", "Apparel", "Beauty", "Home"].map((c) => ({ value: c, label: c }))}
          />
        </Field>
      </div>
      <Field label="Description">
        <Textarea rows={3} defaultValue="Over-ear headphones with adaptive noise cancelling and 40 hours of battery life." />
      </Field>
    </EditorSection>
  </div>
);

export const PricingWithAction = () => (
  <div style={{ width: 720 }}>
    <EditorSection title="Pricing & GST" description="Prices include GST." action={<TextButton>Price history</TextButton>}>
      <div className="grid grid-cols-3 gap-3">
        <Field label="MRP">
          <Input defaultValue="12999" startSlot={<span className="text-body text-fg-muted">₹</span>} />
        </Field>
        <Field label="Selling price">
          <Input defaultValue="8999" startSlot={<span className="text-body text-fg-muted">₹</span>} />
        </Field>
        <Field label="HSN code" hint="From your GST invoice">
          <Input defaultValue="8518" />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" size="sm">
          Apply to all variants
        </Button>
      </div>
    </EditorSection>
  </div>
);
