import Link from "next/link";
import { ProductImage } from "@/components/commerce/product-image";
import { cn } from "@/lib/cn";

export type CategoryStripItem = {
  href: string;
  label: string;
  image: string;
  /** Short tag over the image, e.g. "New" or "Sale". Keep to a word. */
  tag?: string;
};

export type CategoryStripProps = {
  items: CategoryStripItem[];
  /** href of the current category (ringed + aria-current). */
  activeHref?: string;
  /** `scroll` = one swipeable row (phones, header); `grid` = wraps into rows. */
  layout?: "scroll" | "grid";
  size?: "sm" | "md" | "lg";
  "aria-label"?: string;
  className?: string;
};

const sizes = {
  sm: { circle: "size-14", text: "text-caption", w: "w-16" },
  md: { circle: "size-18", text: "text-label", w: "w-20" },
  lg: { circle: "size-24", text: "text-body-strong", w: "w-26" },
} as const;

/** Circular category shortcuts ("Audio · Watches · Footwear"). Server-safe; labels are always visible. */
export function CategoryStrip({ items, activeHref, layout = "scroll", size = "md", "aria-label": ariaLabel = "Categories", className }: CategoryStripProps) {
  const s = sizes[size];
  return (
    <nav aria-label={ariaLabel} data-slot="category-strip" className={className}>
      <ul
        className={cn(
          "flex gap-3 sm:gap-4",
          layout === "scroll" ? "scrollbar-none -mx-(--gutter) snap-x overflow-x-auto px-(--gutter) py-1" : "flex-wrap justify-center",
        )}
      >
        {items.map((item) => {
          const active = activeHref === item.href;
          return (
            <li key={item.href} className={cn("shrink-0 snap-start", s.w)}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className="group flex flex-col items-center gap-2 rounded-lg outline-none">
                <span
                  className={cn(
                    "relative rounded-pill p-0.5 transition-[box-shadow] duration-(--dur-fast)",
                    active ? "ring-2 ring-accent" : "ring-1 ring-border-subtle group-hover:ring-border-strong",
                    "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-focus-ring",
                  )}
                >
                  <ProductImage
                    src={item.image}
                    alt=""
                    sizes="96px"
                    wrapperClassName={cn("rounded-pill", s.circle)}
                    className="transition-transform duration-(--dur-slow) ease-out motion-safe:group-hover:scale-105"
                  />
                  {item.tag && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-pill bg-accent px-1.5 text-caption-strong leading-4 whitespace-nowrap text-fg-on-accent ring-2 ring-surface">
                      {item.tag}
                    </span>
                  )}
                </span>
                <span className={cn("line-clamp-2 text-center", s.text, active ? "text-fg" : "text-fg-muted group-hover:text-fg")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
