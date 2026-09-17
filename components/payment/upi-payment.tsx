"use client";

import { useId, useState } from "react";
import { RadioGroup } from "radix-ui";
import { AtSign, CircleCheck, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Inset } from "@/components/ui/inset";
import { RadioCard } from "@/components/ui/radio-card";
import { cn } from "@/lib/cn";
import type { UpiApp } from "@/lib/data/types";
import { validateUpiId } from "@/lib/payment";
import { useMediaQuery } from "@/lib/use-media-query";
import { PayButton } from "./pay-button";

export type UpiPaymentDetails = { mode: "app"; app: string } | { mode: "id"; vpa: string } | { mode: "qr" };

export type UpiPaymentProps = {
  amount: number;
  apps: UpiApp[];
  savedIds?: string[];
  /** Verifies a UPI ID and returns the account holder's name (or throws with a message). */
  verify?: (vpa: string) => Promise<string>;
  onPay: (details: UpiPaymentDetails) => void | Promise<void>;
  className?: string;
};

/**
 * UPI in three ways: an app on this phone, a UPI ID (verified to show the account name before
 * paying), or a QR on desktop. Paying opens a collect request the shopper approves in their app.
 */
export function UpiPayment({ amount, apps, savedIds = [], verify, onPay, className }: UpiPaymentProps) {
  const id = useId();
  const isPhone = useMediaQuery("(pointer: coarse)", true);
  const [choice, setChoice] = useState<string>(savedIds[0] ? `id:${savedIds[0]}` : "id:new");
  const [vpa, setVpa] = useState("");
  const [error, setError] = useState<string>();
  const [verified, setVerified] = useState<{ vpa: string; name: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [paying, setPaying] = useState(false);

  async function doVerify() {
    const err = validateUpiId(vpa);
    if (err) return setError(err);
    if (!verify) return setVerified({ vpa, name: "" });
    setVerifying(true);
    try {
      setVerified({ vpa: vpa.trim(), name: await verify(vpa.trim()) });
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn’t verify this UPI ID");
    } finally {
      setVerifying(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let details: UpiPaymentDetails | null = null;
    if (choice.startsWith("app:")) details = { mode: "app", app: choice.slice(4) };
    else if (choice === "qr") details = { mode: "qr" };
    else if (choice === "id:new") {
      const err = validateUpiId(vpa);
      if (err) return setError(err);
      details = { mode: "id", vpa: vpa.trim() };
    } else details = { mode: "id", vpa: choice.slice(3) };
    setPaying(true);
    try {
      await onPay(details);
    } finally {
      setPaying(false);
    }
  }

  return (
    <form noValidate onSubmit={submit} data-slot="upi-payment" className={cn("flex flex-col gap-5", className)}>
      <RadioGroup.Root aria-label="Pay with UPI" value={choice} onValueChange={(v) => { setChoice(v); setError(undefined); }} className="flex flex-col gap-4">
        {isPhone && apps.length > 0 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-label">Pay using an app</legend>
            <div className="grid grid-cols-2 gap-2">
              {apps.map((a) => (
                <RadioCard
                  key={a.id}
                  value={`app:${a.id}`}
                  size="sm"
                  indicator={false}
                  icon={<span aria-hidden className="text-caption-strong">{a.name.slice(0, 2)}</span>}
                  title={a.name}
                />
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-label">Pay using a UPI ID</legend>
          {savedIds.map((s) => (
            <RadioCard
              key={s}
              value={`id:${s}`}
              size="sm"
              indicator={false}
              icon={<AtSign aria-hidden />}
              title={<span className="figures">{s}</span>}
              aside={<span className="text-caption font-normal text-fg-muted">Saved</span>}
            />
          ))}
          <RadioCard value="id:new" size="sm" indicator={false} icon={<Smartphone aria-hidden />} title={savedIds.length ? "Use another UPI ID" : "Enter UPI ID"} />
          {choice === "id:new" && (
            <div className="animate-fade-in pl-1">
              <Field
                id={`${id}-vpa`}
                label="UPI ID"
                error={error}
                hint={verified?.vpa === vpa.trim() && verified.name ? undefined : "Example: 9876543210@ybl or name@okaxis"}
              >
                <Input
                  value={vpa}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  inputMode="email"
                  placeholder="yourname@bank"
                  onChange={(e) => {
                    setVpa(e.target.value);
                    setError(undefined);
                    setVerified(null);
                  }}
                  wrapperClassName="pr-1"
                  endSlot={
                    <Button type="button" size="sm" variant="secondary" loading={verifying} onClick={doVerify} disabled={!vpa.trim()}>
                      Verify
                    </Button>
                  }
                />
              </Field>
              {verified && verified.vpa === vpa.trim() && verified.name && (
                <p role="status" className="mt-2 flex items-center gap-1.5 text-label text-success-fg">
                  <CircleCheck aria-hidden className="size-icon-md" /> {verified.name}
                </p>
              )}
            </div>
          )}
        </fieldset>

        {!isPhone && (
          <RadioCard value="qr" size="sm" indicator={false} icon={<QrCode aria-hidden />} title="Scan QR code" description="Scan with any UPI app on your phone" />
        )}
      </RadioGroup.Root>

      {choice === "qr" && (
        <Inset className="flex items-center gap-4">
          <span aria-hidden className="flex size-24 shrink-0 items-center justify-center rounded-md border border-dashed border-border-strong bg-surface text-fg-muted">
            <QrCode className="size-8" />
          </span>
          <p className="text-body text-fg-muted">A QR code for this exact amount appears after you continue. It stays valid for 5 minutes.</p>
        </Inset>
      )}

      <PayButton amount={amount} loading={paying} label={choice === "qr" ? "Show QR code" : undefined} />
    </form>
  );
}
