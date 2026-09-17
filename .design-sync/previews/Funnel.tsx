import { Funnel, sampleData } from "@bluesigns/ui";

const { conversionFunnel } = sampleData;

export const Conversion = () => (
  <div style={{ width: 520 }}>
    <Funnel label="Conversion funnel" stages={conversionFunnel} format="compact" />
  </div>
);

export const FullNumbers = () => (
  <div style={{ width: 520 }}>
    <Funnel label="Conversion funnel" stages={conversionFunnel} />
  </div>
);

export const CheckoutSteps = () => (
  <div style={{ width: 460 }}>
    <Funnel
      label="Checkout drop-off"
      stages={[
        { id: "bag", label: "Bag", value: 4820 },
        { id: "address", label: "Address", value: 3910 },
        { id: "payment", label: "Payment", value: 3120 },
        { id: "paid", label: "Paid", value: 2764 },
      ]}
    />
  </div>
);
