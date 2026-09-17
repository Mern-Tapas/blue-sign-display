import { Button, StickyCheckoutBar } from "@bluesigns/ui";

// In the app the bar is `fixed` and phone-only (lg:hidden); `relative lg:block` keeps it in place for this preview.
const inPlace = "relative lg:block";

export const PlaceOrder = () => (
  <div style={{ maxWidth: 480 }}>
    <StickyCheckoutBar total={18476} detailsId="bag-price-details" offset="none" className={inPlace} />
  </div>
);

export const WithSavings = () => (
  <div style={{ maxWidth: 480 }}>
    <StickyCheckoutBar total={18476} savings={7298} actionLabel="Continue" offset="none" className={inPlace} />
  </div>
);

export const Loading = () => (
  <div style={{ maxWidth: 480 }}>
    <StickyCheckoutBar total={3527} savings={500} actionLabel="Continue" loading offset="none" className={inPlace} />
  </div>
);

export const Disabled = () => (
  <div style={{ maxWidth: 480 }}>
    <StickyCheckoutBar total={12999} actionLabel="Place order" disabled offset="none" className={inPlace} />
  </div>
);

export const CustomAction = () => (
  <div style={{ maxWidth: 480 }}>
    <StickyCheckoutBar
      total={21596}
      savings={4000}
      offset="none"
      className={inPlace}
      action={
        <Button asChild size="lg" className="min-w-40">
          <a href="/checkout">Place order</a>
        </Button>
      }
    />
  </div>
);
