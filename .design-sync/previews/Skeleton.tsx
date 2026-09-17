import { Skeleton } from "@bluesigns/ui";

export const ProductCards = () => (
  <div className="flex gap-4" style={{ maxWidth: 440 }}>
    {[0, 1].map((i) => (
      <div key={i} className="flex flex-1 flex-col gap-3">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4 rounded-pill" />
        <Skeleton className="h-4 w-1/3 rounded-pill" />
      </div>
    ))}
  </div>
);

export const ListRows = () => (
  <div className="flex flex-col gap-4" style={{ maxWidth: 440 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-pill" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/2 rounded-pill" />
          <Skeleton className="h-3 w-3/4 rounded-pill" />
        </div>
      </div>
    ))}
  </div>
);

export const TextBlock = () => (
  <div className="flex flex-col gap-2" style={{ maxWidth: 440 }}>
    <Skeleton className="h-6 w-2/3 rounded-md" />
    <Skeleton className="h-4 w-full rounded-pill" />
    <Skeleton className="h-4 w-full rounded-pill" />
    <Skeleton className="h-4 w-1/2 rounded-pill" />
  </div>
);
