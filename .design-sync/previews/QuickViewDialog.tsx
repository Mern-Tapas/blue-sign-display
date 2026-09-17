import { useEffect, useRef } from "react";
import { Button, ProductCard, QuickViewDialog, icons, sampleData } from "@bluesigns/ui";

const { Eye } = icons;
const { getProduct } = sampleData;

// Preview only: the dialog keeps its open state internally, so click the trigger once.
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const Headphones = () => (
  <OpenOnMount>
    <QuickViewDialog product={getProduct("aura-wireless-headphones")!} />
  </OpenOnMount>
);

export const WithSizes = () => (
  <OpenOnMount>
    <QuickViewDialog
      product={getProduct("fleece-hoodie")!}
      trigger={
        <Button variant="secondary" leadingIcon={<Eye aria-hidden />}>
          Quick view
        </Button>
      }
    />
  </OpenOnMount>
);

export const OnProductCard = () => {
  const p = getProduct("pulse-smart-watch")!;
  return (
    <div style={{ maxWidth: 260 }}>
      <ProductCard product={p} imageActions={<QuickViewDialog product={p} />} />
    </div>
  );
};
