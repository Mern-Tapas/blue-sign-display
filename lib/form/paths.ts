/* Dot-path access for form values. Small on purpose: enough for "variants.2.sku",
   not a lodash. Pure, no React. */

import type { FieldPath } from "./types";

const segments = (path: FieldPath) => path.split(".");

/** Read a nested value. Returns undefined for any missing link in the chain. */
export function getPath<V = unknown>(source: unknown, path: FieldPath): V | undefined {
  let current: unknown = source;
  for (const key of segments(path)) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current as V | undefined;
}

/**
 * Immutably set a nested value, cloning only the nodes along the path. A numeric segment
 * creates (or keeps) an array, so "variants.2.sku" works on a fresh object.
 */
export function setPath<T>(source: T, path: FieldPath, value: unknown): T {
  const [head, ...rest] = segments(path);
  if (head === undefined) return source;

  const isIndex = /^\d+$/.test(head);
  const base: unknown = source ?? (isIndex ? [] : {});

  if (Array.isArray(base)) {
    const next = base.slice();
    const i = Number(head);
    next[i] = rest.length === 0 ? value : setPath(next[i], rest.join("."), value);
    return next as T;
  }

  const next = { ...(base as Record<string, unknown>) };
  next[head] = rest.length === 0 ? value : setPath(next[head], rest.join("."), value);
  return next as T;
}

/** "variants.2.sku" for a repeated row. Keeps errors ordered (never a bare index). */
export function indexPath(base: FieldPath, index: number, key?: string): FieldPath {
  return key ? `${base}.${index}.${key}` : `${base}.${index}`;
}
