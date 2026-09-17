import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, IconButton, PriceDisplay, TrendChip, icons } from "@bluesigns/ui";

const { ArrowUpRight, Package } = icons;

export const Surface = () => (
  <div style={{ width: 320 }}>
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
      <PriceDisplay amount={32678.9} size="2xl" />
      <TrendChip value={12.8} caption="vs last month" />
    </Card>
  </div>
);

export const Accent = () => (
  <div style={{ width: 320 }}>
    <Card variant="accent">
      <CardHeader title="Orders today" description="Updated 2 min ago" icon={<Package className="text-fg" />} />
      <p className="text-figure-xl figures">1,284</p>
      <TrendChip value={7} variant="solid" />
    </Card>
  </div>
);

export const Contrast = () => (
  <div style={{ width: 320 }}>
    <Card variant="contrast">
      <CardHeader title="Available payout" description="Next transfer Friday" />
      <p className="text-figure-xl figures">
        <span className="text-fg-on-contrast-muted">₹</span>2,14,390<span className="text-fg-on-contrast-muted">.00</span>
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="inverse">
          Payout now
        </Button>
        <IconButton label="Open" variant="contrast" size="sm">
          <ArrowUpRight aria-hidden />
        </IconButton>
      </div>
    </Card>
  </div>
);

export const SunkenAndOutline = () => (
  <div className="grid grid-cols-2 gap-4" style={{ width: 600 }}>
    <Card variant="sunken">
      <CardHeader title="Sunken card" description="For grouping on a white surface" />
      <CardContent>
        <p className="text-body text-fg-muted">Use inside a surface card or as a quiet section background.</p>
      </CardContent>
    </Card>
    <Card variant="outline" interactive>
      <CardHeader title="Interactive outline" />
      <CardDescription>Hover lifts the card with the popover shadow.</CardDescription>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Details
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export const Danger = () => (
  <div style={{ width: 380 }}>
    <Card variant="danger">
      <p className="text-title">Delete account</p>
      <p className="text-body text-fg-muted">Removes order history, addresses and saved cards. This cannot be undone.</p>
      <div>
        <Button variant="danger" size="sm">
          Delete my account
        </Button>
      </div>
    </Card>
  </div>
);

export const PaddingAndRadius = () => (
  <div className="flex items-start gap-4">
    <Card padding="sm" radius="lg">
      <p className="text-label">padding sm · radius lg</p>
    </Card>
    <Card padding="md" radius="xl">
      <p className="text-label">padding md · radius xl</p>
    </Card>
    <Card padding="lg">
      <p className="text-label">padding lg · radius 2xl</p>
    </Card>
  </div>
);
