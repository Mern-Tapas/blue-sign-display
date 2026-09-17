"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";

export type StatusTabsProps<T extends string> = {
  label: string;
  tabs: { id: T; label: string }[];
  value: T;
  onValueChange: (value: T) => void;
  counts: Record<T, number>;
  /** Tabs hidden while empty (and not selected), e.g. "Payment pending". */
  hideWhenEmpty?: T[];
  /** The panel the tabs control: rendered once, for the selected tab. */
  children: React.ReactNode;
  className?: string;
};

/** Work-queue tabs with live counts above a single list (orders by fulfilment stage, returns by status). */
export function StatusTabs<T extends string>({ label, tabs, value, onValueChange, counts, hideWhenEmpty = [], children, className }: StatusTabsProps<T>) {
  const shown = tabs.filter((t) => t.id === value || counts[t.id] > 0 || !hideWhenEmpty.includes(t.id));
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)} className={cn("min-w-0 gap-4", className)}>
      <TabsList variant="underline" aria-label={label} className="w-full">
        {shown.map((t) => (
          <TabsTrigger key={t.id} value={t.id} count={counts[t.id]}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={value} className="min-w-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
