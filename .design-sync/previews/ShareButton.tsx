import { ShareButton } from "@bluesigns/ui";

export const Icon = () => (
  <div className="flex items-center gap-3">
    <ShareButton title="Aura Wireless Headphones" text="Check out Aura Wireless Headphones on BlueSigns" url="https://bluesigns.shop/products/aura-wireless-headphones" />
    <ShareButton variant="ghost" title="Meridian Classic Watch" url="https://bluesigns.shop/products/meridian-classic-watch" />
    <ShareButton variant="sunken" size="sm" title="Court Low Sneaker" url="https://bluesigns.shop/products/court-low-sneaker" />
  </div>
);

export const Button = () => (
  <div className="flex items-center gap-3">
    <ShareButton appearance="button" size="sm" title="My wishlist" url="https://bluesigns.shop/wishlist/priya" label="Share wishlist" />
    <ShareButton appearance="button" title="Diwali gift guide" url="https://bluesigns.shop/c/diwali-gifts" label="Share guide" />
  </div>
);
