import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type NotFoundStateProps = {
  title?: string;
  description?: string;
  /** Links shown as "Popular right now". */
  links?: { label: string; href: string }[];
  /** GET form target; the query goes in `q`. Set to null to hide search. */
  searchAction?: string | null;
  /** h2 when the page already has an h1 (docs previews). */
  headingAs?: "h1" | "h2";
  className?: string;
};

/**
 * 404 that keeps the shopper shopping: plain explanation, product search (a real GET form, so
 * it works before JavaScript), popular destinations and a way home. Server-safe.
 */
export function NotFoundState({
  title = "This page isn’t here",
  description = "The link may be old or mistyped, or the product is no longer sold. Search for what you were looking for.",
  links = [
    { label: "New arrivals", href: "/shop?sort=newest" },
    { label: "Sale", href: "/shop?sale=1" },
    { label: "Your orders", href: "/account/orders" },
    { label: "Help center", href: "/help" },
  ],
  searchAction = "/shop",
  headingAs: Heading = "h1",
  className,
}: NotFoundStateProps) {
  return (
    <div data-slot="not-found-state" className={cn("mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-16 text-center sm:py-24", className)}>
      <p aria-hidden className="text-display-xl font-light text-fg-muted figures">404</p>
      <Heading className="text-heading-lg">{title}</Heading>
      <p className="max-w-md text-body-lg text-fg-muted">{description}</p>
      {searchAction && (
        <form action={searchAction} method="get" role="search" className="mt-2 flex w-full max-w-md gap-2">
          <label htmlFor="not-found-q" className="sr-only">
            Search products
          </label>
          <span className="relative flex-1">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-icon-md -translate-y-1/2 text-fg-muted" />
            <input
              id="not-found-q"
              name="q"
              type="search"
              placeholder="Search products and brands"
              className="focus-ring-inset h-control-lg w-full rounded-pill border border-border bg-surface pr-4 pl-10 text-body text-fg placeholder:text-fg-placeholder"
            />
          </span>
          <Button type="submit" size="lg">
            Search
          </Button>
        </form>
      )}
      {links.length > 0 && (
        <nav aria-label="Popular pages" className="mt-2 flex flex-col items-center gap-2">
          <p className="text-caption text-fg-muted">Popular right now</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="state-layer inline-flex h-control-sm items-center rounded-pill bg-surface-sunken px-3 text-label text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <Button asChild variant="ghost" className="mt-2">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
