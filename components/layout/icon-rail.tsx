import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type IconRailItem = { href: string; label: string; icon: LucideIcon; active?: boolean };

export type IconRailProps = {
  groups: IconRailItem[][];
  className?: string;
};

/** Vertical icon sidebar from the dashboards — grouped pill clusters, active item filled with accent. */
export function IconRail({ groups, className }: IconRailProps) {
  return (
    <nav aria-label="Sidebar" className={cn("flex flex-col gap-3", className)}>
      {groups.map((group, gi) => (
        <ul key={gi} className="flex flex-col items-center gap-1 rounded-pill bg-surface p-1.5 shadow-xs">
          {group.map(({ href, label, icon: Icon, active }) => (
            <li key={label}>
              <Link
                href={href}
                aria-label={label}
                title={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex size-10 items-center justify-center rounded-pill transition-colors duration-(--dur-fast)",
                  active ? "bg-accent text-fg-on-accent" : "text-fg-muted hover:bg-surface-sunken hover:text-fg",
                )}
              >
                <Icon aria-hidden className="size-icon-base" />
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}
