import { SkipLink } from "@bluesigns/ui";

export const FocusedDefault = () => (
  <div style={{ maxWidth: 640 }}>
    {/* Visually hidden until focused (autoFocus shows it here); jumps to #main. */}
    <SkipLink autoFocus />
    <header className="flex items-center justify-between rounded-xl bg-surface px-5 py-4 shadow-card">
      <span className="text-heading-sm">BlueSigns</span>
      <nav className="flex gap-4 text-label text-fg-muted">
        <span>Shop</span>
        <span>Deals</span>
        <span>Orders</span>
      </nav>
    </header>
    <main id="main" className="mt-4 rounded-xl bg-surface p-5 shadow-card" style={{ minHeight: 200 }}>
      <h1 className="text-heading-md">New arrivals</h1>
    </main>
  </div>
);

export const CustomTarget = () => (
  <div style={{ maxWidth: 640 }}>
    <SkipLink targetId="results" autoFocus>
      Skip to search results
    </SkipLink>
    <header className="flex items-center justify-between rounded-xl bg-surface px-5 py-4 shadow-card">
      <span className="text-heading-sm">BlueSigns</span>
      <nav className="flex gap-4 text-label text-fg-muted">
        <span>Shop</span>
        <span>Deals</span>
        <span>Orders</span>
      </nav>
    </header>
    <main id="results" className="mt-4 rounded-xl bg-surface p-5 shadow-card" style={{ minHeight: 200 }}>
      <h1 className="text-heading-md">Results for “running shoes”</h1>
    </main>
  </div>
);
