import { useEffect, useRef } from "react";
import { SettlementsTable, sampleData } from "@bluesigns/ui";

export const AllCycles = () => (
  <div style={{ width: 640 }}>
    <SettlementsTable rows={sampleData.settlements} />
  </div>
);

/** Opens the breakdown panel for the latest paid cycle, as a click on its row would. */
export const WithBreakdownOpen = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('table [data-row-id="STL-2608"]')?.click();
  }, []);
  return (
    <div ref={ref} style={{ width: 640 }}>
      <SettlementsTable rows={sampleData.settlements} />
    </div>
  );
};

export const Empty = () => (
  <div style={{ width: 640 }}>
    <SettlementsTable rows={[]} />
  </div>
);
