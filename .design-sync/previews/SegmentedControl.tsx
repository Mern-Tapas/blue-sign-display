import { SegmentedControl, icons } from "@bluesigns/ui";

const { LayoutGrid, List } = icons;

export const Default = () => (
  <SegmentedControl
    aria-label="Billing period"
    defaultValue="monthly"
    options={[
      { value: "monthly", label: "Monthly" },
      { value: "annually", label: "Annually" },
    ]}
  />
);

export const AccentWithCounts = () => (
  <SegmentedControl
    aria-label="Order status"
    variant="surface"
    active="accent"
    defaultValue="unpaid"
    options={[
      { value: "all", label: "All orders" },
      { value: "draft", label: "Draft", count: 3 },
      { value: "unpaid", label: "Unpaid", count: 5 },
    ]}
  />
);

export const Sizes = () => (
  <div className="flex flex-col items-start gap-3">
    <SegmentedControl
      aria-label="Size"
      size="sm"
      active="neutral"
      defaultValue="m"
      options={["XS", "S", "M", "L", "XL"].map((s) => ({ value: s.toLowerCase(), label: s }))}
    />
    <SegmentedControl
      aria-label="View"
      size="lg"
      defaultValue="grid"
      options={[
        { value: "grid", label: "Grid", icon: <LayoutGrid aria-hidden /> },
        { value: "list", label: "List", icon: <List aria-hidden /> },
      ]}
    />
  </div>
);

export const Contrast = () => (
  <div className="w-fit rounded-xl bg-surface-contrast p-4">
    <SegmentedControl
      aria-label="Section"
      variant="contrast"
      active="contrast"
      defaultValue="orders"
      options={[
        { value: "overview", label: "Overview" },
        { value: "orders", label: "Orders" },
        { value: "returns", label: "Returns" },
      ]}
    />
  </div>
);

export const FullWidth = () => (
  <div style={{ maxWidth: 400 }}>
    <SegmentedControl
      aria-label="Delivery"
      fullWidth
      defaultValue="deliver"
      options={[
        { value: "deliver", label: "Deliver" },
        { value: "pickup", label: "Store pickup" },
        { value: "locker", label: "Locker", disabled: true },
      ]}
    />
  </div>
);
