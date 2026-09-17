import { Progress, formatPrice } from "@bluesigns/ui";

export const FreeShipping = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 400 }}>
    <p className="text-label">
      Add <span className="text-accent-fg">{formatPrice(120)}</span> for free shipping
    </p>
    <Progress value={379} max={499} aria-label="Free shipping progress" />
  </div>
);

export const SpendingLimit = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 400 }}>
    <Progress value={1400} max={5500} track="hatch" aria-label="Spending limit" />
    <div className="flex justify-between text-caption">
      <span>
        <span className="font-medium tabular-nums">{formatPrice(1400)}</span> <span className="text-fg-muted">spent of</span>
      </span>
      <span className="font-medium tabular-nums">{formatPrice(5500)}</span>
    </div>
  </div>
);

export const TonesAndSizes = () => (
  <div className="flex flex-col gap-3" style={{ maxWidth: 400 }}>
    <Progress value={80} tone="success" size="sm" aria-label="Order packed" />
    <Progress value={45} tone="warning" size="md" aria-label="Stock left" />
    <Progress value={15} tone="danger" size="lg" aria-label="Storage left" />
    <Progress value={60} tone="neutral" size="sm" aria-label="Profile complete" />
  </div>
);
