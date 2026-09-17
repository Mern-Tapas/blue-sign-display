"use client";

import { createStore } from "@/lib/create-store";

export const COMPARE_MAX = 4;

export type CompareState = { category: string | null; slugs: string[] };

const store = createStore<CompareState>(
  { category: null, slugs: [] },
  {
    storageKey: "ds-compare",
    parse: (raw) => {
      const v = raw as CompareState;
      return v && Array.isArray(v.slugs) ? { category: v.category ?? null, slugs: v.slugs.slice(0, COMPARE_MAX) } : { category: null, slugs: [] };
    },
  },
);

/**
 * Products picked for comparison. Items must share a category (comparing headphones with a
 * hoodie helps nobody); adding from another category returns "category" so the UI can offer
 * to start a new comparison.
 */
export const compare = {
  toggle(slug: string, category: string): "added" | "removed" | "full" | "category" {
    const s = store.get();
    if (s.slugs.includes(slug)) {
      const slugs = s.slugs.filter((x) => x !== slug);
      store.set({ category: slugs.length ? s.category : null, slugs });
      return "removed";
    }
    if (s.category && s.category !== category && s.slugs.length) return "category";
    if (s.slugs.length >= COMPARE_MAX) return "full";
    store.set({ category, slugs: [...s.slugs, slug] });
    return "added";
  },
  replaceWith(slug: string, category: string) {
    store.set({ category, slugs: [slug] });
  },
  remove(slug: string) {
    const s = store.get();
    const slugs = s.slugs.filter((x) => x !== slug);
    store.set({ category: slugs.length ? s.category : null, slugs });
  },
  clear() {
    store.set({ category: null, slugs: [] });
  },
};

export const useCompare = store.useStore;
