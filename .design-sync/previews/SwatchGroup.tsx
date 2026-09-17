import { SwatchGroup, TextButton } from "@bluesigns/ui";

export const Colour = () => (
  <SwatchGroup
    type="color"
    label="Colour"
    defaultValue="Violet"
    options={[
      { value: "Sand", color: "#d9c7a7" },
      { value: "Graphite", color: "#2b2b33" },
      { value: "Violet", color: "#6d5df5" },
      { value: "Crimson", color: "#c83e3e", disabled: true },
    ]}
  />
);

export const Size = () => (
  <div style={{ maxWidth: 540 }}>
  <SwatchGroup
    type="size"
    label="Size (UK / IND)"
    defaultValue="8"
    labelAction={<TextButton size="sm">Size guide</TextButton>}
    options={["5", "6", "6.5", "7", "8", "9", "9.5"].map((s) => ({ value: s, disabled: s === "6.5" }))}
  />
  </div>
);

export const Small = () => (
  <div className="flex flex-col gap-5">
    <SwatchGroup
      type="color"
      size="sm"
      label="Colour"
      defaultValue="Black"
      options={[
        { value: "White", color: "#f5f5f7" },
        { value: "Black", color: "#18181f" },
        { value: "Olive", color: "#6b7a4b" },
      ]}
    />
    <SwatchGroup type="size" size="sm" label="Volume" defaultValue="50ml" options={[{ value: "30ml" }, { value: "50ml" }, { value: "100ml" }]} />
  </div>
);

export const NoSelection = () => (
  <SwatchGroup type="size" label="Select size" showSelected={false} options={["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({ value: s }))} />
);
