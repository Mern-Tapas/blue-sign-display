import { useEffect, useRef } from "react";
import { MegaMenu, sampleData } from "@bluesigns/ui";

const { navCategories } = sampleData;

const links = [
  { href: "/", label: "Home" },
  { href: "/shop?sort=newest", label: "New in" },
  { href: "/account/orders", label: "Orders" },
];

/** Clicks the "Shop" trigger after mount so the panel renders open. */
function OpenShop({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = window.setTimeout(() => {
      ref.current?.querySelector<HTMLButtonElement>("button[aria-expanded]")?.click();
    }, 50);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div ref={ref} className="flex items-start justify-center" style={{ width: 860, height: 460 }}>
      {children}
    </div>
  );
}

export const ShopPanelOpen = () => (
  <OpenShop>
    <MegaMenu categories={navCategories} links={links} pathname="/" />
  </OpenShop>
);

export const HomeActive = () => <MegaMenu categories={navCategories} links={links} pathname="/" />;

export const ShopActive = () => <MegaMenu categories={navCategories} links={links} pathname="/shop" />;

export const OrdersActive = () => <MegaMenu categories={navCategories} links={links} pathname="/account/orders" />;
