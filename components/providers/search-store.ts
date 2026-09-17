"use client";

import { createStore } from "@/lib/create-store";

const MAX_RECENT = 8;

const store = createStore<string[]>([], {
  storageKey: "ds-recent-searches",
  parse: (raw) => (Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string").slice(0, MAX_RECENT) : []),
});

/** Recent search queries, newest first, de-duplicated case-insensitively, persisted per device. */
export const recentSearches = {
  add(query: string) {
    const q = query.trim();
    if (!q) return;
    store.set((list) => [q, ...list.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX_RECENT));
  },
  remove(query: string) {
    store.set((list) => list.filter((x) => x !== query));
  },
  clear() {
    store.set([]);
  },
};

export const useRecentSearches = store.useStore;
