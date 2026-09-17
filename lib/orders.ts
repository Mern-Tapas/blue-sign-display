import { RETURN_WINDOW_DAYS } from "@/lib/data/india";
import { getProductById } from "@/lib/data/products";
import type { Order, Product } from "@/lib/data/types";

export type OrderLine = Order["items"][number] & { product: Product };

/** Order items joined with their products (unknown products are skipped). Server-safe. */
export function orderLines(order: Order): OrderLine[] {
  return order.items.flatMap((i) => {
    const product = getProductById(i.productId);
    return product ? [{ ...i, product }] : [];
  });
}

const addDaysIso = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Last day a delivered order can be returned (yyyy-mm-dd), or null. */
export function returnDeadline(order: Order, windowDays = RETURN_WINDOW_DAYS) {
  return order.status === "delivered" && order.deliveredOn ? addDaysIso(order.deliveredOn, windowDays) : null;
}

/** `today` is yyyy-mm-dd; pass it from where the date is known to avoid hydration drift. */
export function canReturn(order: Order, today: string) {
  const deadline = returnDeadline(order);
  return Boolean(deadline && today && today <= deadline);
}

/** Orders can be cancelled until they are out for delivery. */
export function canCancel(order: Order) {
  return order.status === "processing" || order.status === "shipped";
}

export type OrderGroup = "active" | "delivered" | "cancelled" | "returned";

export function orderGroup(order: Order): OrderGroup {
  if (order.status === "delivered") return "delivered";
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "returned") return "returned";
  return "active";
}
