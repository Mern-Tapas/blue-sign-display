import { IconTile, icons } from "@bluesigns/ui";

const { Package, Wallet, Truck, BadgeCheck, TriangleAlert, Info, ShieldCheck } = icons;

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-3">
    <IconTile>
      <Package />
    </IconTile>
    <IconTile tone="muted">
      <Package />
    </IconTile>
    <IconTile tone="accent">
      <Wallet />
    </IconTile>
    <IconTile tone="success">
      <BadgeCheck />
    </IconTile>
    <IconTile tone="warning">
      <TriangleAlert />
    </IconTile>
    <IconTile tone="danger">
      <TriangleAlert />
    </IconTile>
    <IconTile tone="info">
      <Info />
    </IconTile>
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <IconTile size="sm" tone="accent">
      <Truck />
    </IconTile>
    <IconTile size="md" tone="accent">
      <Truck />
    </IconTile>
    <IconTile size="lg" tone="accent">
      <Truck />
    </IconTile>
    <IconTile size="xl" tone="accent">
      <Truck />
    </IconTile>
  </div>
);

export const InListRow = () => (
  <div className="flex items-center gap-3" style={{ maxWidth: 360 }}>
    <IconTile tone="success">
      <ShieldCheck />
    </IconTile>
    <div className="flex flex-col">
      <span className="text-label">14-day easy returns</span>
      <span className="text-caption text-fg-muted">Free pickup from your doorstep</span>
    </div>
  </div>
);

export const OnColor = () => (
  <div className="inline-flex items-center gap-3 rounded-xl bg-accent p-4 text-fg-on-accent">
    <IconTile tone="onColor">
      <Wallet />
    </IconTile>
    <span className="text-label">BlueSigns Pay balance · ₹1,250</span>
  </div>
);
