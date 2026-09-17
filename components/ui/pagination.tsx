import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** Page numbers with ellipses, e.g. [1, "…", 4, 5, 6, "…", 12]. */
export function paginationRange(page: number, pageCount: number, siblings = 1): (number | "ellipsis")[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeftDots = left > 3;
  const showRightDots = right < pageCount - 2;
  if (!showLeftDots) {
    const count = 3 + siblings * 2;
    return [...Array.from({ length: count }, (_, i) => i + 1), "ellipsis", pageCount];
  }
  if (!showRightDots) {
    const count = 3 + siblings * 2;
    return [1, "ellipsis", ...Array.from({ length: count }, (_, i) => pageCount - count + i + 1)];
  }
  return [1, "ellipsis", ...Array.from({ length: right - left + 1 }, (_, i) => left + i), "ellipsis", pageCount];
}

export type PaginationProps = {
  page: number;
  pageCount: number;
  /** Link mode — preferred for crawlable listing pages. */
  hrefFor?: (page: number) => string;
  /** Button mode — for client-side lists. */
  onPageChange?: (page: number) => void;
  siblings?: number;
  className?: string;
  /** Show "Showing 1–12 of 96" summary on the left. */
  summary?: React.ReactNode;
};

const itemCls =
  "inline-flex h-control-md min-w-control-md items-center justify-center gap-1.5 state-layer press relative rounded-pill px-3 text-label text-fg-muted transition-[color,background-color,transform] duration-(--dur-fast) hover:text-fg figures aria-[current=page]:bg-surface-inverse aria-[current=page]:text-fg-inverse aria-disabled:pointer-events-none aria-disabled:text-disabled-fg";

function PageItem({
  page,
  hrefFor,
  onPageChange,
  disabled,
  current,
  label,
  children,
}: {
  page: number;
  hrefFor?: PaginationProps["hrefFor"];
  onPageChange?: PaginationProps["onPageChange"];
  disabled?: boolean;
  current?: boolean;
  label?: string;
  children: React.ReactNode;
}) {
  const common = {
    className: itemCls,
    "aria-label": label,
    "aria-current": current ? ("page" as const) : undefined,
    "aria-disabled": disabled || undefined,
  };
  if (hrefFor) {
    return disabled ? (
      <span {...common}>{children}</span>
    ) : (
      <Link href={hrefFor(page)} scroll={false} {...common}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled} onClick={() => onPageChange?.(page)} {...common}>
      {children}
    </button>
  );
}

export function Pagination({ page, pageCount, hrefFor, onPageChange, siblings = 1, className, summary }: PaginationProps) {
  if (pageCount <= 1 && !summary) return null;
  const range = paginationRange(page, pageCount, siblings);
  return (
    <nav
      data-slot="pagination"
      aria-label="Pagination"
      className={cn("flex flex-col items-center gap-3 sm:flex-row sm:justify-between", className)}
    >
      {summary && <p className="text-label text-fg-muted">{summary}</p>}
      <ul className="flex items-center gap-1 rounded-pill bg-surface p-1 shadow-flat">
        <li>
          <PageItem page={page - 1} hrefFor={hrefFor} onPageChange={onPageChange} disabled={page <= 1} label="Previous page">
            <ChevronLeft aria-hidden className="size-4" />
            <span className="hidden sm:inline">Prev</span>
          </PageItem>
        </li>
        {range.map((p, i) =>
          p === "ellipsis" ? (
            <li key={`e${i}`} aria-hidden className="hidden h-10 min-w-8 items-center justify-center text-fg-subtle sm:flex">
              …
            </li>
          ) : (
            <li key={p} className={cn(Math.abs(p - page) > 1 && p !== 1 && p !== pageCount && "hidden sm:block")}>
              <PageItem page={p} hrefFor={hrefFor} onPageChange={onPageChange} current={p === page} label={`Page ${p}`}>
                {p}
              </PageItem>
            </li>
          ),
        )}
        <li>
          <PageItem page={page + 1} hrefFor={hrefFor} onPageChange={onPageChange} disabled={page >= pageCount} label="Next page">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight aria-hidden className="size-4" />
          </PageItem>
        </li>
      </ul>
    </nav>
  );
}
