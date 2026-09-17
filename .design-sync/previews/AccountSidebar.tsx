import { AccountSidebar, icons, sampleData, toast } from "@bluesigns/ui";

const { Package, Heart, Bell, Ticket, Gift, UserRound, ShieldCheck } = icons;
const { demoUser } = sampleData;

const signOut = () => toast({ title: "Signed out", tone: "info" });

export const Default = () => (
  <div style={{ maxWidth: 256 }}>
    <AccountSidebar user={demoUser} onSignOut={signOut} />
  </div>
);

export const WithBadgesAndActive = () => (
  <div style={{ maxWidth: 256 }}>
    <AccountSidebar
      user={demoUser}
      onSignOut={signOut}
      groups={[
        {
          label: "Shopping",
          items: [
            { href: "/account/orders", label: "Orders", icon: <Package />, badge: 2 },
            { href: "/account/wishlist", label: "Wishlist", icon: <Heart /> },
            { href: "/account/notifications", label: "Notifications", icon: <Bell />, badge: 5 },
          ],
        },
        {
          label: "Money",
          items: [
            { href: "/account/coupons", label: "Coupons", icon: <Ticket />, badge: "New" },
            { href: "/account/gift-cards", label: "Gift cards", icon: <Gift /> },
          ],
        },
        {
          label: "Settings",
          items: [
            // "/" is the current route in the preview, so this row shows the active state.
            { href: "/", label: "Profile", icon: <UserRound /> },
            { href: "/account/security", label: "Login & security", icon: <ShieldCheck /> },
          ],
        },
      ]}
    />
  </div>
);

export const InitialsAvatar = () => (
  <div style={{ maxWidth: 256 }}>
    <AccountSidebar user={{ name: "Priya Raghavan", email: "priya.r@gmail.com" }} onSignOut={signOut} />
  </div>
);
