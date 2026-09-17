import {
  Button,
  Checkbox,
  Field,
  IconButton,
  icons,
  Input,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@bluesigns/ui";

const { Info, Search, SlidersHorizontal } = icons;

export const AnchoredToField = () => (
  <Popover defaultOpen>
    <PopoverAnchor asChild>
      <div className="flex items-end gap-2" style={{ maxWidth: 380 }}>
        <Field label="Coupon code" className="flex-1">
          <Input defaultValue="FESTIVE250" />
        </Field>
        <PopoverTrigger asChild>
          <IconButton label="How coupons work" variant="ghost">
            <Info aria-hidden />
          </IconButton>
        </PopoverTrigger>
      </div>
    </PopoverAnchor>
    <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <p className="text-body-strong">How coupons work</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-caption text-fg-muted">
        <li>One coupon per order, applied before bank offers.</li>
        <li>FESTIVE250 needs a minimum bag value of ₹1,499.</li>
        <li>Savings are refunded proportionally on returns.</li>
      </ul>
    </PopoverContent>
  </Popover>
);

export const AnchoredToSearch = () => (
  <Popover defaultOpen>
    <PopoverAnchor asChild>
      <div className="flex items-center gap-2 rounded-pill bg-surface-sunken px-4 py-2" style={{ maxWidth: 420 }}>
        <Search aria-hidden className="size-icon-md text-fg-muted" />
        <span className="flex-1 text-body text-fg-muted">Search headphones, sneakers…</span>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" leadingIcon={<SlidersHorizontal aria-hidden />}>
            Filters
          </Button>
        </PopoverTrigger>
      </div>
    </PopoverAnchor>
    <PopoverContent className="w-96" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <p className="text-body-strong">Refine search</p>
      <div className="mt-3 flex flex-col gap-2">
        <Checkbox label="BlueSigns Assured only" defaultChecked />
        <Checkbox label="Free delivery" defaultChecked />
        <Checkbox label="4★ & above" />
      </div>
    </PopoverContent>
  </Popover>
);
