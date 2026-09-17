// forked from design-sync lib/source-kit.mjs - exact src files + groups from the generated design-system/index.ts barrel
//
// BlueSigns is a Next.js app packaged by a generated barrel (design-system/index.ts) whose lines
// are `export { A, B as C } from "../components/<dir>/<file>"`. The stock adapter fuzzy-matches
// src files by component NAME, which misses every secondary export in a multi-export file
// (CardHeader, AccountHomeView...) and derives groups from the last dir segment (admin/orders and
// orders collide; ui/ is "generic" so 100+ primitives land in "general"). This fork:
//   - maps every exported name to its exact file by parsing the barrel,
//   - groups by the full dir under components/ (admin/orders -> admin-orders),
//   - splits components/ui into kind groups (UI_KIND below).
// Everything else (component list from the entry's exports, componentSrcMap semantics) is unchanged.
// The stock synth-entry fallback is dropped: this repo always passes cfg.entry.

import { existsSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import { leadingJsdoc, readText, slash } from '../../.ds-sync/lib/common.mjs';
import { resolveDistEntry } from '../../.ds-sync/lib/bundle.mjs';
import { exportedNames, isComponentName } from '../../.ds-sync/lib/dts.mjs';

const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general';

// components/ui/<file> -> kind group. Files not listed fall back to "data-display".
const UI_KIND = {
  actions: ['button', 'icon-button', 'text-button', 'copy-button', 'share-button', 'theme-toggle', 'back-to-top'],
  forms: [
    'input', 'field', 'checkbox', 'radio-group', 'radio-card', 'select', 'combobox', 'switch', 'slider',
    'textarea', 'otp-input', 'password-input', 'password-strength-meter', 'phone-input', 'pincode-input',
    'money-input', 'number-input', 'slug-input', 'tag-input', 'date-picker', 'calendar', 'file-upload',
    'rating-input', 'form-error-summary', 'form-row', 'form-section', 'repeatable-list', 'option-set-editor',
    'resend-timer', 'search-bar', 'segmented-control', 'chip',
  ],
  overlays: ['dialog', 'alert-dialog', 'sheet', 'popover', 'hover-card', 'dropdown-menu', 'tooltip', 'toaster'],
  navigation: ['tabs', 'breadcrumbs', 'pagination', 'steps', 'text-link', 'skip-link', 'load-more', 'accordion', 'carousel', 'scroll-area'],
  feedback: ['alert', 'empty-state', 'error-state', 'not-found-state', 'progress', 'spinner', 'skeleton', 'page-skeletons', 'countdown-timer', 'status-dot'],
};
const uiKindOf = (file) => Object.entries(UI_KIND).find(([, files]) => files.includes(file))?.[0] ?? 'data-display';

function groupFor(componentsRoot, file) {
  const rel = slash(relative(componentsRoot, dirname(file)));
  if (rel === 'ui') return uiKindOf(basename(file).replace(/\.(tsx|jsx)$/, ''));
  return slug(rel.split('/').join('-'));
}

// Parse `export { A, B as C } from "<spec>"` lines -> Map(exportedName -> { file, original }).
function barrelMap(entry) {
  const map = new Map();
  const dir = dirname(entry);
  for (const m of readText(entry).matchAll(/^export\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/gm)) {
    const base = resolve(dir, m[2]);
    const file = ['.tsx', '.jsx', '.ts'].map((e) => base + e).find(existsSync);
    if (!file) continue;
    for (const part of m[1].split(',')) {
      const [original, alias] = part.trim().split(/\s+as\s+/).map((x) => x.trim());
      if (original) map.set(alias ?? original, { file: slash(file), original });
    }
  }
  return map;
}

export async function resolvePackage(ctx) {
  const { PKG_DIR, pkgJson, ENTRY_OVERRIDE, PKG, cfg } = ctx;
  const srcMap = cfg.componentSrcMap ?? {};

  const srcRoot = [cfg.srcDir, 'src', 'lib', 'components']
    .map((d) => d && resolve(PKG_DIR, d))
    .find((d) => d && existsSync(d));

  const entry = resolveDistEntry({ pkgDir: PKG_DIR, pkgJson, override: ENTRY_OVERRIDE, pkgName: PKG, soft: true });
  if (!entry) {
    console.error(`[NO_DIST] ${PKG}: no entry - run cfg.buildCmd (design-system/scripts/gen-entry.mjs) and pass cfg.entry.`);
    process.exit(1);
  }

  const exported = exportedNames(PKG_DIR, pkgJson);
  const names = new Set([...exported].filter(isComponentName));
  for (const [k, v] of Object.entries(srcMap)) {
    if (v === null) { names.delete(k); continue; }
    if (!/^[A-Z][A-Za-z0-9]*$/.test(k)) {
      console.error(`[CONFIG] componentSrcMap: "${k}" is not a valid component name (PascalCase identifiers only)`);
      continue;
    }
    names.add(k);
  }
  const components = [...names].sort().map((name) => ({ name, group: 'general' }));
  if (!components.length) {
    console.error(`[ZERO_MATCH] no PascalCase exports in ${PKG}`);
    process.exit(1);
  }

  const fromBarrel = barrelMap(entry);
  let matched = 0;
  for (const c of components) {
    const pinned = typeof srcMap[c.name] === 'string' ? slash(resolve(PKG_DIR, srcMap[c.name])) : null;
    const b = fromBarrel.get(c.name);
    const hit = pinned ?? b?.file;
    if (!hit || !existsSync(hit)) continue;
    matched++;
    c.srcPath = hit;
    // Aliased exports (AdminFilterBar) carry the JSDoc of their original name.
    c.doc = leadingJsdoc(readText(hit), b?.original ?? c.name) || undefined;
    c.group = srcRoot ? groupFor(srcRoot, hit) : 'general';
  }

  console.error(`  package: ${components.length} components (${matched} src-matched via barrel)`);
  return { shape: 'package', entry, components, synthEntry: false, exported };
}
