"use client";

import { createStore } from "@/lib/create-store";

export type WishlistEntry = {
  slug: string;
  /** ISO timestamp when saved. */
  addedAt: string;
  /** Price when saved, to tell the shopper about price drops. */
  savedPrice?: number;
};

const store = createStore<WishlistEntry[]>([], {
  storageKey: "ds-wishlist",
  parse: (raw) => (Array.isArray(raw) ? raw.filter((e): e is WishlistEntry => typeof e?.slug === "string") : []),
});

/** Saved products on this device (a signed-in store would sync this to the account). */
export const wishlist = {
  has: (slug: string) => store.get().some((e) => e.slug === slug),
  add: (slug: string, savedPrice?: number) =>
    store.set((list) => (list.some((e) => e.slug === slug) ? list : [{ slug, savedPrice, addedAt: new Date().toISOString() }, ...list])),
  remove: (slug: string) => store.set((list) => list.filter((e) => e.slug !== slug)),
  toggle(slug: string, savedPrice?: number) {
    const saved = wishlist.has(slug);
    if (saved) wishlist.remove(slug);
    else wishlist.add(slug, savedPrice);
    return !saved;
  },
  clear: () => store.set([]),
};

export const useWishlist = store.useStore;
