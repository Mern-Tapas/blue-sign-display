import { cn } from "@/lib/cn";
import { Skeleton } from "./skeleton";

/**
 * Route-level loading placeholders shaped like the real pages, so content lands where the eye
 * already is. One status message per page ("Loading products"), the shapes themselves are hidden.
 */
function PageSkeleton({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div data-slot="page-skeleton" role="status" aria-live="polite" className={cn("flex flex-col gap-6", className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-4/5 w-full rounded-2xl" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ListingPageSkeleton({ items = 8, className }: { items?: number; className?: string }) {
  return (
    <PageSkeleton label="Loading products" className={className}>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-9 w-64 max-w-full" />
      </div>
      <div className="flex gap-6">
        <div className="hidden w-64 shrink-0 flex-col gap-5 lg:flex">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex justify-between gap-3">
            <Skeleton className="h-control-md w-28 rounded-pill" />
            <Skeleton className="h-control-md w-40 rounded-pill" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: items }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
}

export function ProductPageSkeleton({ className }: { className?: string }) {
  return (
    <PageSkeleton label="Loading product" className={className}>
      <Skeleton className="h-3 w-56 max-w-full" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="size-16 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-6 w-20 rounded-pill" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-3 w-32" />
          <div className="mt-2 flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="size-control-lg rounded-pill" />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Skeleton className="h-control-lg rounded-pill" />
            <Skeleton className="h-control-lg rounded-pill" />
          </div>
          <Skeleton className="mt-2 h-28 w-full rounded-2xl" />
        </div>
      </div>
    </PageSkeleton>
  );
}

export function BagPageSkeleton({ items = 2, className }: { items?: number; className?: string }) {
  return (
    <PageSkeleton label="Loading bag" className={className}>
      <Skeleton className="h-9 w-40" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-14 w-full rounded-2xl" />
          {Array.from({ length: items }, (_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl bg-surface p-4 shadow-flat">
              <Skeleton className="h-32 w-24 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-control-sm w-20 rounded-pill" />
                  <Skeleton className="h-control-sm w-20 rounded-pill" />
                </div>
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-flat">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
          <Skeleton className="mt-2 h-control-lg w-full rounded-pill" />
        </div>
      </div>
    </PageSkeleton>
  );
}

export function OrdersPageSkeleton({ items = 3, className }: { items?: number; className?: string }) {
  return (
    <PageSkeleton label="Loading orders" className={className}>
      <Skeleton className="h-9 w-48" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-control-sm w-24 rounded-pill" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: items }, (_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-flat">
            <div className="flex justify-between gap-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-24 rounded-pill" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="size-20 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2.5">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageSkeleton>
  );
}
