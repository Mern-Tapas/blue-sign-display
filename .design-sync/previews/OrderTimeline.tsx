import { OrderTimeline, sampleData } from "@bluesigns/ui";

const { orders } = sampleData;
const [outForDelivery, delivered, processing, , returned] = orders;

export const OutForDelivery = () => (
  <div style={{ maxWidth: 420 }}>
    <OrderTimeline events={outForDelivery!.timeline} />
  </div>
);

export const NewestFirst = () => (
  <div style={{ maxWidth: 420 }}>
    <OrderTimeline events={outForDelivery!.timeline} newestFirst />
  </div>
);

export const Delivered = () => (
  <div style={{ maxWidth: 420 }}>
    <OrderTimeline events={delivered!.timeline} />
  </div>
);

export const Processing = () => (
  <div style={{ maxWidth: 420 }}>
    <OrderTimeline
      events={[
        ...processing!.timeline,
        { status: "Shipped", description: "", done: false },
        { status: "Delivered", description: "Estimated by Fri, 8 Aug", done: false },
      ]}
    />
  </div>
);

export const Returned = () => (
  <div style={{ maxWidth: 420 }}>
    <OrderTimeline events={returned!.timeline} />
  </div>
);
