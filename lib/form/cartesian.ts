/* Combinations from option sets: Size × Colour → the rows a variant editor would show.

   This is the arithmetic only. The editable grid that hangs per-row price, stock and SKU
   off these combinations is application-level and waits for the table phase — see
   plan/ds-expansion-plan.md. */

export type OptionSet = {
  /** Stable id, so a combination key survives renaming the set. */
  id: string;
  name: string;
  values: { id: string; label: string }[];
};

export type Combination = {
  /** Value ids joined by "/" — stable across reordering and renaming. */
  key: string;
  /** One value per option set, in the order the sets were given. */
  values: { setId: string; valueId: string; label: string }[];
  /** "M / Black" — for a row header. */
  label: string;
};

/**
 * Every combination of one value from each set, in odometer order (the last set varies
 * fastest), which is the order people expect to read down a variant table.
 * An empty set produces no combinations at all, not a silent skip.
 */
export function cartesian(sets: OptionSet[], separator = " / "): Combination[] {
  const usable = sets.filter((s) => s.values.length > 0);
  if (usable.length !== sets.length || usable.length === 0) return [];

  return usable.reduce<Combination[]>(
    (rows, set) =>
      rows.flatMap((row) =>
        set.values.map((value) => {
          const values = [...row.values, { setId: set.id, valueId: value.id, label: value.label }];
          return {
            key: values.map((v) => v.valueId).join("/"),
            values,
            label: values.map((v) => v.label).join(separator),
          };
        }),
      ),
    [{ key: "", values: [], label: "" }],
  );
}

/** How many rows `cartesian` would return — cheap enough to warn before generating 400. */
export function combinationCount(sets: OptionSet[]) {
  if (sets.length === 0 || sets.some((s) => s.values.length === 0)) return 0;
  return sets.reduce((total, set) => total * set.values.length, 1);
}
