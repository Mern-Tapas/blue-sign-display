import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { DEFAULT_CURRENCY, discountPercent, formatPrice, priceParts } from "@/lib/format";

const priceVariants = cva("inline-flex items-baseline font-medium text-fg figures", {
  variants: {
    size: {
      sm: "text-body",
      md: "text-body-lg",
      lg: "text-heading-md",
      xl: "text-figure-lg",
      "2xl": "text-figure-xl",
    },
  },
  defaultVariants: { size: "md" },
});

export type PriceDisplayProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof priceVariants> & {
    /** Selling price, inclusive of taxes. */
    amount: number;
    /** MRP — renders struck through when higher than `amount`. */
    compareAt?: number;
    currency?: string;
    /** Mute the currency symbol + paise like the dashboard figures. */
    muteDecimals?: boolean;
    /** Show the saving as a percentage of MRP. */
    showDiscount?: boolean;
    /** `text` reads "23% off" inline (listing style); `pill` sets it in a soft chip. */
    discountStyle?: "text" | "pill";
    /** Prefix the struck price with "MRP", as Indian product pages do. */
    mrpLabel?: boolean;
    /** Adds "Inclusive of all taxes" on its own line. */
    taxNote?: boolean;
  };

export function PriceDisplay({
  amount,
  compareAt,
  currency = DEFAULT_CURRENCY,
  size,
  muteDecimals = true,
  showDiscount = false,
  discountStyle = "text",
  mrpLabel = false,
  taxNote = false,
  className,
  ...props
}: PriceDisplayProps) {
  const { symbol, whole, fraction } = priceParts(amount, currency);
  const onSale = compareAt !== undefined && compareAt > amount;
  const discount = onSale ? discountPercent(amount, compareAt) : 0;
  const large = size === "lg" || size === "xl" || size === "2xl";

  return (
    <span data-slot="price" className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)} {...props}>
      <span className={priceVariants({ size })}>
        <span className="sr-only">Price </span>
        {/* opacity (not a gray token) so muting also works on accent and contrast surfaces */}
        <span aria-hidden className={cn(muteDecimals && "opacity-50", large && "mr-0.5 text-[0.6em]")}>
          {symbol}
        </span>
        <span aria-hidden>{whole}</span>
        {fraction && (
          <span aria-hidden className={cn(muteDecimals && "opacity-50")}>
            .{fraction}
          </span>
        )}
        <span className="sr-only">{formatPrice(amount, currency)}</span>
      </span>
      {onSale && (
        <span className={cn("text-fg-muted figures", large ? "text-body-lg" : "text-body")}>
          {mrpLabel ? <span>MRP </span> : <span className="sr-only">MRP </span>}
          <s>{formatPrice(compareAt, currency)}</s>
        </span>
      )}
      {onSale && showDiscount && discount > 0 && (
        <span
          data-slot="price-discount"
          className={cn(
            "font-medium text-success-fg figures",
            discountStyle === "pill" ? "rounded-pill bg-success-soft px-2 py-0.5 text-caption" : large ? "text-body-lg" : "text-body",
          )}
        >
          {discount}% off
        </span>
      )}
      {taxNote && <span className="basis-full text-caption text-fg-muted">Inclusive of all taxes</span>}
    </span>
  );
}
