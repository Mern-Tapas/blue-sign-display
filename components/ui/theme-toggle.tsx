"use client";

import { useLayoutEffect } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useThemePreference } from "@/components/providers/theme-store";
import { applyTheme, readThemePreference, type ThemePreference } from "@/lib/theme";
import { IconButton } from "./icon-button";
import { SegmentedControl } from "./segmented-control";

const order: ThemePreference[] = ["light", "dark", "system"];
const icons = { light: Sun, dark: Moon, system: Monitor } as const;

export type ThemeToggleProps = {
  variant?: "icon" | "segmented";
  /** Segmented only: "contrast" for dark panels such as the footer. */
  tone?: "default" | "contrast";
  className?: string;
};

export function ThemeToggle({ variant = "icon", tone = "default", className }: ThemeToggleProps) {
  const { preference, setPreference } = useThemePreference();

  // React Strict Mode (dev) resets <html> attributes on remount — re-apply before paint.
  useLayoutEffect(() => {
    applyTheme(readThemePreference());
  }, []);

  if (variant === "segmented") {
    return (
      <SegmentedControl
        aria-label="Color theme"
        size="sm"
        variant={tone === "contrast" ? "contrast" : undefined}
        active={tone === "contrast" ? "contrast" : undefined}
        className={className}
        value={preference ?? ""}
        onValueChange={(v) => setPreference(v as ThemePreference)}
        options={order.map((p) => {
          const Icon = icons[p];
          return { value: p, label: null, icon: <Icon aria-hidden />, ariaLabel: `${p} theme` };
        })}
      />
    );
  }

  const current = preference ?? "system";
  const Icon = icons[current];
  const next = order[(order.indexOf(current) + 1) % order.length];
  return (
    <IconButton
      label={`Theme: ${current}. Switch to ${next}`}
      className={className}
      onClick={() => setPreference(next)}
    >
      <Icon aria-hidden />
    </IconButton>
  );
}
