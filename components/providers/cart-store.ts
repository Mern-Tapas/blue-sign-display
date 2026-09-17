"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAt?: number;
  quantity: number;
  color?: string;
  size?: string;
};

type CartState = { items: CartItem[]; open: boolean };

const STORAGE_KEY = "ds-cart";
const SERVER_STATE: CartState = { items: [], open: false };
const listeners = new Set<() => void>();
let state: CartState | null = null;

function load(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return { items: Array.isArray(items) ? items : [], open: false };
  } catch {
    return { items: [], open: false };
  }
}

function getState(): CartState {
  if (state === null) state = load();
  return state;
}

function set(next: CartState) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.items));
  } catch {
    /* ignore quota / private mode */
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = { ...load(), open: getState().open };
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }, { open = true } = {}) {
    const s = getState();
    const key = [item.productId, item.color, item.size].filter(Boolean).join(":");
    const qty = item.quantity ?? 1;
    const exists = s.items.some((i) => i.key === key);
    const items = exists
      ? s.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(99, i.quantity + qty) } : i))
      : [...s.items, { ...item, key, quantity: qty }];
    set({ items, open: open || s.open });
  },
  setQuantity(key: string, quantity: number) {
    const s = getState();
    set({ ...s, items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)) });
  },
  /** Change a line's size; merges with an existing line of the same variant. */
  setSize(key: string, size: string) {
    const s = getState();
    const line = s.items.find((i) => i.key === key);
    if (!line) return;
    const nextKey = [line.productId, line.color, size].filter(Boolean).join(":");
    const others = s.items.filter((i) => i.key !== key);
    const existing = others.find((i) => i.key === nextKey);
    const items = existing
      ? others.map((i) => (i.key === nextKey ? { ...i, quantity: Math.min(99, i.quantity + line.quantity) } : i))
      : s.items.map((i) => (i.key === key ? { ...i, size, key: nextKey } : i));
    set({ ...s, items });
  },
  remove(key: string) {
    const s = getState();
    set({ ...s, items: s.items.filter((i) => i.key !== key) });
  },
  clear() {
    set({ ...getState(), items: [] });
  },
  setOpen(open: boolean) {
    set({ ...getState(), open });
  },
};

export function useCart() {
  const s = useSyncExternalStore(subscribe, getState, () => SERVER_STATE);
  const count = s.items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = s.items.reduce((n, i) => n + i.price * i.quantity, 0);
  const savings = s.items.reduce((n, i) => n + ((i.compareAt ?? i.price) - i.price) * i.quantity, 0);
  return { items: s.items, open: s.open, count, subtotal, savings };
}
