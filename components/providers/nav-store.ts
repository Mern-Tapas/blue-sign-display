"use client";

import { createStore } from "@/lib/create-store";

type NavUi = { categories: boolean; search: boolean; location: boolean };

const store = createStore<NavUi>({ categories: false, search: false, location: false });

/**
 * Open state for storefront-wide panels, so any trigger (navbar, bottom nav, product page)
 * can open the one mounted instance of the category menu, search overlay or PIN dialog.
 */
export const navUi = {
  set: (panel: keyof NavUi, open: boolean) => store.set((s) => ({ ...s, [panel]: open })),
  open: (panel: keyof NavUi) => store.set((s) => ({ ...s, [panel]: true })),
};

export const useNavUi = store.useStore;
