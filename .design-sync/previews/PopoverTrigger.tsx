import {
  Button,
  IconButton,
  icons,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@bluesigns/ui";

const { Link2, Mail, MessageCircle, Ruler, Share2 } = icons;

export const ButtonTrigger = () => (
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

export const IconButtonTrigger = () => (
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
