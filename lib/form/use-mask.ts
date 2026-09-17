"use client";

import { useCallback } from "react";

export type MaskOptions = {
  /**
   * `#` is a digit, `A` a letter, `*` either. Everything else is a literal that the mask
   * inserts for you: "####-####-####-####", "##AAAAA####A#Z#".
   */
  pattern: string;
  /** Upper-case letters as they are typed (GSTIN, PAN, vehicle numbers). */
  uppercase?: boolean;
};

const isDigit = (c: string) => c >= "0" && c <= "9";
const isLetter = (c: string) => /[a-zA-Z]/.test(c);

const accepts = (token: string, char: string) =>
  token === "#" ? isDigit(char) : token === "A" ? isLetter(char) : token === "*" ? isDigit(char) || isLetter(char) : false;

/** Longest prefix of `raw` that the pattern accepts, with literals filled in. */
export function applyMask(raw: string, { pattern, uppercase = false }: MaskOptions) {
  const source = uppercase ? raw.toUpperCase() : raw;
  let out = "";
  let i = 0;

  for (const token of pattern) {
    if (i >= source.length) break;
    if (token === "#" || token === "A" || token === "*") {
      // Skip anything the slot can't take, rather than stopping dead on a stray space.
      while (i < source.length && !accepts(token, source[i]!)) i++;
      if (i >= source.length) break;
      out += source[i++]!;
    } else {
      out += token;
      if (source[i] === token) i++;
    }
  }
  return out;
}

/** Characters a pattern can hold, for a maxLength or a counter. */
export const maskLength = (pattern: string) => pattern.length;

/**
 * Formatting as you type, for fixed-shape codes: card numbers, GSTIN, HSN, IFSC.
 *
 * **Append-only by design.** It re-formats from the start of the string, so editing in the
 * middle re-flows the tail and the caret would jump. Restoring a caret across a re-render is
 * where hand-rolled masks break, so rather than half-solve it this hook moves the caret to
 * the end on every change — which is right for entering a code, and wrong for editing prose.
 * Anything needing mid-string edits should stay an unmasked input with a validator.
 */
export function useMask(options: MaskOptions) {
  const { pattern } = options;

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const masked = applyMask(event.target.value, options);
      event.target.value = masked;
      // Same reason as the doc comment: the value is rebuilt, so the caret belongs at the end.
      requestAnimationFrame(() => event.target.setSelectionRange(masked.length, masked.length));
      return masked;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is a literal at every call site
    [pattern, options.uppercase],
  );

  return {
    onChange,
    format: (value: string) => applyMask(value, options),
    maxLength: maskLength(pattern),
    inputMode: (/^[#\-\s/]+$/.test(pattern) ? "numeric" : "text") as "numeric" | "text",
  };
}
