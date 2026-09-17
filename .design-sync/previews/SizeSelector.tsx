import { useState } from "react";
import { sampleData, SizeSelector } from "@bluesigns/ui";

const { getProduct, sizeChart } = sampleData;
const hoodie = getProduct("fleece-hoodie")!;
const runner = getProduct("velocity-runner-red")!;

// Per-size stock: M sold out, XL nearly gone.
const hoodieSizes = hoodie.sizes!.map((s, i) => ({ value: s, stock: i === 1 ? 0 : i === hoodie.sizes!.length - 1 ? 2 : 12 }));

function Controlled({ initial, error }: { initial?: string; error?: string }) {
  const [size, setSize] = useState<string | undefined>(initial);
  return (
    <div style={{ maxWidth: 480 }}>
      <SizeSelector
        sizes={hoodieSizes}
        value={size}
        onValueChange={setSize}
        error={size ? undefined : error}
        chart={{ ...sizeChart.apparel, measureColumns: [1, 2, 3], baseUnit: "in" }}
        fitNote="Regular fit. Between sizes? Size up for a relaxed look."
      />
    </div>
  );
}

export const Selected = () => <Controlled initial="L" />;

export const MissingSizeError = () => <Controlled error="Select a size to continue" />;

export const Footwear = () => {
  const [size, setSize] = useState<string>();
  return (
    <div style={{ maxWidth: 580 }}>
      <SizeSelector
        label="Select size (EU)"
        sizes={runner.sizes!.map((s, i) => ({ value: s, label: s, stock: i === 0 || i === 5 ? 0 : i === 3 ? 1 : 8 }))}
        value={size}
        onValueChange={setSize}
        chart={{ ...sizeChart.footwear, measureColumns: [], baseUnit: "cm" }}
        fitNote="True to size. Foot length in centimetres."
      />
    </div>
  );
};

export const Volumes = () => {
  const [size, setSize] = useState("50ml");
  return (
    <div style={{ maxWidth: 480 }}>
      <SizeSelector label="Size" sizes={[{ value: "30ml" }, { value: "50ml" }, { value: "100ml", stock: 3 }]} value={size} onValueChange={setSize} />
    </div>
  );
};
