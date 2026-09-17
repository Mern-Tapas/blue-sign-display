import { CopyButton } from "@bluesigns/ui";

export const CouponCode = () => (
  <div className="flex w-fit items-center gap-3 rounded-lg border border-dashed border-accent bg-accent-soft py-2 pr-2 pl-4">
    <span className="text-code text-accent-soft-fg">BLUESIGNS20</span>
    <CopyButton value="BLUESIGNS20" appearance="button" label="Copy code" />
  </div>
);

export const IconInline = () => (
  <p className="flex items-center gap-1 text-body text-fg-muted">
    AWB <span className="text-code text-fg">DL8821347790IN</span>
    <CopyButton value="DL8821347790IN" label="Copy tracking number" variant="ghost" size="sm" />
  </p>
);

export const Appearances = () => (
  <div className="flex flex-wrap items-center gap-4">
    <CopyButton value="https://bluesigns.shop/r/PRIYA50" label="Copy referral link" />
    <CopyButton value="https://bluesigns.shop/r/PRIYA50" appearance="button" variant="secondary" size="sm" label="Copy link" />
    <CopyButton value="priya@okaxis" appearance="inline" label="Copy UPI ID" />
  </div>
);
