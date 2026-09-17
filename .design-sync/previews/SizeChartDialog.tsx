import { useEffect, useRef } from "react";
import { Button, icons, sampleData, SizeChartDialog } from "@bluesigns/ui";

const { Ruler } = icons;
const { sizeChart } = sampleData;

// The dialog manages its own open state; this wrapper presses the trigger so the card shows it open.
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return <span ref={ref}>{children}</span>;
}

export const Apparel = () => (
  <OpenOnMount>
    <SizeChartDialog
      chart={{ ...sizeChart.apparel, measureColumns: [1, 2, 3], baseUnit: "in" }}
      fitNote="Regular fit. Between sizes? Size up for a relaxed look."
    />
  </OpenOnMount>
);

export const Footwear = () => (
  <OpenOnMount>
    <SizeChartDialog
      title="Shoe size chart"
      chart={{ ...sizeChart.footwear, measureColumns: [], baseUnit: "cm" }}
      fitNote="True to size. Foot length in centimetres."
      howToMeasure={[
        { label: "Foot length", text: "Stand on paper with your heel against a wall and mark the tip of your longest toe. Measure heel to mark." },
        { label: "Between sizes", text: "Pick the larger size for running shoes and the smaller for sandals." },
      ]}
      trigger={
        <Button variant="secondary" size="sm" leadingIcon={<Ruler aria-hidden />}>
          Find your size
        </Button>
      }
    />
  </OpenOnMount>
);
