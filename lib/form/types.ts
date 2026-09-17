/* The shapes the form layer speaks in. Pure: no React, no JSX, so a server component,
   a route handler and the browser can all share one validator. */

/** Dot path into a values object: "name", "variants.2.sku", "images.0.alt".
 *  Never a bare integer — see the ordering note on FieldErrors. */
export type FieldPath = string;

/**
 * Field path → message. Insertion order is on-screen order: the first entry is the one
 * that receives focus after a failed submit.
 *
 * JS reorders integer-like keys in an object, so a path must never be a bare index
 * ("2"); qualify it ("variants.2.sku") and the order holds.
 */
export type FieldErrors = Record<FieldPath, string>;

/** What a validator run produced, ready for a summary or a toast. */
export type ValidationResult = {
  ok: boolean;
  errors: FieldErrors;
  /** Paths in declaration order; `order[0]` is where focus goes. */
  order: FieldPath[];
  /** `errors[order[0]]` — the headline message. */
  first?: string;
};

/** A form's rules: values in, messages out. Returning `{}` means valid. */
export type Validate<T> = (values: T) => FieldErrors;

/** Build a result from a raw error map, preserving insertion order. */
export function toResult(errors: FieldErrors): ValidationResult {
  const order = Object.keys(errors);
  return { ok: order.length === 0, errors, order, first: order.length ? errors[order[0]!] : undefined };
}
