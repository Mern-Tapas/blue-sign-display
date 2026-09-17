import { Badge, icons } from "@bluesigns/ui";

const { Truck, Sparkles, Clock } = icons;

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-2" style={{ maxWidth: 480 }}>
    <Badge>Neutral</Badge>
    <Badge tone="accent">New</Badge>
    <Badge tone="success">In stock</Badge>
    <Badge tone="warning">Low stock</Badge>
    <Badge tone="danger">-20%</Badge>
    <Badge tone="info">Pre-order</Badge>
    <Badge tone="solid">Bestseller</Badge>
    <Badge tone="sale">Sale</Badge>
    <Badge tone="inverse">Limited</Badge>
    <Badge tone="outline">Unsent</Badge>
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-2">
    <Badge size="sm" tone="accent">Small</Badge>
    <Badge size="md" tone="accent">Medium</Badge>
    <Badge size="lg" tone="accent">Large</Badge>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge tone="success">
      <Truck aria-hidden />
      Free delivery
    </Badge>
    <Badge tone="accent">
      <Sparkles aria-hidden />
      New arrival
    </Badge>
    <Badge tone="warning">
      <Clock aria-hidden />
      Only 3 left
    </Badge>
  </div>
);
