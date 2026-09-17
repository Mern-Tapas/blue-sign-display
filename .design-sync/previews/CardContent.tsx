import { Card, CardContent, CardHeader, Checkbox, icons } from "@bluesigns/ui";

const { BellRing, ShieldCheck } = icons;

export const Paragraphs = () => (
  <div style={{ width: 360 }}>
    <Card>
      <CardHeader icon={<ShieldCheck aria-hidden />} title="Secure payments" />
      <CardContent>
        <p className="text-body text-fg-muted">All payments are processed over 256-bit encrypted connections.</p>
        <p className="text-body text-fg-muted">We never store your full card number or UPI PIN.</p>
      </CardContent>
    </Card>
  </div>
);

export const WithControls = () => (
  <div style={{ width: 360 }}>
    <Card>
      <CardHeader icon={<BellRing aria-hidden />} title="Order updates" description="Choose where we reach you" />
      <CardContent>
        <Checkbox label="SMS" defaultChecked />
        <Checkbox label="WhatsApp" defaultChecked />
        <Checkbox label="Email" />
      </CardContent>
    </Card>
  </div>
);

export const OnSunkenCard = () => (
  <div style={{ width: 360 }}>
    <Card variant="sunken">
      <CardHeader title="Delivery instructions" />
      <CardContent>
        <p className="text-body">Leave the parcel with the security desk at Gate 2.</p>
        <p className="text-caption text-fg-muted">Visible to the delivery partner only.</p>
      </CardContent>
    </Card>
  </div>
);
