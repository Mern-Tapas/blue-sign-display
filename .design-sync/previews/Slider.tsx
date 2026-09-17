import { Slider, formatPrice } from "@bluesigns/ui";

export const PriceRange = () => (
  <div style={{ maxWidth: 360 }}>
    <div className="mb-3 flex justify-between text-label">
      <span>Price range</span>
      <span className="text-fg-muted tabular-nums">
        {formatPrice(1000)} – {formatPrice(12000)}
      </span>
    </div>
    <Slider defaultValue={[1000, 12000]} min={0} max={20000} step={500} thumbLabels={["Minimum price", "Maximum price"]} />
  </div>
);

export const Single = () => (
  <div style={{ maxWidth: 360 }}>
    <div className="mb-3 flex justify-between text-label">
      <span>Delivery radius</span>
      <span className="text-fg-muted tabular-nums">12 km</span>
    </div>
    <Slider defaultValue={[12]} min={1} max={30} thumbLabels={["Delivery radius"]} />
  </div>
);

export const Disabled = () => (
  <div style={{ maxWidth: 360 }}>
    <Slider defaultValue={[40]} disabled thumbLabels={["Discount"]} />
  </div>
);
