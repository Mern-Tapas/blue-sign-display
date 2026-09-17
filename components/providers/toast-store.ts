"use client";

import { useSyncExternalStore } from "react";

export type ToastTone = "neutral" | "success" | "danger" | "info" | "accent";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Optional action button, e.g. { label: "Undo", onClick } */
  action?: { label: string; onClick: () => void };
  /** Optional image/thumbnail URL (e.g. product added to cart). */
  image?: string;
  duration?: number;
  open: boolean;
};

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
const EMPTY: ToastItem[] = [];
let counter = 0;

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toast(input: Omit<ToastItem, "id" | "open">) {
  const id = `t${++counter}`;
  toasts = [...toasts.slice(-4), { ...input, id, open: true }];
  emit();
  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  emit();
  // Remove after the exit animation has finished.
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 250);
}

export function useToasts() {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => EMPTY,
  );
}
