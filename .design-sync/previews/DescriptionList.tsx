import { CopyButton, DescriptionList, TextButton } from "@bluesigns/ui";

export const RowsWithDividers = () => (
  <div style={{ width: 380 }}>
    <DescriptionList
      dividers
      items={[
        { term: "Order ID", description: "LM-100482", action: <CopyButton value="LM-100482" label="Copy order ID" size="xs" /> },
        { term: "Placed on", description: "10 Sept 2026" },
        { term: "Payment", description: "UPI · sujon@okaxis" },
        { term: "Order total", description: "₹21,596", emphasis: true },
      ]}
    />
  </div>
);

export const PriceDetails = () => (
  <div style={{ width: 340 }}>
    <DescriptionList
      size="sm"
      items={[
        { term: "Bag total (MRP)", description: "₹29,997" },
        { term: "Discount on MRP", description: <span className="text-success-fg">−₹8,000</span> },
        { term: "Platform fee", description: "₹9" },
        { term: "Delivery", description: <span className="text-success-fg">Free</span> },
        { term: "Total amount", description: "₹22,006", emphasis: true },
      ]}
    />
  </div>
);

export const Specifications = () => (
  <div style={{ width: 460 }}>
    <DescriptionList
      layout="table"
      size="sm"
      dividers
      items={[
        { term: "Model", description: "Aura ANC 700" },
        { term: "Connectivity", description: "Bluetooth 5.3, USB-C, 3.5 mm" },
        { term: "Battery", description: "Up to 40 hours (ANC off), 10 min charge = 5 hours" },
        { term: "Warranty", description: "1 year manufacturer warranty" },
        { term: "Country of origin", description: "India" },
      ]}
    />
  </div>
);

export const StackedAddress = () => (
  <div style={{ width: 320 }}>
    <DescriptionList
      layout="stacked"
      items={[
        { term: "Deliver to", description: "Sujon Ahmed" },
        { term: "Address", description: "Flat 402, Prestige Lakeside, Whitefield, Bengaluru, Karnataka 560066" },
        { term: "Mobile", description: "+91 98765 43210", action: <TextButton size="sm">Change</TextButton> },
      ]}
    />
  </div>
);

export const ProfileGrid = () => (
  <div style={{ width: 480 }}>
    <DescriptionList
      layout="grid"
      items={[
        { term: "Full name", description: "Sujon Ahmed" },
        { term: "Mobile", description: "+91 98765 43210" },
        { term: "Email", description: "sujon@bluesigns.shop" },
        { term: "Date of birth", description: "Not added" },
      ]}
    />
  </div>
);
