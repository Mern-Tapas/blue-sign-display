import { useEffect, useRef } from "react";
import { AccountMenu, icons, sampleData } from "@bluesigns/ui";

const { Package, Heart, Bell, Ticket, Settings } = icons;
const { demoUser } = sampleData;

/** Opens the menu after mount (Radix opens dropdowns on a primary-button pointerdown). */
function OpenOnMount({ children, height = 660 }: { children: React.ReactNode; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const trigger = ref.current?.querySelector<HTMLElement>("[aria-haspopup='menu']");
      trigger?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, button: 0, pointerType: "mouse" }));
    }, 50);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div ref={ref} className="flex items-start justify-end" style={{ width: 360, height }}>
      {children}
    </div>
  );
}

export const CustomLinksOpen = () => (
  <OpenOnMount height={440}>
    <AccountMenu
      appearance="avatar"
      user={{ name: "Ananya Iyer", mobile: "9812345678" }}
      onSignOut={() => {}}
      links={[
        [
          { href: "/account/orders", label: "Orders", icon: <Package />, count: 2 },
          { href: "/account/wishlist", label: "Wishlist", icon: <Heart />, count: 7 },
          { href: "/account/notifications", label: "Notifications", icon: <Bell />, count: 3 },
        ],
        [
          { href: "/account/coupons", label: "Coupons", icon: <Ticket /> },
          { href: "/account/profile", label: "Profile & settings", icon: <Settings /> },
        ],
      ]}
    />
  </OpenOnMount>
);

export const SignedInOpen = () => (
  <OpenOnMount>
    <AccountMenu user={demoUser} onSignOut={() => {}} />
  </OpenOnMount>
);

export const Triggers = () => (
  <div className="flex items-center gap-6">
    <AccountMenu user={demoUser} />
    <AccountMenu user={{ name: "Ananya Iyer", mobile: "9812345678" }} appearance="avatar" />
    <AccountMenu onSignIn={() => {}} />
  </div>
);
