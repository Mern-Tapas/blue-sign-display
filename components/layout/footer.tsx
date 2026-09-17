import Link from "next/link";
import { CookieSettingsLink } from "@/components/support/cookie-settings-link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";
import { BrandMark } from "./brand-mark";

type FooterColumn = { title: string; links: { label: string; href: string }[] };

const defaultColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Best sellers", href: "/shop?sort=rating" },
      { label: "Sale", href: "/shop?sale=1" },
      { label: "Gift cards", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Order status", href: "/account/orders" },
      { label: "Delivery", href: "/help?topic=delivery" },
      { label: "Returns & refunds", href: "/help?topic=returns" },
      { label: "Help center", href: "/help" },
      { label: "Contact us", href: "/help#contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Journal", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Design system", href: "/design-system" },
    ],
  },
];

/** Brand icons are inline SVGs — lucide-react v1 ships no logos. */
const socials: { label: string; path: string; href?: string }[] = [
  {
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.1-9.5a1.1 1.1 0 1 0 0 2.3 1.1 1.1 0 0 0 0-2.3Z",
  },
  {
    label: "X",
    path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z",
  },
  {
    label: "YouTube",
    path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z",
  },
];

export type FooterProps = {
  columns?: FooterColumn[];
  /** Slot above the link grid, typically <NewsletterSignup />. */
  newsletter?: React.ReactNode;
  className?: string;
};

export function Footer({ columns = defaultColumns, newsletter, className }: FooterProps) {
  return (
    <footer className={cn("px-(--gutter) pb-4", className)}>
      <div className="mx-auto max-w-(--container-max) rounded-2xl bg-surface-contrast p-6 text-fg-on-contrast sm:p-10">
        {newsletter && <div className="mb-10 border-b border-edge-on-color pb-10">{newsletter}</div>}
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <BrandMark inverted />
            <p className="max-w-xs text-body text-fg-on-contrast-muted">
              Considered everyday goods, delivered across India. 14-day easy returns and Cash on Delivery.
            </p>
            <ul className="flex gap-2" aria-label="Social channels">
              {socials.map((s) => {
                const icon = (
                  <svg viewBox="0 0 24 24" aria-hidden className="size-icon-md fill-current">
                    <path d={s.path} />
                  </svg>
                );
                const cls = "flex size-control-md items-center justify-center rounded-pill bg-tile-on-color text-fg-on-contrast";
                return (
                  <li key={s.label}>
                    {/* Demo brand has no real profiles: render labelled icons, never dead "#" links */}
                    {s.href ? (
                      <a
                        href={s.href}
                        aria-label={s.label}
                        className={`${cls} press transition-[background-color,transform] duration-(--dur-fast) hover:bg-tile-on-color-hover`}
                      >
                        {icon}
                      </a>
                    ) : (
                      <span role="img" aria-label={s.label} className={cls}>
                        {icon}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-4 text-label text-fg-on-contrast">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-body text-fg-on-contrast-muted transition-colors duration-(--dur-fast) hover:text-fg-on-contrast">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-edge-on-color pt-6 text-caption text-fg-on-contrast-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>© 2026 BlueSigns Goods. Demo store.</p>
            <Link href="/help#privacy" className="transition-colors duration-(--dur-fast) hover:text-fg-on-contrast">
              Privacy
            </Link>
            <CookieSettingsLink className="transition-colors duration-(--dur-fast) hover:text-fg-on-contrast" />
          </div>
          <ThemeToggle variant="segmented" tone="contrast" className="bg-tile-on-color" />
          <div className="flex flex-wrap gap-2">
            {["UPI", "RuPay", "Visa", "Mastercard", "Net banking", "Cash on Delivery"].map((p) => (
              <span key={p} className="rounded-xs bg-tile-on-color px-2 py-1 text-caption text-fg-on-contrast-muted">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
