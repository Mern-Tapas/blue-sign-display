"use client";

import { useEffect } from "react";
import { createStore } from "@/lib/create-store";

const MAX = 12;

const store = createStore<string[]>([], {
  storageKey: "ds-recently-viewed",
  parse: (raw) => (Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string").slice(0, MAX) : []),
});

/** Product slugs the shopper opened on this device, newest first. */
export const recentlyViewed = {
  add: (slug: string) => store.set((list) => [slug, ...list.filter((s) => s !== slug)].slice(0, MAX)),
  remove: (slug: string) => store.set((list) => list.filter((s) => s !== slug)),
  clear: () => store.set([]),
};

export const useRecentlyViewed = store.useStore;

/** Records a product view once per slug change. Render on product pages. */
export function useTrackRecentlyViewed(slug: string) {
  useEffect(() => {
    recentlyViewed.add(slug);
  }, [slug]);
}
