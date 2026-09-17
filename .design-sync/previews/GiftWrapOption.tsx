import { useState } from "react";
import { GiftWrapOption } from "@bluesigns/ui";

type GiftWrap = { enabled: boolean; message: string; to: string; from: string };

function GiftWrapDemo({ initial }: { initial: GiftWrap }) {
  const [value, setValue] = useState<GiftWrap>(initial);
  return (
    <div style={{ maxWidth: 420 }}>
      <GiftWrapOption value={value} onChange={(patch) => setValue((v) => ({ ...v, ...patch }))} />
    </div>
  );
}

export const Enabled = () => (
  <GiftWrapDemo initial={{ enabled: true, to: "Ananya", from: "Sujon", message: "Happy birthday! Hope these keep the music going." }} />
);

export const Off = () => <GiftWrapDemo initial={{ enabled: false, to: "", from: "", message: "" }} />;

export const EnabledEmpty = () => <GiftWrapDemo initial={{ enabled: true, to: "", from: "", message: "" }} />;
