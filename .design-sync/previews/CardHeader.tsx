import { Card, CardContent, CardHeader, IconButton, SegmentedControl, TextButton, icons } from "@bluesigns/ui";

const { ArrowUpRight, MapPin, Wallet } = icons;

export const WithAction = () => (
  <div style={{ width: 360 }}>
    <Card>
      <CardHeader
        title="Total revenue"
        description="Last 30 days"
        action={
          <IconButton label="Open report" size="sm">
            <ArrowUpRight aria-hidden />
          </IconButton>
        }
      />
      <p className="text-figure-xl figures">₹32,678.90</p>
    </Card>
  </div>
);

export const WithIcon = () => (
  <div style={{ width: 360 }}>
    <Card>
      <CardHeader
        icon={<MapPin aria-hidden />}
        title="Delivery address"
        description="Home · Bengaluru 560066"
        action={<TextButton size="sm">Change</TextButton>}
      />
      <CardContent>
        <p className="text-body text-fg-muted">Flat 402, Prestige Lakeside, Whitefield, Bengaluru, Karnataka</p>
      </CardContent>
    </Card>
  </div>
);

export const WithSegmentedControl = () => (
  <div style={{ width: 420 }}>
    <Card>
      <CardHeader
        title="Sales"
        description="Gross merchandise value"
        action={
          <SegmentedControl
            aria-label="Range"
            size="sm"
            defaultValue="30d"
            options={[
              { value: "7d", label: "7D" },
              { value: "30d", label: "30D" },
              { value: "90d", label: "90D" },
            ]}
          />
        }
      />
      <p className="text-figure-xl figures">₹18.4L</p>
    </Card>
  </div>
);

export const OnAccentCard = () => (
  <div style={{ width: 360 }}>
    <Card variant="accent">
      <CardHeader icon={<Wallet aria-hidden />} title="BlueSigns Pay" description="Balance updated just now" />
      <p className="text-figure-xl figures">₹1,250</p>
    </Card>
  </div>
);
