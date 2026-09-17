import { Card, CardHeader, Donut, sampleData } from "@bluesigns/ui";

const { paymentMix, returnReasons } = sampleData;
const payment = paymentMix.map((p) => ({ ...p, value: Math.round(p.value * 9140) }));

export const PaymentMix = () => (
  <div style={{ width: 460 }}>
    <Donut label="Payment mix" segments={payment} centerValue="9,140" centerLabel="orders" showValues={false} />
  </div>
);

export const WithValues = () => (
  <div style={{ width: 460 }}>
    <Donut label="Payment mix" segments={payment} centerValue="9,140" centerLabel="orders" />
  </div>
);

export const SmallInCard = () => (
  <div style={{ width: 480 }}>
    <Card>
      <CardHeader title="Return reasons" description="Last 30 days · demo data" />
      <Donut
        label="Return reasons"
        size={120}
        centerValue="366"
        centerLabel="returns"
        segments={returnReasons.map((r, i) => ({ id: r.id, label: r.label, value: r.value, slot: i }))}
      />
    </Card>
  </div>
);
