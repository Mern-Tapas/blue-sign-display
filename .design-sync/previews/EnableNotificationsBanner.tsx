import { EnableNotificationsBanner, toast } from "@bluesigns/ui";

// Renders only while the browser permission is "default" (ask) or "denied" (explains how to re-enable).
export const Default = () => (
  <div style={{ maxWidth: 720 }}>
    <EnableNotificationsBanner onGranted={() => toast({ title: "Notifications turned on", tone: "success" })} />
  </div>
);

export const OrderTracking = () => (
  <div style={{ maxWidth: 720 }}>
    <EnableNotificationsBanner benefit="Know the moment order LM-100482 is out for delivery, with the delivery OTP on your lock screen." />
  </div>
);

export const Narrow = () => (
  <div style={{ maxWidth: 360 }}>
    <EnableNotificationsBanner benefit="Get price-drop alerts for 4 items in your wishlist." />
  </div>
);
