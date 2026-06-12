/**
 * Featured products shown on the homepage carousel.
 * Edit this list to customize which products appear — order is preserved.
 *
 * Each entry:
 * - string — product slug, uses FEATURED_DEFAULT_INTERVAL_MS
 * - { slug, intervalMs? } — per-product display time in milliseconds
 *
 * Slugs must match public/data/products_web_display.json.
 */

/** @typedef {{ slug: string, intervalMs?: number } | string} FeaturedProductEntry */

/** @type {FeaturedProductEntry[]} */
export const FEATURED_PRODUCTS = [
  { slug: 'portable-9l-foam-fe-pfos-pfoa-free-cartridge-hy-f9c', intervalMs: 10_000 },
  { slug: 'scba-carbon-fiber' },
  { slug: 'eebd-15min' },
  { slug: 'explosion-proof-lifebuoy-light'},
]

/** Default auto-advance interval when an entry omits intervalMs */
export const FEATURED_DEFAULT_INTERVAL_MS = 4_000

/** Max specification lines shown per slide */
export const FEATURED_SPEC_LIMIT = 4

/**
 * @param {FeaturedProductEntry} entry
 */
export function normalizeFeaturedProductEntry(entry) {
  if (typeof entry === 'string') {
    const slug = entry.trim()
    return { slug, intervalMs: FEATURED_DEFAULT_INTERVAL_MS }
  }

  const slug = typeof entry.slug === 'string' ? entry.slug.trim() : ''
  return {
    slug,
    intervalMs:
      typeof entry.intervalMs === 'number' && entry.intervalMs > 0
        ? entry.intervalMs
        : FEATURED_DEFAULT_INTERVAL_MS,
  }
}
