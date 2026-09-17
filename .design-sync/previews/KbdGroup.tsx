import { KbdGroup } from "@bluesigns/ui";

export const Default = () => <KbdGroup keys={["Ctrl", "K"]} />;

export const Sizes = () => (
  <div className="flex items-center gap-4">
    <KbdGroup keys={["Shift", "?"]} size="sm" />
    <KbdGroup keys={["Ctrl", "Shift", "P"]} />
  </div>
);

export const CommandHints = () => (
  <div className="flex flex-col gap-2" style={{ width: 300 }}>
    <div className="flex items-center justify-between text-body">
      <span>Open command palette</span>
      <KbdGroup keys={["Ctrl", "K"]} size="sm" />
    </div>
    <div className="flex items-center justify-between text-body">
      <span>New product</span>
      <KbdGroup keys={["Alt", "N"]} size="sm" />
    </div>
    <div className="flex items-center justify-between text-body">
      <span>Keyboard shortcuts</span>
      <KbdGroup keys={["Shift", "?"]} size="sm" />
    </div>
  </div>
);
