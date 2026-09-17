import {
  Button,
  Field,
  IconButton,
  icons,
  Input,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@bluesigns/ui";

const { Link2, Mail, MapPin, MessageCircle, Share2, Truck } = icons;

export const FooterButtons = () => (
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

export const ActionThatCloses = () => (
  <Popover defaultOpen>
    <PopoverTrigger asChild>
      <IconButton label="Share product">
        <Share2 aria-hidden />
      </IconButton>
    </PopoverTrigger>
    <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
      <p className="text-body-strong">Share Aura Wireless Headphones</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" leadingIcon={<MessageCircle aria-hidden />}>
          WhatsApp
        </Button>
        <Button variant="secondary" size="sm" leadingIcon={<Mail aria-hidden />}>
          Email
        </Button>
        <PopoverClose asChild>
          <Button variant="secondary" size="sm" leadingIcon={<Link2 aria-hidden />}>
            Copy
          </Button>
        </PopoverClose>
      </div>
    </PopoverContent>
  </Popover>
);
