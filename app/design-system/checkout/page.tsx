import type { Metadata } from "next";
import { CheckoutBlocksDemo } from "@/components/docs/demos/checkout-demo";
import { DsPageHeader, DsProps, DsSection } from "@/components/docs/ds-section";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import type { CartItem } from "@/components/providers/cart-store";
import { addresses } from "@/lib/data/india";
import { products } from "@/lib/data/products";
import { computeBagTotals } from "@/lib/pricing";
import { formatAddress } from "@/lib/address";

export const metadata: Metadata = { title: "Checkout" };

const sampleItems: CartItem[] = [products[0]!, products[8]!, products[14]!].map((p, i) => ({
  key: p.id,
  productId: p.id,
  slug: p.slug,
  name: p.name,
  image: p.images[0]!,
  price: p.price,
  compareAt: p.compareAt,
  quantity: i === 1 ? 2 : 1,
  color: p.colors?.[0]?.name,
  size: p.sizes?.[2],
}));

export default function CheckoutGalleryPage() {
  return (
    <>
      <DsPageHeader
        title="Checkout"
        muted="& delivery"
        description="Bag → Address → Payment. Indian addresses with PIN auto-fill and serviceability, delivery speed and slots, and totals from the same pricing function as the bag. The live flow is at /checkout; payment methods have their own page."
      />
      <DsSection title="Checkout building blocks">
        <CheckoutBlocksDemo items={sampleItems} />
      </DsSection>

      <DsSection title="Order confirmation" description="Order number to copy, arrival date, where it’s going, how it was paid and the final breakdown.">
        <OrderConfirmation
          orderId="LM-100731"
          customerName="Sujon Ahmed"
          deliveryBy="Thu, 18 Sept"
          addressLine={formatAddress(addresses[0]!)}
          paymentLine="UPI · sujon@okaxis"
          items={sampleItems}
          totals={computeBagTotals(sampleItems)}
          trackHref="/design-system/checkout"
          shopHref="/design-system/checkout"
        />
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="AddressForm (updated)"
            rows={[
              { name: "onSubmit", type: "(value: AddressFormValue) => void", description: "{ name, mobile, pincode, house, locality, landmark, city, state, type, isDefault, alternateMobile }. Replaces the US shape (email, zip…)." },
              { name: "id · defaultValue · lookup", type: "string · Partial<AddressFormValue> · (pin) => PincodeInfo", description: "PIN auto-fills city/state, flags non-serviceable and no-COD areas." },
            ]}
          />
          <DsProps
            component="AddressSelector · SavedAddressCard · AddressDialog"
            rows={[
              { name: "addresses · value · onValueChange · lookup · onSave · onRemove", type: "AddressSelector", description: "Non-serviceable addresses are disabled with a reason; add/edit open AddressDialog." },
              { name: "address · pin · selected · onEdit · onRemove · selectable", type: "SavedAddressCard", description: "Radio item in the selector, plain card in an address book." },
              { name: "open · onOpenChange · address · onSave", type: "AddressDialog", description: "onSave(value, id?) — id present when editing." },
            ]}
          />
          <DsProps
            component="ShippingMethod (updated) · DeliverySlotPicker"
            rows={[
              { name: "options · value · onValueChange", type: "ShippingMethod", description: "shippingOptionsFor(subtotal, { etaDays, expressAvailable }) builds INR options; unavailableReason disables one." },
              { name: "value · onValueChange · startInDays · days · slots · isFull", type: "DeliverySlotPicker", description: "Dates computed on the client; slots can carry a fee or be fully booked." },
            ]}
          />
          <DsProps
            component="OrderSummary (updated) · OrderConfirmation · PaymentMethod (updated)"
            rows={[
              { name: "details", type: "BagTotals", description: "OrderSummary: Indian breakdown; legacy totals are now optional." },
              { name: "orderId · customerName · deliveryBy · addressLine · paymentLine · items · totals · note", type: "OrderConfirmation", description: "Server-safe success screen." },
              { name: "value · onValueChange · codAvailable", type: 'PaymentMethod — "upi" | "card" | "cod"', description: "Compact picker; the checkout uses PaymentOptionsList." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
