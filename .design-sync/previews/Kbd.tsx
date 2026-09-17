import { Kbd } from "@bluesigns/ui";

export const InText = () => (
  <p className="text-body text-fg-muted">
    Press <Kbd>/</Kbd> to search, <Kbd>Esc</Kbd> to close.
  </p>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <Kbd size="sm">↵</Kbd>
    <Kbd size="sm">Esc</Kbd>
    <Kbd>↵</Kbd>
    <Kbd>Esc</Kbd>
    <Kbd>Ctrl</Kbd>
  </div>
);

export const ShortcutList = () => (
  <div className="flex flex-col gap-2" style={{ width: 280 }}>
    <div className="flex items-center justify-between text-body">
      <span>Search products</span>
      <Kbd>/</Kbd>
    </div>
    <div className="flex items-center justify-between text-body">
      <span>Next image</span>
      <Kbd>→</Kbd>
    </div>
    <div className="flex items-center justify-between text-body">
      <span>Close dialog</span>
      <Kbd>Esc</Kbd>
    </div>
  </div>
);
