// Server-only (reads the file system): import from server components / pages only.
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Vars = Record<string, string>;

function block(css: string, selector: RegExp): Vars {
  const m = css.match(selector);
  if (!m || m.index === undefined) return {};
  const body = css.slice(m.index + m[0].length, css.indexOf("\n}", m.index));
  const vars: Vars = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[name!] = value!.trim();
  return vars;
}

function resolve(value: string | undefined, vars: Vars, depth = 0): string {
  if (!value) return "—";
  if (depth > 12) return value;
  return value.replace(/var\(--([\w-]+)\)/g, (_, name: string) => resolve(vars[name], vars, depth + 1));
}

let cache: { light: Vars; dark: Vars } | null = null;

function load() {
  if (cache) return cache;
  const css = readFileSync(join(process.cwd(), "styles", "tokens.css"), "utf8");
  const primitives = block(css, /^:root\s*\{/m);
  const light = { ...primitives, ...block(css, /^:root,\s*\[data-theme="light"\]\s*\{/m) };
  const dark = { ...light, ...block(css, /^\[data-theme="dark"\]\s*\{/m) };
  cache = { light, dark };
  return cache;
}

/** Resolved literal value of a CSS custom property from styles/tokens.css, per theme (docs only). */
export function tokenValue(name: string, theme: "light" | "dark" = "light") {
  const vars = load()[theme];
  return resolve(vars[name], vars).replace(/\s+/g, " ");
}

/** Raw declaration (before resolving), e.g. "var(--azure-600)". */
export function tokenSource(name: string, theme: "light" | "dark" = "light") {
  return load()[theme][name] ?? "—";
}
