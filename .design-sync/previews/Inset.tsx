import { Card, CardHeader, Inset } from "@bluesigns/ui";

export const Tones = () => (
  <div className="grid grid-cols-2 gap-3" style={{ width: 440 }}>
    <Inset>Sunken — order totals</Inset>
    <Inset tone="accent">You save ₹4,000</Inset>
    <Inset tone="success">Refund credited</Inset>
    <Inset tone="warning">Only 3 left in stock</Inset>
    <Inset tone="danger">Payment failed</Inset>
    <Inset tone="info">Delivery by Friday</Inset>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-col gap-3" style={{ width: 360 }}>
    <Inset size="sm">Small — gift messages, compact notes</Inset>
    <Inset size="md">Medium — totals and summaries</Inset>
  </div>
);

export const InsideCard = () => (
  <div style={{ width: 400 }}>
    <Card>
      <CardHeader title="Order LM-100482" description="Placed on 10 Sept 2026" />
      <Inset className="flex flex-col gap-2">
        <div className="flex justify-between text-body">
          <span className="text-fg-muted">Items (3)</span>
          <span className="figures">₹21,547</span>
        </div>
        <div className="flex justify-between text-body">
          <span className="text-fg-muted">Delivery</span>
          <span className="text-success-fg">Free</span>
        </div>
        <div className="flex justify-between text-label">
          <span>Order total</span>
          <span className="figures">₹21,596</span>
        </div>
      </Inset>
    </Card>
  </div>
);
