"use client";

import { ChevronLeft, ChevronRight, GripVertical, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSortableList } from "@/lib/form/use-sortable-list";
import { Badge } from "./badge";
import { IconButton } from "./icon-button";

export type MediaItem = {
  id: string;
  /** Any renderable preview: next/image, an <img>, a file icon. */
  preview: React.ReactNode;
  /** Names the item in every control and announcement. */
  label: string;
};

export type MediaGridProps = {
  items: MediaItem[];
  onItemsChange: (items: MediaItem[]) => void;
  /** Which item is the primary one. Omit to drop the whole concept. */
  primaryId?: string;
  onPrimaryChange?: (id: string) => void;
  /** What "primary" is called here: Cover, Hero, Main. */
  primaryLabel?: string;
  onRemove?: (id: string) => void;
  className?: string;
};

/**
 * Arranging what has already been picked: order, which one leads, and what goes.
 * `FileUpload` chooses files; this manages them, so neither component has to do both.
 *
 * Order changes by button (working everywhere, including touch) with pointer drag as an
 * enhancement, and every move is announced.
 */
export function MediaGrid({ items, onItemsChange, primaryId, onPrimaryChange, primaryLabel = "Cover", onRemove, className }: MediaGridProps) {
  const sorter = useSortableList({
    count: items.length,
    itemLabel: "Image",
    onMove: (from, to) => {
      const next = items.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved as MediaItem);
      onItemsChange(next);
    },
  });

  // With no explicit primary, the first item leads — which is what a gallery already implies.
  const primary = primaryId ?? items[0]?.id;

  return (
    <div data-slot="media-grid" className={cn("flex flex-col gap-2", className)}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item, index) => (
          <li
            key={item.id}
            {...sorter.itemProps(index)}
            className={cn(
              "group/media relative flex flex-col gap-1.5 rounded-lg transition-[box-shadow,opacity] duration-(--dur-fast)",
              "data-dragging:opacity-60 data-dragging:shadow-drag data-drop-target:ring-2 data-drop-target:ring-accent",
            )}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-sunken shadow-flat">
              {item.preview}
              {item.id === primary && (
                <Badge tone="solid" size="sm" className="absolute top-1.5 left-1.5">
                  {primaryLabel}
                </Badge>
              )}
              <span aria-hidden className="absolute top-1.5 right-1.5 hidden cursor-grab text-fg-on-accent opacity-0 transition-opacity group-hover/media:opacity-100 pointer-fine:block">
                <GripVertical className="size-icon-md drop-shadow" />
              </span>
            </div>
            <div className="flex items-center justify-between gap-0.5">
              <span className="flex">
                <IconButton label={`Move ${item.label} earlier`} variant="ghost" size="xs" disabled={index === 0} onClick={() => sorter.moveUp(index)}>
                  <ChevronLeft aria-hidden />
                </IconButton>
                <IconButton label={`Move ${item.label} later`} variant="ghost" size="xs" disabled={index === items.length - 1} onClick={() => sorter.moveDown(index)}>
                  <ChevronRight aria-hidden />
                </IconButton>
              </span>
              <span className="flex">
                {onPrimaryChange && (
                  <IconButton
                    label={item.id === primary ? `${item.label} is the ${primaryLabel.toLowerCase()}` : `Make ${item.label} the ${primaryLabel.toLowerCase()}`}
                    variant="ghost"
                    size="xs"
                    aria-pressed={item.id === primary}
                    disabled={item.id === primary}
                    onClick={() => onPrimaryChange(item.id)}
                  >
                    <Star aria-hidden className={cn(item.id === primary && "fill-rating text-rating")} />
                  </IconButton>
                )}
                {onRemove && (
                  <IconButton label={`Remove ${item.label}`} variant="ghost" size="xs" onClick={() => onRemove(item.id)}>
                    <Trash2 aria-hidden />
                  </IconButton>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {sorter.announcement}
      </p>
    </div>
  );
}
