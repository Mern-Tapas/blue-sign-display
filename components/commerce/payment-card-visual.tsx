import { Nfc } from "lucide-react";
import { cn } from "@/lib/cn";

export type PaymentCardVisualProps = {
  brand?: "visa" | "mastercard" | "amex" | "rupay" | "unknown";
  last4: string;
  holder?: string;
  expiry: string;
  variant?: "dark" | "accent";
  status?: "active" | "inactive";
  className?: string;
};

function BrandLogo({ brand }: { brand: PaymentCardVisualProps["brand"] }) {
  if (brand === "mastercard") {
    return (
      <span aria-label="Mastercard" role="img" className="flex">
        <span className="size-7 rounded-pill bg-[#eb001b]" />
        <span className="-ml-3 size-7 rounded-pill bg-[#f79e1b] mix-blend-screen" />
      </span>
    );
  }
  return (
    <span
      aria-label={brand === "amex" ? "American Express" : brand === "rupay" ? "RuPay" : brand === "unknown" ? "Card" : "Visa"}
      role="img"
      className="text-heading-sm font-bold tracking-tight italic"
    >
      {brand === "amex" ? "AMEX" : brand === "rupay" ? "RuPay" : brand === "unknown" ? "" : "VISA"}
    </span>
  );
}

/** Credit-card tile from the wallet cards in the references. Decorative — never renders a full PAN. */
export function PaymentCardVisual({
  brand = "visa",
  last4,
  holder,
  expiry,
  variant = "dark",
  status,
  className,
}: PaymentCardVisualProps) {
  return (
    <div
      data-slot="payment-card"
      className={cn(
        "relative isolate flex aspect-[1.586] w-full max-w-80 flex-col justify-between overflow-hidden rounded-xl p-5",
        variant === "dark" ? "bg-surface-contrast text-fg-on-contrast" : "bg-accent text-fg-on-accent",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute -right-16 -bottom-24 -z-10 size-64 rounded-pill blur-2xl",
          variant === "dark" ? "bg-accent/35" : "bg-tile-on-color-hover",
        )}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Nfc aria-hidden className="size-icon-lg opacity-70" />
          {status && (
            <span className="rounded-pill bg-tile-on-color px-2 py-0.5 text-caption-strong capitalize backdrop-blur-sm">{status}</span>
          )}
        </div>
        <BrandLogo brand={brand} />
      </div>
      <div className="flex items-end justify-between gap-4 text-caption">
        <div>
          <p className={variant === "dark" ? "text-fg-on-contrast-muted" : "text-fg-on-accent-muted"}>{holder ?? "Card number"}</p>
          <p className="mt-0.5 font-mono text-body tracking-widest figures">•••• {last4}</p>
        </div>
        <div className="text-right">
          <p className={variant === "dark" ? "text-fg-on-contrast-muted" : "text-fg-on-accent-muted"}>EXP</p>
          <p className="mt-0.5 font-mono text-body figures">{expiry}</p>
        </div>
      </div>
    </div>
  );
}
