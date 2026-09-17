import type { Address } from "@/lib/data/types";

/** "Flat 402, Prestige Lakeside, Varthur Road, Whitefield, Near Phoenix Marketcity, Bengaluru, Karnataka 560066". Server-safe. */
export function formatAddress(a: Pick<Address, "house" | "locality" | "landmark" | "city" | "state" | "pincode">) {
  return [a.house, a.locality, a.landmark, `${a.city}, ${a.state} ${a.pincode}`].filter(Boolean).join(", ");
}
