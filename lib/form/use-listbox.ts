"use client";

import { useState } from "react";

export type ListboxOptions = {
  count: number;
  /**
   * Where the active index starts and returns to. 0 highlights the first option as soon as
   * the list opens (a picker, where something is always the candidate); -1 highlights
   * nothing until an arrow key is pressed (a search field, where Enter means "submit what I
   * typed" until you deliberately choose a suggestion).
   */
  initialIndex?: 0 | -1;
  /** Options to step over. Without it nothing is skipped. */
  isDisabled?: (index: number) => boolean;
  /** The scrolling list, if the active option has to be kept in view. */
  scrollContainer?: React.RefObject<HTMLElement | null>;
  /**
   * Whether Home / End jump to the ends. Off by default: in a text field those keys move the
   * caret, and taking them costs more than the shortcut is worth.
   */
  homeEnd?: boolean;
};

/**
 * The keyboard half of a listbox: which option is active, and the arrow keys that move it.
 *
 * Combobox and SearchBar had two copies of this, and the differences between them are real
 * — where the highlight starts, whether Home and End belong to the list or to the caret — so
 * they are options here rather than something one of them had to give up.
 *
 * It owns navigation only. Enter, Escape and opening stay with the component, because what
 * they mean differs: Enter picks an option in one and submits a query in the other.
 */
export function useListbox({ count, initialIndex = 0, isDisabled, scrollContainer, homeEnd = false }: ListboxOptions) {
  const [active, setActive] = useState<number>(initialIndex);

  // Plain functions: the React Compiler memoises them, and a manual useCallback around a
  // ref read is exactly what it cannot preserve.
  const scrollTo = (index: number) => {
    scrollContainer?.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  };

  /** Move to `next`, wrapping, stepping over disabled options in the direction of travel. */
  const move = (next: number) => {
    if (count === 0) return;
    const forward = next > active || (active < 0 && next >= 0);
    let index = ((next % count) + count) % count;
    for (let step = 0; step < count && isDisabled?.(index); step++) {
      index = (index + (forward ? 1 : -1) + count) % count;
    }
    setActive(index);
    scrollTo(index);
  };

  const reset = () => setActive(initialIndex);

  /**
   * Handles the navigation keys and reports whether it did, so the caller can add its own
   * Enter and Escape without guessing. It calls preventDefault for the keys it takes.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (count === 0 && event.key !== "Home" && event.key !== "End") return false;
    if (event.key === "ArrowDown") {
      // From "nothing active", down means the first option, not the second.
      move(active < 0 ? 0 : active + 1);
    } else if (event.key === "ArrowUp") {
      // ...and up means the last one.
      move(active < 0 ? count - 1 : active - 1);
    } else if (homeEnd && event.key === "Home") {
      move(0);
    } else if (homeEnd && event.key === "End") {
      move(count - 1);
    } else {
      return false;
    }
    event.preventDefault();
    return true;
  };

  return { active, setActive, move, reset, handleKeyDown };
}
