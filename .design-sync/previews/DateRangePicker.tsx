import { useEffect, useRef, useState } from "react";
import { DateRangePicker, sampleData } from "@bluesigns/ui";

type Range = { preset: "today" | "7d" | "30d" | "90d" | "mtd" | "qtd" | "custom"; from: string; to: string; compare?: boolean };

/** Opens the popover on mount so the card shows the preset list. */
const OpenPicker = ({ initial, comparable }: { initial: Range; comparable?: boolean }) => {
  const [range, setRange] = useState<Range>(initial);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
    // Drop the popover's initial focus ring so the preset list reads cleanly.
    const t = setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref} style={{ minHeight: 480 }}>
      <DateRangePicker value={range} onValueChange={setRange} today={sampleData.ADMIN_TODAY} comparable={comparable} />
    </div>
  );
};

export const Last30DaysCompared = () => <OpenPicker initial={{ preset: "30d", from: "2026-08-17", to: "2026-09-15", compare: true }} />;

export const CustomRange = () => <OpenPicker initial={{ preset: "custom", from: "2026-09-01", to: "2026-09-10" }} comparable={false} />;

export const Closed = () => {
  const [range, setRange] = useState<Range>({ preset: "7d", from: "2026-09-09", to: "2026-09-15" });
  return <DateRangePicker value={range} onValueChange={setRange} today={sampleData.ADMIN_TODAY} />;
};
