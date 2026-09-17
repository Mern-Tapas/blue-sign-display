import { Button, Divider } from "@bluesigns/ui";

export const Horizontal = () => (
  <div className="flex flex-col gap-3" style={{ width: 360 }}>
    <p className="text-body">Subtotal (3 items)</p>
    <Divider />
    <p className="text-body text-fg-muted">Delivery to Bengaluru 560001</p>
  </div>
);

export const WithLabel = () => (
  <div className="flex flex-col gap-4" style={{ width: 360 }}>
    <Button fullWidth>Continue with OTP</Button>
    <Divider label="or continue with" />
    <Button fullWidth variant="secondary">
      Sign in with Google
    </Button>
  </div>
);

export const Vertical = () => (
  <div className="flex h-6 items-center gap-3 text-caption text-fg-muted">
    <span>4.7 ★</span>
    <Divider orientation="vertical" />
    <span>1,284 ratings</span>
    <Divider orientation="vertical" />
    <span>Sold by Sonora Retail</span>
  </div>
);
