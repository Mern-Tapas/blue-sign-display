/* Tiny "Did you mean" for demo search. Production search engines return corrections themselves;
   keep this only as a client-side fallback for small catalogues. */

function distance(a: string, b: string) {
  if (a === b) return 0;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]!;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length]!;
}

/** Builds a lowercase word list from product names, brands and categories. */
export function buildVocabulary(texts: string[]) {
  return [...new Set(texts.flatMap((t) => t.toLowerCase().split(/[^a-z0-9₹]+/)).filter((w) => w.length > 2))];
}

/**
 * Replaces each unknown query word with the closest vocabulary word (edit distance ≤ 2, or 1 for
 * short words). Returns null when nothing changed.
 */
export function suggestCorrection(query: string, vocabulary: string[]) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let changed = false;
  const corrected = words.map((w) => {
    if (w.length < 3 || vocabulary.includes(w)) return w;
    const limit = w.length <= 4 ? 1 : 2;
    let best: string | null = null;
    let bestD = Infinity;
    for (const v of vocabulary) {
      if (Math.abs(v.length - w.length) > limit) continue;
      const d = distance(w, v);
      if (d < bestD) {
        bestD = d;
        best = v;
      }
    }
    if (best && bestD <= limit) {
      changed = true;
      return best;
    }
    return w;
  });
  return changed ? corrected.join(" ") : null;
}
