import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type SectionHeaderProps = {
  title: string;
  muted?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
};

/** Storefront section heading — title with muted phrase and an optional "View all" pill link. */
export function SectionHeader({ title, muted, description, href, linkLabel = "View all", className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-heading-lg sm:text-display-lg">
          {title}
          {muted && <span className="text-fg-muted"> {muted}</span>}
        </h2>
        {description && <p className="mt-2 max-w-xl text-body-lg text-fg-muted">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex h-10 items-center gap-2 rounded-pill bg-surface pr-1.5 pl-4 text-label shadow-xs transition-shadow duration-(--dur-fast) hover:shadow-popover"
        >
          {linkLabel}
          <span className="flex size-7 items-center justify-center rounded-pill bg-surface-inverse text-fg-inverse transition-transform duration-(--dur-fast) group-hover:rotate-45">
            <ArrowUpRight aria-hidden className="size-icon-sm" />
          </span>
        </Link>
      )}
    </div>
  );
}
