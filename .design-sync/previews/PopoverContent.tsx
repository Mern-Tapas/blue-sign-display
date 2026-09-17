import {
  Button,
  Field,
  IconButton,
  icons,
  Input,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@bluesigns/ui";

const { Info, MapPin, Ruler, Truck } = icons;

export const WithForm = () => (
  <Popover defaultOpen>
    <PopoverTrigger asChild>
      <Button variant="secondary" leadingIcon={<MapPin aria-hidden />}>
        Deliver to 560034
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-body-strong">Check delivery</p>
          <p className="text-caption text-fg-muted">Delivery dates and fees depend on your pincode.</p>
        </div>
        <Field label="Pincode">
          <Input defaultValue="560034" inputMode="numeric" maxLength={6} />
        </Field>
        <p className="flex items-center gap-2 text-caption text-success-fg">
          <Truck aria-hidden className="size-icon-md" />
          Free delivery by Fri, 19 Sept · Koramangala, Bengaluru
        </p>
        <div className="flex justify-end gap-2">
          <PopoverClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button size="sm">Apply</Button>
          </PopoverClose>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export const InfoPanel = () => (
  <Popover defaultOpen>
    <PopoverTrigger asChild>
      <Button variant="soft" leadingIcon={<Ruler aria-hidden />}>
        Size guide
      </Button>
    </PopoverTrigger>
    <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <p className="text-body-strong">Find your size</p>
      <p className="mt-1 text-caption text-fg-muted">Measure your foot from heel to longest toe.</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-caption figures">
        {[
          ["UK 7", "25.4 cm"],
          ["UK 8", "26.0 cm"],
          ["UK 9", "26.7 cm"],
        ].map(([size, length]) => (
          <span key={size} className="flex flex-col rounded-sm bg-surface-sunken px-2 py-2">
            <span className="text-label">{size}</span>
            {length}
          </span>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

export const AlignedToAnchor = () => (
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
