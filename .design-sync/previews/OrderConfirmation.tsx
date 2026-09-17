import { OrderConfirmation, computeBagTotals, formatPrice, sampleData } from "@bluesigns/ui";

const { getProduct, coupons } = sampleData;

const item = (slug: string, extra: { size?: string; color?: string; quantity?: number } = {}) => {
  const p = getProduct(slug)!;
  return { key: [p.id, extra.color, extra.size].filter(Boolean).join(":"), productId: p.id, slug: p.slug, name: p.name, image: p.images[0]!, price: p.price, compareAt: p.compareAt, quantity: 1, ...extra };
};

const prepaidItems = [item("aura-wireless-headphones", { color: "Graphite" }), item("fleece-hoodie", { size: "M", color: "Black" })];
const codItems = [item("no-5-eau-de-parfum", { size: "50ml" })];
const codTotals = computeBagTotals(codItems, { cod: true });

export const PaidByUpi = () => (
  <div className="p-4">
    <OrderConfirmation
      orderId="LM-100482"
      customerName="Sujon Ahmed"
      deliveryBy="Thu, 18 Sept"
      addressLine="Flat 402, Prestige Lakeside, Varthur Road, Whitefield, Bengaluru, Karnataka 560066"
      paymentLine="UPI · sujon@okaxis"
      items={prepaidItems}
      totals={computeBagTotals(prepaidItems, { coupon: coupons[0] })}
    />
  </div>
);

export const CashOnDelivery = () => (
  <div className="p-4">
    <OrderConfirmation
      orderId="LM-100251"
      customerName="Priya Raman"
      deliveryBy="Mon, 22 Sept"
      addressLine="12, Armenian Street, George Town, Chennai, Tamil Nadu 600001"
      paymentLine="Cash on Delivery"
      items={codItems}
      totals={codTotals}
      note={`Keep ${formatPrice(codTotals.total)} ready in cash or UPI for the delivery partner.`}
    />
  </div>
);
