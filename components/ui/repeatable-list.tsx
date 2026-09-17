"use client";

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSortableList } from "@/lib/form/use-sortable-list";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export type RepeatableRowHelpers = {
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  index: number;
  isFirst: boolean;
  isLast: boolean;
};

export type RepeatableListProps<T> = {
  items: T[];
  onItemsChange: (items: T[]) => void;
  /** What a new row starts as. Called on every add. */
  newItem: () => T;
  getKey: (item: T, index: number) => string;
  renderRow: (item: T, helpers: RepeatableRowHelpers) => React.ReactNode;
  /** Rows below this can't be removed. */
  min?: number;
  max?: number;
  addLabel?: string;
  removeLabel?: (index: number) => string;
  /** Names a row in announcements and button labels: "Highlight", "Variant". */
  itemLabel?: string;
  sortable?: boolean;
  empty?: React.ReactNode;
  className?: string;
};

/**
 * Rows you can add to, remove from and reorder — the shape behind highlights, variants and
 * PIN ranges, which every screen used to rebuild.
 *
 * Reordering is by button, with drag as an extra: HTML5 drag events don't fire on touch, so
 * buttons are the mechanism that actually works everywhere.
 */
export function RepeatableList<T>({
  items,
  onItemsChange,
  newItem,
  getKey,
  renderRow,
  min = 0,
  max,
  addLabel = "Add row",
  removeLabel,
  itemLabel = "Row",
  sortable = false,
  empty,
  className,
}: RepeatableListProps<T>) {
  const sorter = useSortableList({
    count: items.length,
    itemLabel,
    onMove: (from, to) => {
      const next = items.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved as T);
      onItemsChange(next);
    },
  });

  const full = max !== undefined && items.length >= max;

  return (
    <div data-slot="repeatable-list" className={cn("flex flex-col gap-3", className)}>
      {items.length === 0 && empty}
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const helpers: RepeatableRowHelpers = {
            index,
            isFirst: index === 0,
            isLast: index === items.length - 1,
            remove: () => onItemsChange(items.filter((_, i) => i !== index)),
            moveUp: () => sorter.moveUp(index),
            moveDown: () => sorter.moveDown(index),
          };
          return (
            <li
              key={getKey(item, index)}
              {...(sortable ? sorter.itemProps(index) : {})}
              className={cn(
                "group/row flex items-end gap-2 rounded-lg transition-[box-shadow,opacity] duration-(--dur-fast)",
                sortable && "in-data-dragging:opacity-60 data-dragging:shadow-drag data-drop-target:ring-2 data-drop-target:ring-accent",
              )}
            >
              {sortable && (
                <>
                  {/* Pointer-only affordance: it does nothing on touch, so it doesn't claim space there. */}
                  <span aria-hidden className="mb-2.5 hidden cursor-grab text-fg-subtle pointer-fine:block">
                    <GripVertical className="size-icon-md" />
                  </span>
                  <span className="flex flex-col">
                    <IconButton label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`} variant="ghost" size="xs" disabled={helpers.isFirst} onClick={helpers.moveUp}>
                      <ChevronUp aria-hidden />
                    </IconButton>
                    <IconButton label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`} variant="ghost" size="xs" disabled={helpers.isLast} onClick={helpers.moveDown}>
                      <ChevronDown aria-hidden />
                    </IconButton>
                  </span>
                </>
              )}
              <div className="min-w-0 flex-1">{renderRow(item, helpers)}</div>
              <IconButton
                label={removeLabel?.(index) ?? `Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                variant="ghost"
                className="mb-0.5"
                disabled={items.length <= min}
                onClick={helpers.remove}
              >
                <Trash2 aria-hidden />
              </IconButton>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" size="sm" leadingIcon={<Plus aria-hidden />} disabled={full} onClick={() => onItemsChange([...items, newItem()])}>
          {addLabel}
        </Button>
        {max !== undefined && (
          <span className="text-caption text-fg-muted figures">
            {items.length} of {max}
          </span>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {sorter.announcement}
      </p>
    </div>
  );
}
