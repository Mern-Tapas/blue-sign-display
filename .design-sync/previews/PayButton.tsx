import { PayButton } from "@bluesigns/ui";

export const Default = () => (
  <form onSubmit={(e) => e.preventDefault()}>
    <PayButton amount={21596} />
  </form>
);

export const CustomLabels = () => (
  <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-center gap-3">
    <PayButton amount={3527} label="Place order · ₹3,527" />
    <PayButton amount={12999} label="Show QR code" />
    <PayButton amount={12999} label="Continue with HDFC Bank card" />
  </form>
);

export const States = () => (
  <form onSubmit={(e) => e.preventDefault()} className="flex flex-wrap items-center gap-3">
    <PayButton amount={12999} loading />
    <PayButton amount={12999} disabled label="Choose a plan" />
  </form>
);

export const PhoneWidth = () => (
  <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 360 }}>
    <PayButton amount={4499} className="w-full" />
  </form>
);
