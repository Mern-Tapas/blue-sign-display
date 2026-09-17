import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/cn";

const bannerVariants = cva("relative isolate flex overflow-hidden", {
  variants: {
    variant: {
      /** Full promotional block with hatched decoration. */
      hero: "flex-col gap-6 rounded-2xl bg-accent p-6 text-fg-on-accent sm:p-10 md:flex-row md:items-center md:justify-between",
      contrast:
        "flex-col gap-6 rounded-2xl bg-surface-contrast p-6 text-fg-on-contrast sm:p-10 md:flex-row md:items-center md:justify-between",
      /** Thin announcement strip above the navbar. */
      strip: "items-center justify-center gap-3 bg-surface-contrast px-10 py-2 text-caption text-fg-on-contrast",
    },
  },
  defaultVariants: { variant: "hero" },
});

export type PromoBannerProps = Omit<React.ComponentProps<"section">, "title"> &
  VariantProps<typeof bannerVariants> & {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    code?: string;
    action?: React.ReactNode;
    /** Strip only — renders a dismiss button (client wrapper supplies handler). */
    onDismiss?: () => void;
  };

export function PromoBanner({ variant = "hero", eyebrow, title, description, code, action, onDismiss, className, ...props }: PromoBannerProps) {
  if (variant === "strip") {
    return (
      <section data-slot="promo-banner" className={cn(bannerVariants({ variant }), className)} {...props}>
        <p>
          <span className="font-medium">{title}</span>
          {description && <span className="text-fg-on-contrast-muted max-sm:hidden"> {description}</span>}
        </p>
        {code && <span className="rounded-xs bg-tile-on-color px-1.5 py-0.5 text-code">{code}</span>}
        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={onDismiss}
            className="hit-area absolute right-3 rounded-xs text-fg-on-contrast-muted transition-colors duration-(--dur-fast) hover:text-fg-on-contrast"
          >
            <X aria-hidden className="size-icon-md" />
          </button>
        )}
      </section>
    );
  }

  return (
    <section data-slot="promo-banner" className={cn(bannerVariants({ variant }), className)} {...props}>
      {/* Hatched decorative bars — a nod to the striped charts in the references */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 items-end justify-end gap-3 pr-8 opacity-40 md:flex">
        {[45, 70, 55, 90, 65].map((h, i) => (
          <span key={i} className="bg-hatch w-12 rounded-t-pill" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="max-w-xl">
        {eyebrow && (
          <p className="mb-3 inline-flex h-7 items-center rounded-pill bg-tile-on-color px-3 text-caption-strong backdrop-blur-sm">{eyebrow}</p>
        )}
        <h2 className="text-display-lg sm:text-display-xl">{title}</h2>
        {description && <p className={cn("mt-3 text-body-lg", variant === "contrast" ? "text-fg-on-contrast-muted" : "text-fg-on-accent-muted")}>{description}</p>}
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        {code && (
          <p className="flex items-center gap-2 rounded-pill border border-dashed border-edge-on-color px-4 py-2 text-label">
            Use code <span className="text-code">{code}</span>
          </p>
        )}
        {action ?? (
          <span className="inline-flex h-control-lg items-center gap-2 rounded-pill bg-white px-6 text-body-strong text-black">
            Shop the sale <ArrowUpRight aria-hidden className="size-icon-md" />
          </span>
        )}
      </div>
    </section>
  );
}
