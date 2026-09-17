"use client";

import { useState } from "react";
import { AtSign, Eye, EyeOff, Lock, Mail, Truck, Zap, Store } from "lucide-react";
import { DsGrid, DsPreview } from "@/components/docs/ds-section";
import { QuantityStepper } from "@/components/commerce/quantity-stepper";
import { PromoCodeInput } from "@/components/checkout/promo-code-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { RadioCard, RadioCardGroup } from "@/components/ui/radio-card";
import { SearchBar } from "@/components/ui/search-bar";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TextButton } from "@/components/ui/text-button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/providers/toast-store";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

export function TextInputsDemo() {
  const [show, setShow] = useState(false);
  return (
    <DsGrid>
      <DsPreview label="Input variants and sizes" className="flex-col items-stretch">
        <Input placeholder="Surface (default)" aria-label="Surface input" />
        <Input variant="sunken" placeholder="Sunken" aria-label="Sunken input" />
        <div className="flex gap-3">
          <Input size="sm" placeholder="Small" aria-label="Small input" />
          <Input size="lg" placeholder="Large" aria-label="Large input" />
        </div>
        <Input shape="rounded" placeholder="Rounded shape" aria-label="Rounded input" />
      </DsPreview>
      <DsPreview label="Field with label, hint, error and slots" className="flex-col items-stretch">
        <Field label="Email" hint="We’ll send your receipt here." required>
          <Input type="email" placeholder="you@example.com" startSlot={<Mail aria-hidden />} />
        </Field>
        <Field
          label="Password"
          error="Must be at least 8 characters."
          labelAction={
            <TextButton size="sm" onClick={() => toast({ title: "Reset link sent", description: "Check your inbox for a password reset link.", tone: "success" })}>
              Forgot?
            </TextButton>
          }
        >
          <Input
            type={show ? "text" : "password"}
            defaultValue="hunter2"
            startSlot={<Lock aria-hidden />}
            endSlot={
              <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
                {show ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
              </button>
            }
          />
        </Field>
        <Field label="Username">
          <Input disabled placeholder="Disabled" startSlot={<AtSign aria-hidden />} />
        </Field>
      </DsPreview>
      <DsPreview label="Textarea" className="flex-col items-stretch">
        <Field label="Order note" hint="Optional — delivery instructions, gift message…">
          <Textarea placeholder="Leave at the front desk" />
        </Field>
      </DsPreview>
      <DsPreview label="Select" className="flex-col items-stretch">
        <Field label="Address type">
          <Select
            placeholder="Select a type"
            options={[
              { value: "home", label: "Home (all day delivery)" },
              { value: "work", label: "Work (10 AM – 6 PM)" },
            ]}
          />
        </Field>
        <Select
          aria-label="Sort products"
          prefix="Sort:"
          defaultValue="featured"
          variant="sunken"
          groups={[
            { label: "Popular", options: [{ value: "featured", label: "Featured" }, { value: "rating", label: "Top rated" }] },
            { label: "Price", options: [{ value: "price-asc", label: "Low to high" }, { value: "price-desc", label: "High to low" }] },
          ]}
        />
      </DsPreview>
    </DsGrid>
  );
}

export function ChoicesDemo() {
  const [range, setRange] = useState([1000, 12000]);
  const [shipping, setShipping] = useState("standard");
  return (
    <DsGrid>
      <DsPreview label="Checkbox" className="flex-col items-stretch">
        <Checkbox label="Subscribe to restock alerts" defaultChecked />
        <Checkbox label="Sonora" trailing={128} />
        <Checkbox label="Indeterminate" checked="indeterminate" />
        <Checkbox label="Gift wrap this order" description="Add a handwritten note for ₹49" />
        <Checkbox label="Disabled" disabled />
      </DsPreview>
      <DsPreview label="Radio group" className="flex-col items-stretch">
        <RadioGroup defaultValue="upi" aria-label="Payment">
          <Radio value="upi" label="UPI" description="Google Pay, PhonePe, Paytm or any UPI ID" />
          <Radio value="card" label="Credit / debit card" description="RuPay, Visa, Mastercard, Amex" />
          <Radio value="cod" label="Cash on delivery" description="Not available for this PIN code" disabled />
        </RadioGroup>
      </DsPreview>
      <DsPreview label="Radio cards" className="flex-col items-stretch">
        <RadioCardGroup value={shipping} onValueChange={setShipping} aria-label="Shipping method">
          <RadioCard value="standard" icon={<Truck aria-hidden />} title="Standard" description="Delivery in 3–5 days" aside="Free" />
          <RadioCard value="express" icon={<Zap aria-hidden />} title="Express" description="Tomorrow by 9 PM" aside={formatPrice(99)} />
          <RadioCard value="pickup" icon={<Store aria-hidden />} title="Store pickup" description="Ready in 2 hours at Whitefield" aside="Free" />
        </RadioCardGroup>
      </DsPreview>
      <DsPreview label="Switch and slider" className="flex-col items-stretch">
        <Switch label="Email notifications" description="Order updates and receipts" defaultChecked />
        <Switch label="Only show in-stock" size="sm" />
        <div className="mt-2">
          <div className="mb-3 flex justify-between text-label">
            <span>Price range</span>
            <span className="text-fg-muted figures">
              {formatPrice(range[0]!)} – {formatPrice(range[1]!)}
            </span>
          </div>
          <Slider value={range} onValueChange={setRange} min={0} max={20000} step={500} thumbLabels={["Minimum price", "Maximum price"]} />
        </div>
      </DsPreview>
    </DsGrid>
  );
}

export function CommerceInputsDemo() {
  return (
    <DsGrid>
      <DsPreview label="Quantity stepper" className="flex-col items-start">
        <QuantityStepper defaultValue={2} />
        <QuantityStepper size="sm" defaultValue={1} removeAtMin onRemove={() => toast({ title: "Removed from cart", tone: "info" })} />
      </DsPreview>
      <DsPreview label="Promo code (try BLUESIGNS20)" className="flex-col items-stretch">
        <PromoCodeInput
          onApply={async (code) => {
            await new Promise((r) => setTimeout(r, 600));
            return code === "BLUESIGNS20" ? { ok: true, label: "BLUESIGNS20 · 20% off applied" } : { ok: false, error: `“${code}” isn’t a valid code.` };
          }}
        />
      </DsPreview>
      <DsPreview label="Search with suggestions" className="min-h-80 flex-col items-stretch justify-start">
        <SearchBar
          suggestions={products.map((p) => ({ id: p.slug, label: p.name, meta: p.brand }))}
          recent={["Headphones", "Hoodie"]}
          onSelect={(s) => toast({ title: `Selected ${s.label}` })}
          onSubmit={(q) => toast({ title: `Searching “${q}”` })}
        />
      </DsPreview>
      <DsPreview label="Inline form" className="flex-col items-stretch">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            toast({ title: "Subscribed", tone: "success" });
          }}
        >
          <Input type="email" required aria-label="Email" placeholder="Email address" startSlot={<Mail aria-hidden />} />
          <Button type="submit" variant="neutral" size="md" className="h-11">
            Subscribe
          </Button>
        </form>
      </DsPreview>
    </DsGrid>
  );
}
