"use client";

import { useMemo, useState } from "react";

export type DraftOptions<T> = {
  /**
   * How "unchanged" is decided. The default compares JSON, which is right for plain
   * values but blind to File, Date and class instances — JSON.stringify turns a File into
   * `{}`, so swapping one upload for another would read as clean. Pass this when the
   * draft can hold those.
   */
  isEqual?: (a: T, b: T) => boolean;
};

const jsonEqual = <T,>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Tracks an editable draft against its saved value: `dirty` drives the unsaved-changes
 * bar, `commit` accepts the draft as saved, `discard` throws the edits away.
 */
export function useDraft<T>(initial: T, options: DraftOptions<T> = {}) {
  const { isEqual = jsonEqual } = options;
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);

  const dirty = useMemo(() => !isEqual(saved, draft), [isEqual, saved, draft]);

  return {
    draft,
    setDraft,
    dirty,
    commit: () => setSaved(draft),
    discard: () => setDraft(saved),
    /** Replace both sides, e.g. after loading a different record. */
    reset: (next: T) => {
      setSaved(next);
      setDraft(next);
    },
  } as const;
}
