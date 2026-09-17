import { BackToTop } from "@bluesigns/ui";

// BackToTop is `fixed` and appears once the page is scrolled past `threshold`.
// threshold={-1} keeps it visible for the preview; `relative` pins it into the cell.
export const Visible = () => (
  <div className="pt-6 pl-4">
    <BackToTop threshold={-1} className="relative" />
  </div>
);

export const CustomLabel = () => (
  <div className="pt-6 pl-4">
    <BackToTop threshold={-1} label="Back to filters" targetId="filters" className="relative" />
  </div>
);

export const OnPage = () => (
  <div className="relative overflow-hidden rounded-xl bg-surface p-4 shadow-flat" style={{ maxWidth: 420, height: 240 }}>
    <p className="text-title">Headphones</p>
    <p className="text-body text-fg-muted">Showing 48 of 212 products</p>
    <div className="mt-4 grid grid-cols-3 gap-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="aspect-square rounded-lg bg-surface-sunken" />
      ))}
    </div>
    <BackToTop threshold={-1} className="absolute right-4 bottom-4" />
  </div>
);
