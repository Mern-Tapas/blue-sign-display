"use client";

import { createStore } from "@/lib/create-store";
import type { CartItem } from "./cart-store";

export type BagState = {
  savedForLater: CartItem[];
  couponCode: string | null;
  giftWrap: { enabled: boolean; message: string; to: string; from: string };
};

const initial: BagState = { savedForLater: [], couponCode: null, giftWrap: { enabled: false, message: "", to: "", from: "" } };

const store = createStore<BagState>(initial, {
  storageKey: "ds-bag",
  parse: (raw) => {
    const v = raw as Partial<BagState> | null;
    return {
      savedForLater: Array.isArray(v?.savedForLater) ? v!.savedForLater : [],
      couponCode: typeof v?.couponCode === "string" ? v.couponCode : null,
      giftWrap: { ...initial.giftWrap, ...(v?.giftWrap ?? {}) },
    };
  },
});

/** Bag-level choices that live beside the cart items: saved for later, applied coupon, gift wrap. */
export const bag = {
  saveForLater(item: CartItem) {
    store.set((s) => ({ ...s, savedForLater: [item, ...s.savedForLater.filter((i) => i.key !== item.key)] }));
  },
  removeSaved(key: string) {
    store.set((s) => ({ ...s, savedForLater: s.savedForLater.filter((i) => i.key !== key) }));
  },
  applyCoupon: (code: string | null) => store.set((s) => ({ ...s, couponCode: code })),
  setGiftWrap: (patch: Partial<BagState["giftWrap"]>) => store.set((s) => ({ ...s, giftWrap: { ...s.giftWrap, ...patch } })),
};

export const useBag = store.useStore;
