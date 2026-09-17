import { AccountMenuList, icons, toast } from "@bluesigns/ui";

const { Package, Heart, Ticket, Coins, UserRound, MapPin } = icons;

const signOut = () => toast({ title: "Signed out", tone: "info" });

export const AllDestinations = () => (
  <div style={{ maxWidth: 390 }}>
    <AccountMenuList onSignOut={signOut} />
  </div>
);

export const CustomGroups = () => (
  <div style={{ maxWidth: 390 }}>
    <AccountMenuList
      onSignOut={signOut}
      groups={[
        {
          label: "Shopping",
          items: [
            { href: "/account/orders", label: "Orders", icon: <Package />, description: "2 arriving this week" },
            { href: "/account/wishlist", label: "Wishlist", icon: <Heart />, description: "3 price drops since yesterday" },
          ],
        },
        {
          label: "Money",
          items: [
            { href: "/account/coupons", label: "Coupons", icon: <Ticket />, description: "BLUESIGNS20 expires 31 Oct" },
            { href: "/account/rewards", label: "BlueSigns points", icon: <Coins />, description: "1,840 points · Gold member" },
          ],
        },
        {
          label: "Settings",
          items: [
            { href: "/account/profile", label: "Profile", icon: <UserRound />, description: "Name, contact and birthday" },
            { href: "/account/addresses", label: "Addresses", icon: <MapPin />, description: "Home · Bengaluru 560066" },
          ],
        },
      ]}
    />
  </div>
);
