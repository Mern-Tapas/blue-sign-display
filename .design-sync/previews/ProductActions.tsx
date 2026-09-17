import { useState } from "react";
import { ProductActions, sampleData, SizeSelector } from "@bluesigns/ui";

const { getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const hoodie = getProduct("fleece-hoodie")!;

export const Default = () => (
  <div style={{ maxWidth: 520 }}>
    <ProductActions product={headphones} color="Violet" />
  </div>
);

// Sized products call onMissingSize instead of adding when no size is chosen; the page shows the
// SizeSelector error there.
function WithSizeSelector() {
  const [size, setSize] = useState<string>();
  const [error, setError] = useState<string | undefined>("Select a size to continue");
  return (
    <div className="flex flex-col gap-5" style={{ maxWidth: 520 }}>
      <SizeSelector
        sizes={hoodie.sizes!.map((s) => ({ value: s }))}
        value={size}
        onValueChange={(s) => {
          setSize(s);
          setError(undefined);
        }}
        error={error}
      />
      <ProductActions product={hoodie} color="Graphite" size={size} onMissingSize={() => setError("Select a size to continue")} />
    </div>
  );
}

export const MissingSize = () => <WithSizeSelector />;

export const RowLayout = () => (
  <div style={{ maxWidth: 380 }}>
    <ProductActions product={headphones} layout="row" />
  </div>
);
