import { Fragment } from "react";
import { cn } from "@/lib/cn";

export type KbdProps = React.ComponentProps<"kbd"> & { size?: "sm" | "md" };

/** A single key cap for shortcuts ("/" to search, Esc to close). */
export function Kbd({ size = "md", className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xs border border-border bg-surface-sunken font-sans text-fg-muted figures",
        "shadow-[inset_0_-1px_0_var(--color-border)]",
        size === "sm" ? "h-5 min-w-5 px-1 text-caption" : "h-6 min-w-6 px-1.5 text-caption-strong",
        className,
      )}
      {...props}
    />
  );
}

/** A key combination, e.g. `<KbdGroup keys={["Ctrl", "K"]} />`. Read as "Ctrl plus K". */
export function KbdGroup({
  keys,
  size,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { keys: string[]; size?: KbdProps["size"] }) {
  return (
    <span data-slot="kbd-group" className={cn("inline-flex items-center gap-1 text-caption text-fg-muted", className)} {...props}>
      {keys.map((k, i) => (
        <Fragment key={`${k}-${i}`}>
          {i > 0 && <span aria-hidden>+</span>}
          <Kbd size={size}>{k}</Kbd>
        </Fragment>
      ))}
    </span>
  );
}
