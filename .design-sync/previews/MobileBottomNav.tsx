import { MobileBottomNav, cart, icons, sampleData } from "@bluesigns/ui";

const { House, Search, Ticket, Package, UserRound } = icons;
const { products } = sampleData;

// Seed the bag so the Bag count renders (clear first: the store persists).
cart.clear();
cart.add({ productId: products[0]!.id, slug: products[0]!.slug, name: products[0]!.name, image: products[0]!.images[0]!, price: products[0]!.price, quantity: 2 }, { open: false });

/** Phone-width frame; `static lg:block` keeps the fixed, phone-only bar in flow for the preview. */
function Phone({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="flex flex-col justify-end overflow-hidden rounded-t-2xl border-x border-t border-border bg-canvas" style={{ width: 390, height: 200 }}>
      <p className="m-auto px-6 text-center text-body text-fg-muted">{caption}</p>
      {children}
    </div>
  );
}

export const Default = () => (
  <Phone caption="Home screen · Bengaluru 560066">
    <MobileBottomNav className="static lg:block" wishlistCount={3} />
  </Phone>
);

export const NoCounts = () => (
  <Phone caption="Fresh session, empty wishlist">
    <MobileBottomNav className="static lg:block" wishlistCount={0} />
  </Phone>
);

export const CustomItems = () => (
  <Phone caption="Custom destinations">
    <MobileBottomNav
      className="static lg:block"
      items={[
        { key: "home", label: "Home", icon: House, href: "/", isActive: (p) => p === "/" },
        { key: "search", label: "Search", icon: Search, onSelect: () => {} },
        { key: "offers", label: "Offers", icon: Ticket, href: "/offers", count: 4 },
        { key: "orders", label: "Orders", icon: Package, href: "/account/orders", count: 1 },
        { key: "account", label: "Account", icon: UserRound, href: "/account" },
      ]}
    />
  </Phone>
);
