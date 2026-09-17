import { Navbar, cart, sampleData, wishlist } from "@bluesigns/ui";

const { navCategories, searchSuggestions, demoUser, addresses, products } = sampleData;

// Seed the bag and wishlist so the header counts render (clear first: both stores persist).
cart.clear();
cart.add({ productId: products[0]!.id, slug: products[0]!.slug, name: products[0]!.name, image: products[0]!.images[0]!, price: products[0]!.price, compareAt: products[0]!.compareAt, color: "Sand" }, { open: false });
cart.add({ productId: products[2]!.id, slug: products[2]!.slug, name: products[2]!.name, image: products[2]!.images[0]!, price: products[2]!.price, quantity: 1 }, { open: false });
wishlist.clear();
wishlist.add(products[1]!.slug, products[1]!.price);
wishlist.add(products[3]!.slug, products[3]!.price);
wishlist.add(products[4]!.slug, products[4]!.price);

export const SignedIn = () => (
  <div style={{ width: 860 }}>
    <Navbar className="static px-0 pt-0" categories={navCategories} suggestions={searchSuggestions} user={demoUser} savedAddresses={addresses} mountPanels={false} />
  </div>
);

export const SignedOut = () => (
  <div style={{ width: 860 }}>
    <Navbar className="static px-0 pt-0" categories={navCategories} suggestions={searchSuggestions} showDeliverTo={false} mountPanels={false} />
  </div>
);

export const CustomLinks = () => (
  <div style={{ width: 860 }}>
    <Navbar
      className="static px-0 pt-0"
      categories={navCategories}
      suggestions={searchSuggestions}
      user={demoUser}
      wishlistCount={12}
      showDeliverTo={false}
      mountPanels={false}
      links={[
        { href: "/", label: "Home" },
        { href: "/shop?sale=1", label: "Festive sale" },
        { href: "/help", label: "Help" },
      ]}
    />
  </div>
);
