"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dsNavItems } from "./ds-nav-items";

/** Previous / next page links at the end of every docs page, in sidebar order. */
export function DsPrevNext() {
  const pathname = usePathname();
  const i = dsNavItems.findIndex((item) => item.href === pathname);
  if (i < 0) return null;
  const prev = dsNavItems[i - 1];
  const next = dsNavItems[i + 1];

  const card = "group state-layer relative flex min-w-0 flex-1 flex-col gap-1 rounded-2xl bg-surface p-5 shadow-flat";
  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-col gap-3 border-t border-border-subtle pt-8 sm:flex-row">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1.5 text-caption text-fg-muted">
            <ArrowLeft aria-hidden className="size-icon-sm" /> Previous
          </span>
          <span className="truncate text-title">{prev.label}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next && (
        <Link href={next.href} className={`${card} items-end text-right`}>
          <span className="flex items-center gap-1.5 text-caption text-fg-muted">
            Next <ArrowRight aria-hidden className="size-icon-sm" />
          </span>
          <span className="truncate text-title">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}
