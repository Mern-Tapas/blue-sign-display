import type { Metadata } from "next";
import { BagItemsDemo, NoticesDemo, PricingDemo } from "@/components/docs/demos/bag-demo";
import { SizeDialogDemo, WishlistCardsDemo, WishlistGridDemo } from "@/components/docs/demos/wishlist-demo";
import { DsPageHeader, DsProps, DsSection } from "@/components/docs/ds-section";
import { CartDemo } from "@/components/docs/demos/cart-demo";
import { getProduct } from "@/lib/data/products";

export const metadata: Metadata = { title: "Wishlist & bag" };

export default function WishlistBagPage() {
  return (
    <>
      <DsPageHeader
        title="Wishlist"
        muted="& bag"
        description="Saving for later and getting ready to pay. The wishlist is one shared store: hearts on cards, product pages, quick view, the header count and /account/wishlist all stay in sync."
      />

      <DsSection title="Wishlist item" description="Price against MRP, a price-drop note since saving, stock state, and Move to bag — which asks for a size first when the product has sizes. Sold-out items switch to Notify me.">
        <WishlistCardsDemo />
      </DsSection>

      <DsSection title="Wishlist page" description="Count, sort (recently added, biggest price drop, price, in stock first), share, and an empty state that explains what the page is for. Skeletons show until the device’s list loads.">
        <WishlistGridDemo />
      </DsSection>

      <DsSection title="Size step">
        <SizeDialogDemo />
      </DsSection>

      <DsSection title="Bag items" description="Size and quantity selects, price vs MRP, delivery date for the shopper’s PIN, Save for later, and a remove step that offers the wishlist instead. The live bag is at /bag.">
        <BagItemsDemo />
      </DsSection>

      <DsSection title="Price details, coupons & gift wrap" description="One pricing function (computeBagTotals) feeds the drawer, bag, checkout and orders, so every screen shows the same MRP, discounts and fees. Drag the subtotal across ₹499 to see delivery become free.">
        <PricingDemo />
      </DsSection>

      <DsSection title="Notices & mini bag" description="Unavailable items are called out before checkout with one action to clear them. The mini bag previews the live bag from a header icon on desktop.">
        <NoticesDemo />
      </DsSection>

      <DsSection title="Cart drawer" description="Global (mounted once in app Providers) with free-delivery progress and compact price details. Add an item to open it.">
        <CartDemo product={getProduct("aura-wireless-headphones")!} />
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="WishlistButton (updated)"
            rows={[
              { name: "slug · price", type: "string · number", description: "Store-backed when slug is given (price saved for drop detection); local state otherwise, as before." },
            ]}
          />
          <DsProps
            component="computeBagTotals · PriceDetails"
            rows={[
              { name: "computeBagTotals(lines, { coupon, giftWrap, express, cod })", type: "BagTotals", description: "mrp, subtotal, mrpDiscount, couponDiscount, platformFee, delivery (+ waived), express, giftWrap, cod, total, savings." },
              { name: "totals · couponAction · variant · compact · title · id", type: 'PriceDetails — BagTotals · ReactNode · "card" | "plain" · boolean', description: "Card for bag and checkout, plain rows for drawers and summaries." },
            ]}
          />
          <DsProps
            component="BagItemCard · SaveForLaterList"
            rows={[
              { name: "item · brand · sizes · stock · deliveryText · maxQuantity", type: "BagItemCard", description: "Quantity select is capped by stock." },
              { name: "onSizeChange · onQuantityChange · onRemove · onMoveToWishlist · onSaveForLater", type: "fn", description: "With onMoveToWishlist, remove first asks “Remove or move to wishlist?”." },
              { name: "items · onMoveToBag · onRemove · defaultOpen", type: "SaveForLaterList", description: "Collapsible; hidden when empty." },
            ]}
          />
          <DsProps
            component="CouponSheet · GiftWrapOption · FreeDeliveryProgress"
            rows={[
              { name: "coupons · subtotal · today · appliedCode · onApply · trigger", type: "CouponSheet", description: "Code entry + ranked CouponCards; the footer shows the saving." },
              { name: "value · onChange · fee · maxMessage", type: "GiftWrapOption", description: "{ enabled, to, from, message }." },
              { name: "subtotal · threshold · fee · variant", type: 'FreeDeliveryProgress — "bar" | "inline"', description: "Defaults from the commerce rules." },
            ]}
          />
          <DsProps
            component="StickyCheckoutBar · UnavailableItemNotice · MiniBagPopover"
            rows={[
              { name: "total · savings · detailsId · actionLabel · action · onAction · offset", type: "StickyCheckoutBar", description: "Above the bottom nav, or flush on checkout." },
              { name: "items · pincode · onRemoveAll · onMoveToWishlist", type: "UnavailableItemNotice", description: "Reasons: out of stock, not deliverable, price changed." },
              { name: "bagHref · checkoutHref · max · trigger", type: "MiniBagPopover", description: "Reads the live cart store." },
            ]}
          />
          <DsProps
            component="WishlistItemCard"
            rows={[
              { name: "product · savedPrice", type: "Product · number", description: "Price-drop note when the current price is lower." },
              { name: "onRemove · onNotify", type: "() => void", description: "Default remove uses the store with an Undo toast." },
            ]}
          />
          <DsProps
            component="WishlistGrid · MoveToBagSizeDialog"
            rows={[
              { name: "products · title · shopHref · shareUrl", type: "WishlistGrid", description: "Resolves stored slugs against the catalogue." },
              { name: "product · sizes · open · onOpenChange · onConfirm", type: "MoveToBagSizeDialog", description: "onConfirm(size) — caller adds to bag and removes the entry." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
