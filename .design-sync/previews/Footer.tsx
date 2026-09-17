import { Footer, NewsletterSignup } from "@bluesigns/ui";

export const WithNewsletter = () => (
  <div style={{ width: 860 }}>
    <Footer className="px-0" newsletter={<NewsletterSignup variant="contrast" />} />
  </div>
);

export const Default = () => (
  <div style={{ width: 860 }}>
    <Footer className="px-0" />
  </div>
);

export const CustomColumns = () => (
  <div style={{ width: 860 }}>
    <Footer
      className="px-0"
      columns={[
        {
          title: "Categories",
          links: [
            { label: "Audio", href: "/shop?category=audio" },
            { label: "Watches", href: "/shop?category=watches" },
            { label: "Footwear", href: "/shop?category=footwear" },
          ],
        },
        {
          title: "Policies",
          links: [
            { label: "Shipping policy", href: "/help?topic=delivery" },
            { label: "14-day returns", href: "/help?topic=returns" },
            { label: "Cash on Delivery", href: "/help?topic=payments" },
          ],
        },
        {
          title: "Stores",
          links: [
            { label: "Bengaluru · Indiranagar", href: "/" },
            { label: "Mumbai · Bandra", href: "/" },
            { label: "Delhi · Hauz Khas", href: "/" },
          ],
        },
      ]}
    />
  </div>
);
