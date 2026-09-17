"use client";

import { useSyncExternalStore } from "react";

type Options<T> = {
  /** localStorage key. Omit for an in-memory store (UI state shared between components). */
  storageKey?: string;
  /** Guards against malformed or outdated stored data. */
  parse?: (raw: unknown) => T;
};

/**
 * Tiny external store (the cart-store pattern, generalised): module-level state, optional
 * localStorage persistence synced across tabs, and a hook built on useSyncExternalStore
 * whose server snapshot is always `initial` — so SSR and hydration never mismatch.
 */
export function createStore<T>(initial: T, { storageKey, parse }: Options<T> = {}) {
  const listeners = new Set<() => void>();
  let state: T | null = null;

  function load(): T {
    if (!storageKey) return initial;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return initial;
      const value = JSON.parse(raw) as unknown;
      return parse ? parse(value) : (value as T);
    } catch {
      return initial;
    }
  }

  function get(): T {
    if (state === null) state = load();
    return state;
  }

  function set(next: T | ((prev: T) => T)) {
    state = typeof next === "function" ? (next as (prev: T) => T)(get()) : next;
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        /* quota / private mode */
      }
    }
    for (const l of listeners) l();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (storageKey && e.key === storageKey) {
        state = load();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useStore() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, subscribe, useStore };
}
