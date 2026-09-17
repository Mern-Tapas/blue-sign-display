import Image from "next/image";
import { cn } from "@/lib/cn";
import logo from "@/public/logo.jpg";

/** BlueSigns logo — the supplied artwork (public/logo.jpg), rendered as-is: never recolor or redraw it. */
export function BrandMark({
  className,
  showName = true,
  inverted = false,
}: {
  className?: string;
  showName?: boolean;
  /** White wordmark for dark/contrast surfaces. */
  inverted?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* App-icon treatment: the artwork is only clipped to the system radius, never altered. */}
      <Image
        src={logo}
        alt=""
        aria-hidden
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-sm object-cover shadow-xs"
      />
      {showName && (
        <span className={cn("text-heading-sm font-semibold tracking-tight", inverted ? "text-fg-on-contrast" : "text-fg")}>
          BlueSigns
        </span>
      )}
    </span>
  );
}
