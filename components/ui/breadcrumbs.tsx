import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = { label: string; href?: string };

export type BreadcrumbsProps = React.ComponentProps<"nav"> & { items: BreadcrumbItem[] };

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav data-slot="breadcrumbs" aria-label="Breadcrumb" className={cn("text-label font-normal", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-fg-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hit-area relative rounded-xs transition-colors duration-(--dur-fast) hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-fg")}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-icon-sm text-fg-subtle" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
