import { Card, CardHeader, CardInset, icons } from "@bluesigns/ui";

const { Wallet } = icons;

export const Wallets = () => (
  <div style={{ width: 360 }}>
    <Card>
      <CardHeader title="Wallets" description="3 currencies" icon={<Wallet />} />
      <div className="grid grid-cols-2 gap-2">
        <CardInset>
          <p className="text-caption text-fg-muted">INR</p>
          <p className="text-heading-sm figures">₹2,26,780</p>
          <p className="mt-1 text-caption text-success-fg">Active</p>
        </CardInset>
        <CardInset>
          <p className="text-caption text-fg-muted">EUR</p>
          <p className="text-heading-sm figures">€18,345</p>
          <p className="mt-1 text-caption text-danger-fg">Inactive</p>
        </CardInset>
      </div>
    </Card>
  </div>
);

export const GiftMessage = () => (
  <div style={{ width: 360 }}>
    <Card>
      <CardHeader title="Gift wrap added" description="₹49 · Festive red paper" />
      <CardInset>
        <p className="text-caption text-fg-muted">Message</p>
        <p className="text-body">Happy Diwali, Ananya! Enjoy the music. — Rahul</p>
      </CardInset>
    </Card>
  </div>
);
