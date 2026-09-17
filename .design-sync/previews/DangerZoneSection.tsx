import { useEffect, useRef } from "react";
import { DangerZoneSection } from "@bluesigns/ui";

export const Default = () => (
  <div style={{ width: 620 }}>
    <DangerZoneSection />
  </div>
);

/** The confirm dialog opens from the section's own Pause store button; this preview presses it once. */
export const ConfirmPause = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return (
    <div ref={ref} style={{ width: 620, height: 520 }}>
      <DangerZoneSection />
    </div>
  );
};
