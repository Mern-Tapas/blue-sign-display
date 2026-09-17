import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export const textLinkVariants = cva(
  [
    "relative inline-flex items-baseline gap-0.5 rounded-xs font-medium underline-offset-4",
    "transition-[color,text-decoration-color] duration-(--dur-fast) ease-out",
    "[&_svg]:size-[0.9em] [&_svg]:shrink-0 [&_svg]:self-center",
  ],
  {
    variants: {
      tone: {
        /** Accent blue — actions inside UI copy ("Forgot password?", "View offers"). */
        accent: "text-accent-fg hover:underline",
        /** Inherits text colour, always underlined — links inside paragraphs, T&Cs. */
        inline: "text-inherit underline decoration-current/40 hover:decoration-current",
        /** Muted — secondary footnote links ("Terms", "Privacy"). */
        muted: "text-fg-muted hover:text-fg hover:underline",
      },
      size: { inherit: "", sm: "text-caption", md: "text-body", lg: "text-body-lg" },
    },
    defaultVariants: { tone: "accent", size: "inherit" },
  },
);

export type TextLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> &
  VariantProps<typeof textLinkVariants> & {
    href: string;
    /** Opens in a new tab with rel="noopener" and a trailing arrow; announced to screen readers. */
    external?: boolean;
    /** Enlarges the tap target to 44px on touch without changing layout. */
    hitArea?: boolean;
  };

/** Styled link for copy. Internal hrefs use next/link; `external` renders a new-tab anchor. */
export function TextLink({ href, tone, size, external = false, hitArea = false, className, children, ...props }: TextLinkProps) {
  const classes = cn(textLinkVariants({ tone, size }), hitArea && "hit-area", className);
  if (external) {
    return (
      <a data-slot="text-link" href={href} target="_blank" rel="noopener noreferrer" className={classes} {...(props as React.ComponentProps<"a">)}>
        {children}
        <ArrowUpRight aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link data-slot="text-link" href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
