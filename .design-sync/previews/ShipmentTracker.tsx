import { ShipmentTracker, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;
const byId = (id: string) => orders.find((o) => o.id === id)!;

export const OutForDelivery = () => (
  <div style={{ maxWidth: 720 }}>
    <ShipmentTracker order={byId("LM-100482")} trackingUrl="https://www.delhivery.com/track/package/DL8821347790IN" />
  </div>
);

export const Delivered = () => (
  <div style={{ maxWidth: 720 }}>
    <ShipmentTracker order={byId("LM-100377")} trackingUrl="https://www.ekartlogistics.com/track/EK5530917724" />
  </div>
);

export const OrderedNotShipped = () => (
  <div style={{ maxWidth: 720 }}>
    <ShipmentTracker order={byId("LM-100251")} />
  </div>
);

export const Returned = () => (
  <div style={{ maxWidth: 720 }}>
    <ShipmentTracker order={byId("LM-100066")} />
  </div>
);
