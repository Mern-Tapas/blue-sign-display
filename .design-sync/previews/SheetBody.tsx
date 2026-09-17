import {
  Badge,
  Button,
  Checkbox,
  formatPrice,
  icons,
  PriceDisplay,
  ProductImage,
  sampleData,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
  Switch,
} from "@bluesigns/ui";

const { ShoppingBag, SlidersHorizontal } = icons;

const { products } = sampleData;
const bag = [products[0]!, products[4]!, products[8]!];
const subtotal = bag.reduce((sum, p) => sum + p.price, 0);

export const ProductList = () => (
  <Sheet defaultOpen>
    <SheetTrigger asChild>
      <Button variant="secondary" leadingIcon={<ShoppingBag aria-hidden />}>
        Bag (3)
      </Button>
    </SheetTrigger>
    <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <SheetHeader title="Your bag" description="3 items · delivering to 560034" />
      <SheetBody>
        <ul className="flex flex-col gap-4 pb-4">
          {bag.map((p) => (
            <li key={p.id} className="flex gap-3">
              <ProductImage src={p.images[0]!} alt={p.name} sizes="64px" wrapperClassName="size-16 shrink-0 rounded-md" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="line-clamp-1 text-body-strong">{p.name}</p>
                <p className="text-caption text-fg-muted">{p.brand} · Qty 1</p>
                <PriceDisplay amount={p.price} compareAt={p.compareAt} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      </SheetBody>
      <SheetFooter>
        <div className="flex items-center justify-between text-body">
          <span className="text-fg-muted">Subtotal</span>
          <span className="text-body-strong figures">{formatPrice(subtotal)}</span>
        </div>
        <Button fullWidth size="lg">
          Checkout
        </Button>
        <SheetClose asChild>
          <Button fullWidth variant="ghost">
            Continue shopping
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const FilterGroups = () => (
  <Sheet defaultOpen>
    <SheetTrigger asChild>
      <Button variant="secondary" leadingIcon={<SlidersHorizontal aria-hidden />}>
        Filters
      </Button>
    </SheetTrigger>
    <SheetContent side="left" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <SheetHeader title="Filters" description="128 products in Footwear">
        <div className="flex flex-wrap gap-1.5 pt-2">
          <Badge tone="accent">Stride</Badge>
          <Badge tone="accent">Under ₹5,000</Badge>
        </div>
      </SheetHeader>
      <SheetBody className="flex flex-col gap-5 pb-4">
        <fieldset className="flex flex-col gap-2.5">
          <legend className="pb-2 text-label">Brand</legend>
          <Checkbox label="Stride" defaultChecked />
          <Checkbox label="Hale &amp; Co" />
          <Checkbox label="Common Thread" />
        </fieldset>
        <fieldset className="flex flex-col gap-2.5">
          <legend className="pb-2 text-label">Price</legend>
          <Checkbox label="Under ₹2,000" />
          <Checkbox label="₹2,000 – ₹5,000" defaultChecked />
          <Checkbox label="Above ₹5,000" />
        </fieldset>
        <Switch label="BlueSigns Assured only" defaultChecked />
      </SheetBody>
      <SheetFooter className="grid grid-cols-2">
        <Button variant="secondary">Clear all</Button>
        <SheetClose asChild>
          <Button>Show 42 results</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const SizeGrid = () => (
  <Sheet defaultOpen>
    <SheetTrigger asChild>
      <Button>Add to bag</Button>
    </SheetTrigger>
    <SheetContent side="bottom" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <SheetHeader title="Select a size" description="Velocity Runner · UK sizes · fits true to size" />
      <SheetBody className="pb-4">
        <div className="grid grid-cols-6 gap-2">
          {["6", "7", "8", "9", "10", "11"].map((s) => (
            <span
              key={s}
              className={
                s === "8"
                  ? "flex h-control-md items-center justify-center rounded-pill bg-surface-inverse text-label text-fg-inverse"
                  : s === "11"
                    ? "flex h-control-md items-center justify-center rounded-pill border border-border text-label text-disabled-fg line-through"
                    : "flex h-control-md items-center justify-center rounded-pill border border-border text-label"
              }
            >
              UK {s}
            </span>
          ))}
        </div>
      </SheetBody>
      <SheetFooter>
        <SheetClose asChild>
          <Button fullWidth size="lg" leadingIcon={<ShoppingBag aria-hidden />}>
            Add UK 8 to bag · ₹4,999
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
