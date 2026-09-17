import { emiAmount } from "@/lib/data/india";
import type { EmiPlan } from "@/lib/data/types";

export type EmiBank = { id: string; name: string; plans: EmiPlan[] };

/** Lowest monthly instalment across banks — for "EMI from ₹x/month" teasers. Server-safe. */
export function lowestEmi(price: number, banks: EmiBank[], formula = emiAmount) {
  return Math.min(...banks.flatMap((b) => b.plans.map((p) => formula(price, p.months, p.interestRate))));
}
