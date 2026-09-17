"use client";

import Link from "next/link";
import { BadgePercent, MailCheck, MailOpen, MoreHorizontal, Package, PackageCheck, ShieldAlert, Trash2, TrendingDown } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconTile, type IconTileProps } from "@/components/ui/icon-tile";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { AppNotification, NotificationType } from "@/lib/data/types";

const typeIcon: Record<NotificationType, { icon: React.ReactNode; tone: IconTileProps["tone"]; label: string }> = {
  order: { icon: <Package />, tone: "accent", label: "Order update" },
  offer: { icon: <BadgePercent />, tone: "success", label: "Offer" },
  account: { icon: <ShieldAlert />, tone: "warning", label: "Account" },
  "price-drop": { icon: <TrendingDown />, tone: "success", label: "Price drop" },
  "back-in-stock": { icon: <PackageCheck />, tone: "info", label: "Back in stock" },
};

/** "Just now", "2 h ago", "Yesterday", "12 Sept" — pass `now` (ms) only after hydration. */
export function relativeTime(iso: string, now: number | null) {
  if (now === null) return formatDate(iso, { day: "numeric", month: "short" });
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  if (h < 48) return "Yesterday";
  return formatDate(iso, { day: "numeric", month: "short" });
}

export type NotificationItemProps = {
  notification: AppNotification & { read: boolean };
  now: number | null;
  onOpen?: () => void;
  onToggleRead?: () => void;
  onDelete?: () => void;
  compact?: boolean;
  className?: string;
};

/** One notification: type icon or product image, title, body, time, unread dot, and a menu to mark read / unread or delete. */
export function NotificationItem({ notification: n, now, onOpen, onToggleRead, onDelete, compact = false, className }: NotificationItemProps) {
  const t = typeIcon[n.type];
  const body = (
    <>
      <span className="relative shrink-0">
        {n.image ? (
          <ProductImage src={n.image} alt="" sizes="48px" wrapperClassName={cn("rounded-lg", compact ? "size-10" : "size-12")} />
        ) : (
          <IconTile size={compact ? "md" : "lg"} tone={t.tone}>
            {t.icon}
          </IconTile>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-baseline justify-between gap-3">
          <span className={cn("truncate text-fg", n.read ? "text-body" : "text-body-strong")}>{n.title}</span>
          <time dateTime={n.date} className="shrink-0 text-caption text-fg-muted">
            {relativeTime(n.date, now)}
          </time>
        </span>
        <span className={cn("text-body text-fg-muted", compact && "line-clamp-2")}>{n.body}</span>
        <span className="sr-only">
          {t.label}
          {n.read ? "" : ", unread"}
        </span>
      </span>
    </>
  );

  return (
    <div data-slot="notification-item" data-unread={!n.read || undefined} className={cn("group relative flex items-start gap-3 rounded-xl p-3 transition-colors duration-(--dur-fast) hover:bg-highlight", !n.read && "bg-accent-soft/40", className)}>
      {!n.read && <span aria-hidden className="absolute top-1/2 left-0.5 size-1.5 -translate-y-1/2 rounded-pill bg-accent" />}
      {n.href ? (
        <Link href={n.href} onClick={onOpen} className="flex min-w-0 flex-1 items-start gap-3 rounded-lg focus-ring-card [--focus-card-radius:var(--radius-xl)] after:absolute after:inset-0 after:rounded-xl">
          {body}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-start gap-3">{body}</div>
      )}
      {(onToggleRead || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Options for ${n.title}`}
            className="state-layer hit-area relative z-10 flex size-control-xs shrink-0 items-center justify-center rounded-pill text-fg-muted hover:text-fg pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100 pointer-fine:data-[state=open]:opacity-100"
          >
            <MoreHorizontal aria-hidden className="size-icon-md" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {onToggleRead && (
              <DropdownMenuItem onSelect={onToggleRead}>
                {n.read ? <MailOpen aria-hidden /> : <MailCheck aria-hidden />}
                {n.read ? "Mark as unread" : "Mark as read"}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={onDelete}>
                  <Trash2 aria-hidden /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
