import { Card, CardDescription, CardHeader, CardTitle, icons } from "@bluesigns/ui";

const { Truck } = icons;

export const UnderTitle = () => (
  <div style={{ width: 340 }}>
    <Card>
      <div>
        <CardTitle>Saved cards</CardTitle>
        <CardDescription>Your card details are stored securely with RBI-compliant tokenisation.</CardDescription>
      </div>
    </Card>
  </div>
);

export const ViaCardHeader = () => (
  <div style={{ width: 340 }}>
    <Card>
      <CardHeader icon={<Truck aria-hidden />} title="Express delivery" description="Get it by tomorrow, 9 PM in Bengaluru" />
    </Card>
  </div>
);

export const OnColouredCards = () => (
  <div className="grid grid-cols-2 gap-4" style={{ width: 560 }}>
    <Card variant="accent">
      <div>
        <CardTitle>Orders today</CardTitle>
        <CardDescription>Updated 2 min ago</CardDescription>
      </div>
    </Card>
    <Card variant="contrast">
      <div>
        <CardTitle>Available payout</CardTitle>
        <CardDescription>Next transfer Friday</CardDescription>
      </div>
    </Card>
  </div>
);
