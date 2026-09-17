#!/usr/bin/env node
// WCAG contrast check for BlueSigns semantic tokens, both themes.
// Usage: node plan/scripts/contrast.mjs [--all]   (exit 1 if any required pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../../styles/tokens.css", import.meta.url), "utf8");

function block(selectorRe) {
  const m = css.match(selectorRe);
  if (!m) return {};
  const body = css.slice(m.index + m[0].length, css.indexOf("\n}", m.index));
  const vars = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[name] = value.trim();
  return vars;
}

const primitives = block(/^:root\s*\{/m);
const light = { ...primitives, ...block(/^:root,\s*\[data-theme="light"\]\s*\{/m) };
const dark = { ...light, ...block(/^\[data-theme="dark"\]\s*\{/m) };

function parse(value, vars, depth = 0) {
  if (!value || depth > 10) return null;
  value = value.replace(/var\(--([\w-]+)\)(?=\s*\/)/g, (_, n) => vars[n] ?? "");
  const ref = value.match(/^var\(--([\w-]+)\)$/);
  if (ref) return parse(vars[ref[1]], vars, depth + 1);
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  const rgb = value.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+%?))?\s*\)$/);
  if (rgb) {
    const a = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
    return [+rgb[1], +rgb[2], +rgb[3], a];
  }
  return null; // color-mix etc. — not evaluated
}

const blend = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = ([r, g, b]) =>
  [r, g, b]
    .map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [fg token, bg token, min ratio, note]; bg may be "a over b" for translucent backgrounds
const text = 4.5, ui = 3;
const pairs = [
  ["fg", "canvas", text], ["fg", "surface", text], ["fg", "surface-sunken", text], ["fg", "surface-raised", text],
  ["fg-muted", "canvas", text], ["fg-muted", "surface", text], ["fg-muted", "surface-sunken", text], ["fg-muted", "surface-raised", text],
  ["fg-placeholder", "surface", text], ["fg-placeholder", "surface-sunken", text],
  ["accent-fg", "surface", text], ["accent-fg", "canvas", text], ["accent-fg", "surface-sunken", text],
  ["accent-soft-fg", "accent-soft over surface", text], ["accent-soft-fg", "accent-soft-hover over surface", text],
  ["fg-on-accent", "accent", text], ["fg-on-accent", "accent-hover", text], ["fg-on-accent", "accent-pressed", text],
  ["fg-on-accent-muted", "accent", text],
  ["fg-on-danger", "danger", text], ["fg-on-success", "success", text], ["fg-on-warning", "warning", text], ["fg-on-info", "info", text],
  ["success-fg", "success-soft over surface", text], ["warning-fg", "warning-soft over surface", text],
  ["danger-fg", "danger-soft over surface", text], ["info-fg", "info-soft over surface", text],
  ["success-fg", "surface", text], ["danger-fg", "surface", text], ["warning-fg", "surface", text],
  ["fg-on-contrast", "surface-contrast", text], ["fg-on-contrast-muted", "surface-contrast", text],
  ["fg-inverse", "surface-inverse", text],
  ["fg", "selected-bg over surface", text], ["accent-soft-fg", "selected-bg over surface", text],
  ["focus-ring", "surface", ui], ["focus-ring", "canvas", ui], ["focus-ring", "surface-sunken", ui],
  ["selected-ring", "surface", ui], ["accent", "surface", ui], ["rating", "surface", ui],
  ["success", "surface", ui], ["danger", "surface", ui], ["border-strong over surface", "surface", 1.4, "informative hairline (inputs)"],
  ["disabled-fg", "disabled-bg over surface", ui, "disabled (D-013)"],
  ["fg-on-secondary", "secondary", text], ["fg-on-secondary", "secondary-hover", text],
  ["secondary-fg", "surface", text], ["secondary-fg", "secondary-soft over surface", text],
];

const steps = [["canvas", "surface"], ["surface", "surface-sunken"], ["surface", "surface-hover"], ["surface", "surface-raised"], ["surface-sunken", "surface-hover"], ["canvas", "surface-contrast"]];

const showAll = process.argv.includes("--all");
let failures = 0, missing = 0;

function resolve(expr, vars) {
  const parts = expr.split(" over ");
  let color = parse(`var(--${parts[parts.length - 1]})`, vars);
  if (!color) return null;
  if (color[3] < 1) color = blend(color, parse("var(--surface)", vars));
  for (let i = parts.length - 2; i >= 0; i--) {
    const top = parse(`var(--${parts[i]})`, vars);
    if (!top) return null;
    color = blend(top, color);
  }
  return color;
}

for (const [name, vars] of [["light", light], ["dark", dark]]) {
  console.log(`\n── ${name} ──`);
  for (const [fgT, bgT, min, note] of pairs) {
    const bg = resolve(bgT, vars);
    let fg = resolve(fgT, vars);
    if (!fg || !bg) {
      missing++;
      if (showAll) console.log(`  ?     ${fgT} on ${bgT} (token missing / not evaluable)`);
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failures++;
    if (!ok || showAll) console.log(`  ${ok ? "ok  " : "FAIL"}  ${r.toFixed(2).padStart(5)}  ${fgT} on ${bgT}  (≥${min}${note ? `, ${note}` : ""})`);
  }
  console.log("  surface steps:", steps.map(([a, b]) => {
    const ca = resolve(a, vars), cb = resolve(b, vars);
    return ca && cb ? `${a}→${b} ${ratio(ca, cb).toFixed(2)}` : `${a}→${b} ?`;
  }).join(" · "));
}
console.log(`\n${failures} failing pair(s), ${missing} missing/unevaluable.`);
process.exit(failures ? 1 : 0);
