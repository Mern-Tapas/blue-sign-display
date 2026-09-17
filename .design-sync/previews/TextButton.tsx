import { TextButton, icons } from "@bluesigns/ui";

const { Plus, ChevronRight } = icons;

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-5">
    <TextButton>Change address</TextButton>
    <TextButton tone="neutral">View all</TextButton>
    <TextButton tone="muted">Skip for now</TextButton>
    <TextButton tone="danger">Remove</TextButton>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-5">
    <TextButton size="sm">Forgot password?</TextButton>
    <TextButton size="md">Apply coupon</TextButton>
    <TextButton size="lg">See delivery options</TextButton>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-5">
    <TextButton>
      <Plus aria-hidden /> Add new address
    </TextButton>
    <TextButton tone="neutral">
      View order details <ChevronRight aria-hidden />
    </TextButton>
    <TextButton disabled>Resend OTP</TextButton>
  </div>
);

export const InContext = () => (
  <div className="flex items-center justify-between gap-4 rounded-xl bg-surface p-4 shadow-flat" style={{ maxWidth: 420 }}>
    <div>
      <p className="text-body-strong">Deliver to Priya Sharma</p>
      <p className="text-caption text-fg-muted">Varthur Road, Bengaluru 560087</p>
    </div>
    <TextButton>Change</TextButton>
  </div>
);
