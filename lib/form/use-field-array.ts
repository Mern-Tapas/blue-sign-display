"use client";

import { useCallback, useMemo } from "react";
import { getPath, indexPath } from "./paths";
import type { FieldPath } from "./types";
import type { UseFormReturn } from "./use-form";

/**
 * Repeated rows inside a form: variants, highlights, PIN ranges.
 *
 * Paths stay qualified (`variants.2.sku`) so the error map keeps its declaration order —
 * a bare index key would be reordered by JS and take focus order with it.
 */
export function useFieldArray<T, I>(form: UseFormReturn<T>, path: FieldPath) {
  const { values, setField } = form;
  // Memoised so the row helpers keep a stable identity between renders.
  const items = useMemo(() => (getPath<I[]>(values, path) ?? []) as I[], [values, path]);

  const write = useCallback((next: I[]) => setField(path, next), [setField, path]);

  return {
    items,
    append: useCallback((item: I) => write([...items, item]), [write, items]),
    remove: useCallback((index: number) => write(items.filter((_, i) => i !== index)), [write, items]),
    update: useCallback(
      (index: number, patch: Partial<I>) => write(items.map((item, i) => (i === index ? { ...item, ...patch } : item))),
      [write, items],
    ),
    move: useCallback(
      (from: number, to: number) => {
        if (to < 0 || to >= items.length || from === to) return;
        const next = items.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved as I);
        write(next);
      },
      [write, items],
    ),
    /** "variants.2.sku" — hand straight to form.field(). */
    pathFor: useCallback((index: number, key?: keyof I & string) => indexPath(path, index, key), [path]),
  };
}
