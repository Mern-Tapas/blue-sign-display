import { COD_FEE, DELIVERY_FEE, EXPRESS_FEE, FREE_DELIVERY_THRESHOLD, GIFT_WRAP_FEE, PLATFORM_FEE, couponSavings } from "@/lib/data/india";
import type { Coupon } from "@/lib/data/types";

export type PricedLine = { price: number; compareAt?: number; quantity: number };

export type BagTotals = {
  itemCount: number;
  /** Sum of MRPs. */
  mrp: number;
  /** Sum of selling prices (inclusive of taxes). */
  subtotal: number;
  /** MRP − selling price. */
  mrpDiscount: number;
  couponCode?: string;
  couponDiscount: number;
  platformFee: number;
  /** Delivery fee actually charged (0 when free). */
  delivery: number;
  /** Delivery fee waived, for "₹49 FREE" display. */
  deliveryWaived: number;
  express: number;
  giftWrap: number;
  cod: number;
  total: number;
  /** MRP discount + coupon + waived delivery. */
  savings: number;
};

export type BagOptions = {
  coupon?: Coupon | null;
  giftWrap?: boolean;
  express?: boolean;
  cod?: boolean;
};

/**
 * Indian bag maths in one place so the drawer, bag page, checkout and order details agree:
 * MRP → discount → coupon → platform fee → delivery (free above the threshold) → optional
 * express, gift wrap and COD fees. All amounts are inclusive of GST.
 */
export function computeBagTotals(lines: PricedLine[], { coupon, giftWrap = false, express = false, cod = false }: BagOptions = {}): BagTotals {
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const mrp = lines.reduce((n, l) => n + (l.compareAt ?? l.price) * l.quantity, 0);
  const couponDiscount = coupon ? couponSavings(coupon, subtotal) : 0;
  const empty = itemCount === 0;
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = empty || freeDelivery ? 0 : DELIVERY_FEE;
  const platformFee = empty ? 0 : PLATFORM_FEE;
  const expressFee = !empty && express ? EXPRESS_FEE : 0;
  const giftWrapFee = !empty && giftWrap ? GIFT_WRAP_FEE : 0;
  const codFee = !empty && cod ? COD_FEE : 0;
  const total = Math.max(0, subtotal - couponDiscount) + platformFee + delivery + expressFee + giftWrapFee + codFee;
  const deliveryWaived = !empty && freeDelivery ? DELIVERY_FEE : 0;
  return {
    itemCount,
    mrp,
    subtotal,
    mrpDiscount: mrp - subtotal,
    couponCode: couponDiscount > 0 ? coupon?.code : undefined,
    couponDiscount,
    platformFee,
    delivery,
    deliveryWaived,
    express: expressFee,
    giftWrap: giftWrapFee,
    cod: codFee,
    total,
    savings: mrp - subtotal + couponDiscount + deliveryWaived,
  };
}
