"use client";

import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/cn";
import { DsCode } from "./ds-code";

type PreviewTheme = "inherit" | "light" | "dark";

const themeOptions: { value: PreviewTheme; label: string; icon: typeof Sun }[] = [
  { value: "inherit", label: "Page theme", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

/**
 * Flat preview frame for component demos.
 * - Title row with a per-preview theme switch (scoped `data-theme` — tokens re-resolve inside).
 * - Optional copyable code snippet.
 * Portaled overlays (dialogs, menus) follow the page theme, not the scoped preview theme.
 */
export function DsPreview({
  label,
  children,
  className,
  surface = "canvas",
  align = "center",
  minHeight = false,
  code,
  overflowVisible = false,
  themeToggle = true,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  /** Stage colour. Canvas (default) lets white cards and fields read as they do on a page. */
  surface?: "surface" | "canvas" | "sunken";
  /** Content alignment on the stage. */
  align?: "center" | "start";
  /** Reserve a comfortable stage height for small components. */
  minHeight?: boolean;
  /** Usage snippet shown under the preview with a copy button. */
  code?: string;
  /** Let menus/popovers escape the preview frame. */
  overflowVisible?: boolean;
  themeToggle?: boolean;
}) {
  const [theme, setTheme] = useState<PreviewTheme>("inherit");
  const scoped = theme === "inherit" ? undefined : theme;

  return (
    <div
      data-slot="ds-preview"
      className={cn("flex flex-col rounded-2xl bg-surface shadow-flat", !overflowVisible && "overflow-hidden")}
    >
      {label && (
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-border-subtle py-1.5 pr-1.5 pl-5">
          <p className="text-label text-fg">{label}</p>
          {themeToggle && (
            <SegmentedControl
              aria-label={`Preview theme for ${label}`}
              size="sm"
              value={theme}
              onValueChange={(v) => setTheme(v as PreviewTheme)}
              className="[&_button]:w-7 [&_button]:px-0"
              options={themeOptions.map(({ value, label: optionLabel, icon: Icon }) => ({
                value,
                label: null,
                ariaLabel: optionLabel,
                icon: <Icon aria-hidden className="size-icon-sm!" />,
              }))}
            />
          )}
        </div>
      )}
      <div
        data-theme={scoped}
        className={cn(
          "flex flex-1 flex-wrap gap-4 p-6 text-fg transition-colors duration-(--dur-base)",
          align === "center" ? "items-center" : "items-start",
          minHeight && "min-h-40 justify-center",
          surface === "surface" && "bg-surface",
          surface === "canvas" && "bg-canvas",
          surface === "sunken" && "bg-surface-sunken",
          !code && "rounded-b-2xl",
          !label && "rounded-t-2xl",
          className,
        )}
      >
        {children}
      </div>
      {code && <DsCode code={code} className="border-t border-border-subtle" />}
    </div>
  );
}
