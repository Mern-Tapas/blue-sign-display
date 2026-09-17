import { icons, ValuePropsStrip } from "@bluesigns/ui";

const { Banknote, RotateCcw, Truck } = icons;

export const Strip = () => (
  <div style={{ width: 640 }}>
    <ValuePropsStrip />
  </div>
);

export const Inline = () => (
  <div style={{ width: 520 }}>
    <ValuePropsStrip
      variant="inline"
      items={[
        { icon: <Truck />, title: "Free delivery" },
        { icon: <RotateCcw />, title: "14-day returns" },
        { icon: <Banknote />, title: "Cash on Delivery" },
      ]}
    />
  </div>
);

export const Stacked = () => (
  <div style={{ width: 640 }}>
    <ValuePropsStrip variant="stacked" />
  </div>
);
