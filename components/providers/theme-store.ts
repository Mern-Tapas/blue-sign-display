"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  readThemePreference,
  type ThemePreference,
} from "@/lib/theme";

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    if (readThemePreference() === "system") applyTheme("system");
    listener();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyTheme(readThemePreference());
      listener();
    }
  };

  media.addEventListener("change", onMedia);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onMedia);
    window.removeEventListener("storage", onStorage);
  };
}

export function setThemePreference(pref: ThemePreference) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* storage unavailable — still apply for this session */
  }
  applyTheme(pref);
  emit();
}

/** Returns `null` during SSR / before hydration so markup never mismatches. */
export function useThemePreference() {
  const preference = useSyncExternalStore<ThemePreference | null>(
    subscribe,
    readThemePreference,
    () => null,
  );
  const setPreference = useCallback((p: ThemePreference) => setThemePreference(p), []);
  return { preference, setPreference };
}
