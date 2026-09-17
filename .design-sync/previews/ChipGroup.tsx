import { ChipGroup, icons } from "@bluesigns/ui";

const { Truck, Tag } = icons;

export const MultipleWithCounts = () => (
  <div className="max-w-md">
    <ChipGroup
      aria-label="Discount"
      defaultValue={["30"]}
      options={[
        { value: "10", label: "10% and above", count: 212 },
        { value: "30", label: "30% and above", count: 96 },
        { value: "50", label: "50% and above", count: 18 },
        { value: "70", label: "70% and above", count: 0, disabled: true },
      ]}
    />
  </div>
);

export const SingleSize = () => (
  <ChipGroup
    type="single"
    aria-label="Size"
    size="md"
    defaultValue="M"
    showCheck={false}
    options={["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({ value: s, label: s, disabled: s === "XS" }))}
  />
);

export const ScrollRail = () => (
  <div style={{ maxWidth: 480 }}>
    <ChipGroup
      scroll
      variant="sunken"
      aria-label="Quick filters"
      defaultValue={["fast"]}
      options={[
        { value: "fast", label: "Delivery by tomorrow", icon: <Truck aria-hidden /> },
        { value: "assured", label: "BlueSigns Assured" },
        { value: "offers", label: "Bank offers", icon: <Tag aria-hidden /> },
        { value: "new", label: "New arrivals" },
        { value: "cod", label: "Pay on delivery" },
      ]}
    />
  </div>
);
