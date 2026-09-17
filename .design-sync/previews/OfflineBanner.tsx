import { OfflineBanner } from "@bluesigns/ui";

export const Offline = () => <OfflineBanner forceState="offline" className="flex" />;

export const Restored = () => <OfflineBanner forceState="restored" className="flex" />;

export const InBottomDock = () => (
  <div className="flex flex-col justify-end gap-3 rounded-2xl bg-canvas p-4" style={{ maxWidth: 420, minHeight: 240 }}>
    <p className="m-auto text-center text-body text-fg-muted">You’re browsing Running shoes. Saved items stay in your bag.</p>
    <div className="flex justify-center">
      <OfflineBanner forceState="offline" placement="inline" />
    </div>
  </div>
);
