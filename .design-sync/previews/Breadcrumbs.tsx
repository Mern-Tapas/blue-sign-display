import { Breadcrumbs } from "@bluesigns/ui";

export const ProductPage = () => (
  <Breadcrumbs
    items={[
      { label: "Home", href: "/" },
      { label: "Audio", href: "/shop?category=audio" },
      { label: "Aura Wireless Headphones" },
    ]}
  />
);

export const DeepCategory = () => (
  <Breadcrumbs
    items={[
      { label: "Home", href: "/" },
      { label: "Men", href: "/shop?gender=men" },
      { label: "Footwear", href: "/shop?category=footwear" },
      { label: "Running shoes", href: "/shop?category=footwear&type=running" },
      { label: "Velocity Runner" },
    ]}
  />
);

export const AdminTwoLevel = () => <Breadcrumbs items={[{ label: "Customers", href: "/admin/customers" }, { label: "Priya Sharma" }]} />;

export const AboveHeading = () => (
  <div className="flex flex-col gap-2">
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Account", href: "/account" },
        { label: "Orders" },
      ]}
    />
    <h1 className="text-heading-lg">Your orders</h1>
  </div>
);
