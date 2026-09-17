"use client";

import { useCallback, useState } from "react";

export type SortableOptions = {
  count: number;
  onMove: (from: number, to: number) => void;
  /** Names the thing being moved, for the live region: "Image", "Variant". */
  itemLabel?: string;
};

/**
 * Reordering without a drag-and-drop library.
 *
 * **Keyboard first, drag second.** HTML5 drag events never fire on touch, so Move up /
 * Move down are the real mechanism and pointer dragging is an enhancement on top. Every
 * move is announced, because a row changing places is silent otherwise.
 */
export function useSortableList({ count, onMove, itemLabel = "Item" }: SortableOptions) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const move = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= count || from === to) return;
      onMove(from, to);
      setAnnouncement(`${itemLabel} ${from + 1} moved to position ${to + 1} of ${count}`);
    },
    [count, onMove, itemLabel],
  );

  /** Spread onto each row. Alt + ↑ / ↓ moves it; the buttons stay the primary path. */
  const itemProps = useCallback(
    (index: number) => ({
      draggable: true,
      "data-dragging": dragging === index ? "" : undefined,
      "data-drop-target": over === index && dragging !== index ? "" : undefined,
      onDragStart: (event: React.DragEvent) => {
        setDragging(index);
        event.dataTransfer.effectAllowed = "move";
        // Firefox refuses to start a drag without data on the transfer.
        event.dataTransfer.setData("text/plain", String(index));
      },
      onDragOver: (event: React.DragEvent) => {
        if (dragging === null) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setOver(index);
      },
      onDrop: (event: React.DragEvent) => {
        event.preventDefault();
        if (dragging !== null) move(dragging, index);
        setDragging(null);
        setOver(null);
      },
      onDragEnd: () => {
        setDragging(null);
        setOver(null);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (!event.altKey) return;
        if (event.key === "ArrowUp") move(index, index - 1);
        else if (event.key === "ArrowDown") move(index, index + 1);
        else return;
        event.preventDefault();
      },
    }),
    [dragging, over, move],
  );

  return {
    itemProps,
    move,
    moveUp: (index: number) => move(index, index - 1),
    moveDown: (index: number) => move(index, index + 1),
    dragging,
    /** Render in a visually hidden aria-live region. */
    announcement,
  };
}
