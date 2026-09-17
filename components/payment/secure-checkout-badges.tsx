import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export type SecureCheckoutBadgesProps = {
  /** Accepted methods shown as text marks. */
  methods?: string[];
  /** Adds a clear note that no real payment is taken. */
  demo?: boolean;
  variant?: "stack" | "row";
  className?: string;
};

const defaultMethods = ["UPI", "RuPay", "Visa", "Mastercard", "Amex", "Net Banking", "Wallets", "EMI", "COD"];

/**
 * Plain statements about how payment is protected, plus the accepted methods. Only claims the
 * store actually meets belong here — no borrowed certification logos. Server-safe.
 */
export function SecureCheckoutBadges({ methods = defaultMethods, demo = false, variant = "stack", className }: SecureCheckoutBadgesProps) {
  const points = [
    { icon: <LockKeyhole />, text: "Payments are encrypted end to end" },
    { icon: <KeyRound />, text: "Cards saved as tokens per RBI rules" },
    { icon: <ShieldCheck />, text: "Easy refunds to the original method" },
  ];
  return (
    <section data-slot="secure-checkout" aria-label="Payment security" className={cn("flex flex-col gap-3", className)}>
      <ul className={cn("flex gap-x-5 gap-y-2 text-caption text-fg-muted", variant === "stack" ? "flex-col" : "flex-wrap")}>
        {points.map((p) => (
          <li key={p.text} className="flex items-center gap-2 [&_svg]:size-icon-sm [&_svg]:shrink-0 [&_svg]:text-success-fg">
            {p.icon}
            {p.text}
          </li>
        ))}
      </ul>
      <ul aria-label="Accepted payment methods" className="flex flex-wrap gap-1.5">
        {methods.map((m) => (
          <li key={m} className="rounded-xs border border-border-subtle bg-surface px-1.5 py-0.5 text-caption-strong text-fg-muted">
            {m}
          </li>
        ))}
      </ul>
      {demo && <p className="text-caption text-fg-muted">Demo store — no real payment is taken.</p>}
    </section>
  );
}
