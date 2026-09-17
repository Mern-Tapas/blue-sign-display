import { Card, CardHeader, ShareBar, sampleData } from "@bluesigns/ui";

const { paymentMix } = sampleData;
const payment = paymentMix.map((p) => ({ ...p, value: Math.round(p.value * 9140) }));

export const PaymentMix = () => (
  <div style={{ width: 480 }}>
    <ShareBar label="Payment mix" segments={payment} showValues={false} />
  </div>
);

export const WithValues = () => (
  <div style={{ width: 480 }}>
    <ShareBar label="Payment mix" segments={payment} />
  </div>
);

export const DeviceSplitInCard = () => (
  <div style={{ width: 420 }}>
    <Card>
      <CardHeader title="Orders by channel" description="Last 30 days · demo data" />
      <ShareBar
        label="Orders by channel"
        format="number"
        segments={[
          { id: "app", label: "App", value: 5667, slot: 0 },
          { id: "web", label: "Web", value: 3473, slot: 1 },
        ]}
      />
    </Card>
  </div>
);
