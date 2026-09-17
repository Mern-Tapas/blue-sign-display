import { Separator } from "radix-ui";
import { cn } from "@/lib/cn";

export type DividerProps = React.ComponentProps<typeof Separator.Root> & {
  /** Optional centered label, e.g. "or continue with". */
  label?: React.ReactNode;
};

export function Divider({ className, orientation = "horizontal", label, decorative = true, ...props }: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div data-slot="divider" className={cn("flex items-center gap-3 text-caption text-fg-muted", className)}>
        <Separator.Root decorative className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <Separator.Root decorative className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <Separator.Root
      data-slot="divider"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-4 w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
}
