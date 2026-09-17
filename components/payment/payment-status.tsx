import { CircleCheck, CircleX, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { IconTile } from "@/components/ui/icon-tile";
import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export type PaymentStatusProps = {
  status: "success" | "failed" | "pending";
  amount: number;
  /** Gateway / bank reference. */
  reference?: string;
  method?: string;
  /** Specific failure reason from the gateway, in plain words. */
  reason?: string;
  /** Buttons: retry, choose another method, view order. */
  actions?: React.ReactNode;
  className?: string;
};

const config = {
  success: { icon: CircleCheck, tone: "success", title: "Payment successful" },
  failed: { icon: CircleX, tone: "danger", title: "Payment failed" },
  pending: { icon: Clock, tone: "warning", title: "Payment pending" },
} as const;

/**
 * Result of a payment attempt. Failures say what happened and what to do; pending payments
 * explain that nothing needs retrying yet; debited-but-failed money is promised back with a
 * timeframe. Server-safe (actions are passed in).
 */
export function PaymentStatus({ status, amount, reference, method, reason, actions, className }: PaymentStatusProps) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <Card asChild padding="none" className={cn("items-center gap-4 p-6 text-center sm:p-8", className)}>
      <section data-slot="payment-status" role={status === "failed" ? "alert" : "status"}>
        <IconTile size="xl" tone={c.tone}>
          <Icon />
        </IconTile>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-heading-md">{c.title}</h2>
          <p className="text-figure-lg figures">{formatPrice(amount)}</p>
          {method && <p className="text-body text-fg-muted">{method}</p>}
        </div>
        <p className="max-w-sm text-body text-fg-muted">
          {status === "success" && "Your payment went through. You’ll get a confirmation by SMS and email."}
          {status === "failed" && (reason ?? "The payment couldn’t be completed.")}
          {status === "pending" && "Your bank hasn’t confirmed yet. Don’t pay again — we’ll update the order within 30 minutes."}
        </p>
        {status === "failed" && (
          <Inset asChild size="sm" className="max-w-sm py-2 text-caption text-fg-muted">
            <p>If money was debited, it will be refunded to the same account within 5–7 working days.</p>
          </Inset>
        )}
        {reference && (
          <p className="flex items-center gap-1 text-caption text-fg-muted">
            Reference <span className="text-code text-fg">{reference}</span>
            <CopyButton value={reference} label="Copy reference" size="xs" />
          </p>
        )}
        {actions && <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">{actions}</div>}
      </section>
    </Card>
  );
}
