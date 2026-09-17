import { Banknote, BadgeCheck, RotateCcw, ShieldCheck, Undo2 } from "lucide-react";
import { IconTile } from "@/components/ui/icon-tile";
import { Inset } from "@/components/ui/inset";
import { cn } from "@/lib/cn";

export type PolicyHighlightsProps = {
  /** Return window in days; 0 or undefined with `returnable={false}` shows "Not returnable". */
  returnDays?: number;
  returnable?: boolean;
  exchange?: boolean;
  cod?: boolean;
  /** "1 year manufacturer warranty". */
  warranty?: string;
  genuine?: boolean;
  className?: string;
};

/**
 * Product-specific policies at a glance. Unlike the store-wide ValuePropsStrip, every item here
 * reflects this product (non-returnable items say so plainly). Server-safe.
 */
export function PolicyHighlights({ returnDays = 14, returnable = true, exchange = true, cod = true, warranty, genuine = true, className }: PolicyHighlightsProps) {
  const items = [
    returnable
      ? { icon: <RotateCcw />, title: `${returnDays}-day return`, muted: false }
      : { icon: <Undo2 />, title: "Not returnable", muted: true },
    ...(returnable && exchange ? [{ icon: <Undo2 />, title: "Easy exchange", muted: false }] : []),
    cod ? { icon: <Banknote />, title: "Cash on Delivery", muted: false } : { icon: <Banknote />, title: "No Cash on Delivery", muted: true },
    ...(warranty ? [{ icon: <ShieldCheck />, title: warranty, muted: false }] : []),
    ...(genuine ? [{ icon: <BadgeCheck />, title: "100% genuine", muted: false }] : []),
  ];
  return (
    <ul data-slot="policy-highlights" aria-label="Product policies" className={cn("grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-2", className)}>
      {items.map((i) => (
        <Inset asChild key={i.title} className="flex flex-col items-center gap-2 px-2 py-3 text-center">
          <li>
            <IconTile size="sm" className={cn("size-9 bg-surface", i.muted ? "text-fg-muted" : "text-accent-fg")}>
              {i.icon}
            </IconTile>
            <span className={cn("text-caption-strong", i.muted ? "text-fg-muted" : "text-fg")}>{i.title}</span>
          </li>
        </Inset>
      ))}
    </ul>
  );
}
