import { NotFoundState } from "@bluesigns/ui";

export const Default = () => (
  <div style={{ maxWidth: 720 }}>
    <NotFoundState headingAs="h2" className="py-6" />
  </div>
);

export const CustomLinks = () => (
  <div style={{ maxWidth: 720 }}>
    <NotFoundState
      headingAs="h2"
      title="This product is no longer available"
      description="The Studio Over-Ear headphones were discontinued. Here’s where to look instead."
      links={[
        { label: "Headphones", href: "/c/audio" },
        { label: "Smart watches", href: "/c/watches" },
        { label: "Today’s deals", href: "/deals" },
      ]}
      className="py-6"
    />
  </div>
);

export const WithoutSearch = () => (
  <div style={{ maxWidth: 720 }}>
    <NotFoundState
      headingAs="h2"
      searchAction={null}
      title="Order not found"
      description="Check the order ID in your confirmation email."
      links={[
        { label: "My orders", href: "/account/orders" },
        { label: "Help centre", href: "/help" },
      ]}
      className="py-6"
    />
  </div>
);
