"use client";

import { Select, type SelectProps } from "@/components/ui/select";
import { sortOptions, type SortKey } from "@/lib/filters";

export type SortSelectProps = Omit<SelectProps, "options" | "groups" | "value" | "onValueChange"> & {
  value: SortKey;
  onValueChange: (value: SortKey) => void;
};

export function SortSelect({ value, onValueChange, className, ...props }: SortSelectProps) {
  return (
    <Select
      aria-label="Sort products"
      prefix="Sort:"
      size="sm"
      value={value}
      onValueChange={(v) => onValueChange(v as SortKey)}
      options={sortOptions}
      className={className ?? "w-auto min-w-52"}
      {...props}
    />
  );
}
