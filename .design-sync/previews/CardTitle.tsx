import { Badge, Card, CardDescription, CardTitle } from "@bluesigns/ui";

export const Default = () => (
  <div style={{ width: 340 }}>
    <Card>
      <div>
        <CardTitle>Rewards balance</CardTitle>
        <CardDescription>1,240 SuperCoins · worth ₹124 on your next order</CardDescription>
      </div>
    </Card>
  </div>
);

export const WithBadge = () => (
  <div style={{ width: 340 }}>
    <Card>
      <div>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Order LM-100482</CardTitle>
          <Badge tone="success">Delivered</Badge>
        </div>
        <CardDescription>Delivered on 12 Sept 2026 to Whitefield, Bengaluru</CardDescription>
      </div>
    </Card>
  </div>
);

export const OnContrastCard = () => (
  <div style={{ width: 340 }}>
    <Card variant="contrast">
      <div>
        <CardTitle>Festive Sale is live</CardTitle>
        <CardDescription>Up to 60% off on audio, watches and footwear till Sunday.</CardDescription>
      </div>
    </Card>
  </div>
);
