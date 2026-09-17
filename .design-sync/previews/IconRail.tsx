import { IconRail, icons } from "@bluesigns/ui";

const { LayoutGrid, Home, Package, Heart, CreditCard, Settings, LogOut, Boxes, Users, Undo2, Wallet } = icons;

export const Storefront = () => (
  <div className="flex items-start">
  <IconRail
    groups={[
      [
        { href: "/design-system/navigation", label: "Dashboard", icon: LayoutGrid, active: true },
        { href: "/", label: "Home", icon: Home },
        { href: "/account/orders", label: "Orders", icon: Package },
        { href: "/account/wishlist", label: "Wishlist", icon: Heart },
      ],
      [
        { href: "/account/payments", label: "Payments", icon: CreditCard },
        { href: "/account/profile", label: "Settings", icon: Settings },
      ],
      [{ href: "/", label: "Log out", icon: LogOut }],
    ]}
  />
  </div>
);

export const SellerAdmin = () => (
  <div className="flex items-start">
  <IconRail
    groups={[
      [
        { href: "/admin", label: "Overview", icon: LayoutGrid },
        { href: "/admin/orders", label: "Orders", icon: Package, active: true },
        { href: "/admin/returns", label: "Returns", icon: Undo2 },
        { href: "/admin/products", label: "Products", icon: Boxes },
        { href: "/admin/customers", label: "Customers", icon: Users },
      ],
      [
        { href: "/admin/payouts", label: "Payouts", icon: Wallet },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    ]}
  />
  </div>
);

export const SingleGroup = () => (
  <div className="flex items-start">
  <IconRail
    groups={[
      [
        { href: "/", label: "Home", icon: Home },
        { href: "/account/wishlist", label: "Wishlist", icon: Heart, active: true },
        { href: "/account/orders", label: "Orders", icon: Package },
      ],
    ]}
  />
  </div>
);
