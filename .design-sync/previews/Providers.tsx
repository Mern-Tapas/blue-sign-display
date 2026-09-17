import { useEffect } from "react";
import { AddToCartButton, Card, CardHeader, IconButton, PriceDisplay, ProductCard, Providers, Tooltip, icons, sampleData, toast } from "@bluesigns/ui";

const { Share2 } = icons;
const { products } = sampleData;

/** Providers wraps the app once (layout.tsx): tooltip timing, the cart drawer and the toast region. */
export const WrappingAProductPage = () => (
  <Providers>
    <div style={{ width: 380 }}>
      <Card>
        <CardHeader
          title={products[0]!.name}
          description={`${products[0]!.brand} · Free delivery to Bengaluru`}
          action={
            <Tooltip content="Share this product">
              <IconButton label="Share" size="sm" variant="ghost">
                <Share2 aria-hidden />
              </IconButton>
            </Tooltip>
          }
        />
        <PriceDisplay amount={products[0]!.price} compareAt={products[0]!.compareAt} showDiscount mrpLabel taxNote />
        <AddToCartButton product={products[0]!} color="Sand" openDrawer={false} />
      </Card>
    </div>
  </Providers>
);

function ToastOnMount() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      toast({ title: "Added to bag", description: `${products[2]!.name} · ₹9,499`, tone: "success", image: products[2]!.images[0], duration: 600000 });
    }, 50);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}

export const WithToast = () => (
  <Providers>
    <ToastOnMount />
    <div style={{ width: 240, height: 320 }}>
      <ProductCard product={products[2]!} />
    </div>
  </Providers>
);
