import { ProductActions, sampleData, StickyBuyBar } from "@bluesigns/ui";

const { getProduct } = sampleData;
const headphones = getProduct("aura-wireless-headphones")!;
const studio = getProduct("studio-over-ear-headphones")!; // no MRP discount

// In the app the bar is fixed above MobileBottomNav and appears once the element with `watchId`
// (the page's own ProductActions) has scrolled above the viewport. Here the watched block is parked
// above the viewport and the bar is placed in flow (`static`) inside a phone-width frame.
const ScrolledPast = ({ id }: { id: string }) => <div id={id} aria-hidden style={{ position: "fixed", top: -400, height: 40, width: 1 }} />;

export const Default = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-canvas pt-10" style={{ width: 460 }}>
    <ScrolledPast id="pdp-actions-headphones" />
    <StickyBuyBar watchId="pdp-actions-headphones" price={headphones.price} compareAt={headphones.compareAt} className="static lg:block">
      <ProductActions product={headphones} color="Violet" layout="row" />
    </StickyBuyBar>
  </div>
);

export const NoDiscount = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-canvas pt-10" style={{ width: 460 }}>
    <ScrolledPast id="pdp-actions-studio" />
    <StickyBuyBar watchId="pdp-actions-studio" price={studio.price} className="static lg:block">
      <ProductActions product={studio} layout="row" />
    </StickyBuyBar>
  </div>
);
