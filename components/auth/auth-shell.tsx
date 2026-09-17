import { Heart, MapPin, Package, Tag } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";

export type AuthPerk = { icon: React.ReactNode; title: string; description?: string };

export const defaultAuthPerks: AuthPerk[] = [
  { icon: <Package />, title: "Track orders and returns", description: "Live delivery updates and one-tap returns" },
  { icon: <MapPin />, title: "Faster checkout", description: "Saved addresses, UPI IDs and cards" },
  { icon: <Heart />, title: "Wishlist on every device", description: "Pick up where you left off" },
  { icon: <Tag />, title: "Member offers", description: "Coupons and early access to sales" },
];

export type AuthShellProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Under the card: "New to BlueSigns? Create an account". */
  footer?: React.ReactNode;
  /** Above the title inside the card, e.g. a back button between steps. */
  topSlot?: React.ReactNode;
  /** Left brand panel heading (desktop). */
  asideTitle?: React.ReactNode;
  perks?: AuthPerk[];
  /** `split` = brand panel + card (full pages); `card` = the card alone (dialogs, docs, narrow layouts). */
  layout?: "split" | "card";
  /** h1 on auth pages; h2 / h3 when the shell sits inside another page. */
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * Frame for every sign-in, sign-up and recovery screen. On phones it is a single column with
 * the logo above the form; from lg a blue brand panel explains what an account is for.
 * Server-safe: all interactivity lives in the forms passed as children.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
  topSlot,
  asideTitle = "Sign in to shop faster",
  perks = defaultAuthPerks,
  layout = "split",
  headingLevel: Heading = "h1",
  className,
}: AuthShellProps) {
  const card = (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Card padding="none" className={cn("gap-5 p-6 sm:p-8", layout === "split" && "max-sm:bg-transparent max-sm:p-0 max-sm:shadow-none")}>
        <BrandMark className={cn(layout === "split" && "lg:hidden")} />
        {topSlot}
        <div className="flex flex-col gap-1.5">
          {/* tabIndex -1: multi-step flows move focus here when the step changes */}
          <Heading tabIndex={-1} data-slot="auth-title" className="text-heading-lg outline-none">
            {title}
          </Heading>
          {description && <p className="text-body text-fg-muted">{description}</p>}
        </div>
        {children}
      </Card>
      {footer && <div className="text-center text-body text-fg-muted">{footer}</div>}
    </div>
  );

  if (layout === "card") {
    return (
      <div data-slot="auth-shell" data-layout="card" className={cn("flex justify-center", className)}>
        {card}
      </div>
    );
  }

  return (
    <div data-slot="auth-shell" data-layout="split" className={cn("grid min-h-[40rem] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]", className)}>
      <Card asChild variant="accent" padding="none" className="hidden justify-between gap-10 overflow-hidden p-10 shadow-none lg:flex">
        <aside>
          <BrandMark inverted />
          <div className="flex flex-col gap-8">
            <h2 className="max-w-sm text-display-lg">{asideTitle}</h2>
            <ul className="grid gap-5">
              {perks.map((p) => (
                <li key={p.title} className="flex items-start gap-3.5">
                  <IconTile tone="onColor" className="[&_svg]:size-icon-lg">
                    {p.icon}
                  </IconTile>
                  <span className="flex flex-col gap-0.5 pt-0.5">
                    <span className="text-title">{p.title}</span>
                    {p.description && <span className="text-body text-fg-on-accent-muted">{p.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-caption text-fg-on-accent-muted">Your data is used only to run your account. Read our Privacy Policy.</p>
        </aside>
      </Card>
      <div className="flex items-start justify-center py-2 sm:items-center lg:py-10">{card}</div>
    </div>
  );
}
