import { cn } from "@/lib/cn";

export type SkipLinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  /** id of the target landmark (without #). The target should be focusable or a landmark like <main>. */
  targetId?: string;
};

/** First focusable element on the page: jumps keyboard users past the header to the main content. */
export function SkipLink({ targetId = "main", className, children = "Skip to content", ...props }: SkipLinkProps) {
  return (
    <a
      data-slot="skip-link"
      href={`#${targetId}`}
      className={cn(
        "sr-only z-(--z-toast) rounded-pill bg-surface-inverse px-4 py-2 text-label text-fg-inverse shadow-popover",
        "focus:not-sr-only focus:fixed focus:top-3 focus:left-3",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
