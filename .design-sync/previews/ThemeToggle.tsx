import { ThemeToggle } from "@bluesigns/ui";

export const Icon = () => <ThemeToggle />;

export const Segmented = () => <ThemeToggle variant="segmented" />;

export const OnContrast = () => (
  <div className="flex w-fit items-center gap-4 rounded-xl bg-surface-contrast p-4">
    <span className="text-label text-fg-on-contrast">Theme</span>
    <ThemeToggle variant="segmented" tone="contrast" />
  </div>
);
