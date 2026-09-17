"use client";

import { useId, useState } from "react";
import { BellRing, CircleCheck } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/lib/format";
import { parseIdentifier } from "@/lib/validation";

export type NotifyMeFormProps = {
  productName: string;
  /** Size or colour the shopper wants, if any. */
  variantLabel?: string;
  /** Prefill for signed-in shoppers. */
  defaultContact?: string;
  onSubmit: (contact: { kind: "email" | "mobile"; value: string }) => Promise<void>;
  className?: string;
};

/** Back-in-stock alert for sold-out products or sizes: one email-or-mobile field, then a clear confirmation. */
export function NotifyMeForm({ productName, variantLabel, defaultContact = "", onSubmit, className }: NotifyMeFormProps) {
  const id = useId();
  const [value, setValue] = useState(defaultContact);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ kind: "email" | "mobile"; value: string } | null>(null);

  if (done) {
    return (
      <Alert role="status" tone="success" data-slot="notify-me-done" icon={<CircleCheck aria-hidden />} className={className}>
        <p>
          We’ll let you know at <span className="font-medium">{done.kind === "mobile" ? formatPhone(done.value) : done.value}</span> when {productName}
          {variantLabel ? ` in ${variantLabel}` : ""} is back. One message, no marketing.
        </p>
      </Alert>
    );
  }

  return (
    <Card asChild variant="outline" padding="sm" radius="xl" className={className}>
    <form
      data-slot="notify-me-form"
      noValidate
      aria-busy={pending || undefined}
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = parseIdentifier(value);
        if (!parsed) return setError("Enter an email or 10-digit mobile number");
        setPending(true);
        await onSubmit(parsed);
        setPending(false);
        setDone(parsed);
      }}
    >
      <p className="flex items-center gap-2 text-title">
        <BellRing aria-hidden className="size-icon-lg text-accent-fg" />
        {variantLabel ? `${variantLabel} is sold out` : "Currently sold out"}
      </p>
      <Field id={`${id}-contact`} label="Get notified when it’s back" error={error}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            autoComplete="email"
            placeholder="Email or mobile number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(undefined);
            }}
          />
          <Button type="submit" loading={pending} className="shrink-0">
            Notify me
          </Button>
        </div>
      </Field>
    </form>
    </Card>
  );
}
