"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** One accessible label per thumb, e.g. ["Minimum price", "Maximum price"]. */
  thumbLabels?: string[];
};

export function Slider({ className, thumbLabels, value, defaultValue, ...props }: SliderProps) {
  const thumbs = (value ?? defaultValue ?? [0]).length;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex h-5 w-full touch-none items-center select-none data-disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-pill bg-surface-sunken">
        <SliderPrimitive.Range className="absolute h-full rounded-pill bg-accent" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabels?.[i]}
          className={cn(
            "block size-5 rounded-pill border-2 border-accent bg-surface hit-area relative shadow-xs transition-transform duration-(--dur-fast) ease-out data-disabled:border-disabled-fg",
            "[@media(hover:hover)]:hover:scale-110 active:scale-110",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
