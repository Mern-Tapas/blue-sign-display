"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { sortOptions, type SortKey } from "@/lib/filters";

export type SortSheetProps = {
  trigger: React.ReactElement;
  value: SortKey;
  onValueChange: (value: SortKey) => void;
  options?: { value: SortKey; label: string }[];
};

/** Phone sort picker: a bottom sheet of options that applies and closes on tap. */
export function SortSheet({ trigger, value, onValueChange, options = sortOptions }: SortSheetProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" hideClose>
        <SheetHeader title="Sort by" className="pr-6" />
        <SheetBody className="pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div role="radiogroup" aria-label="Sort by" className="flex flex-col">
            {options.map((o) => {
              const on = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    onValueChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "state-layer focus-ring-row relative -mx-3 flex min-h-row-lg items-center justify-between gap-3 rounded-lg px-3 text-left",
                    on ? "text-body-strong text-fg" : "text-body text-fg-muted",
                  )}
                >
                  {o.label}
                  {on && <Check aria-hidden className="size-icon-lg text-accent-fg" />}
                </button>
              );
            })}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
