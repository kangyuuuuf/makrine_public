import heroImg from '../assets/allproduct.png'
import webAssert11 from '../assets/web/webAssert11.avif'
import webAssert12 from '../assets/web/webAssert12.avif'
import {
  getCategoryFilterOptionsForAllDivisions,
  getCategoryFilterOptionsForDivision,
} from './navCatalogConfig.js'

/** @typedef {'all' | 'life-saving' | 'fire-fighting'} CatalogDivisionId */

export const DIVISION_SLUGS = /** @type {const} */ ({
  ALL: 'all',
  LIFE_SAVING: 'life-saving',
  FIRE_FIGHTING: 'fire-fighting',
})

/** @type {CatalogDivisionId[]} */
export const DIVISION_ORDER = ['all', 'life-saving', 'fire-fighting']

export const DIVISION_LABELS = {
  all: 'All Products',
  'life-saving': 'Life Saving Equipment',
  'fire-fighting': 'Fire Fighting Equipment',
}

/**
 * @type {Record<CatalogDivisionId, { title: string; paragraphs: string[]; image: string }>}
 */
export const CATALOG_HERO_BY_DIVISION = {
  all: {
    title: 'All Products',
    paragraphs: [''],
    image: heroImg,
  },
  'life-saving': {
    title: 'Life Saving Equipment',
    paragraphs: [
      'Makrine delivers a complete one-stop range of lifesaving equipment, with every single product manufactured undergoing strict testing and meeting international approvals including CCS, MED, and USCG.',
      'We combine competitive pricing with exceptional product quality, ensuring that customers receive reliable high-performance equipment with responsive service.',
    ],
    image: webAssert12,
  },
  'fire-fighting': {
    title: 'Fire Fighting Equipment',
    paragraphs: [
      'Makrine provides a complete one-stop selection of marine firefighting equipment, with every product rigorously tested. With Makrine, customers gain dependable, certified firefighting solutions known for exceptional durability, stable performance, and reliable service.',
    ],
    image: webAssert11,
  },
}

/** Category filters are derived from the same nav tree as the mega menu. */
export const FILTER_GROUPS_BY_DIVISION = {
  all: {
    categories: getCategoryFilterOptionsForAllDivisions(),
  },
  'life-saving': {
    categories: getCategoryFilterOptionsForDivision('life-saving'),
  },
  'fire-fighting': {
    categories: getCategoryFilterOptionsForDivision('fire-fighting'),
  },
}

export const FILTER_GROUPS = {
  availability: [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'limited', label: 'Limited' },
  ],
  approvals: [
    { value: 'ccs', label: 'CCS' },
    { value: 'uscg', label: 'USCG' },
    { value: 'med-solas', label: 'MED/SOLAS' },
    { value: 'iecex', label: 'IECEx' },
    { value: 'atex', label: 'ATEX' },
    { value: 'mer', label: 'MER' },
    { value: 'rina', label: 'RINA' },
  ],
}

/**
 * @param {string | undefined} slug
 * @returns {CatalogDivisionId | null}
 */
export function parseDivisionSlug(slug) {
  if (
    slug === DIVISION_SLUGS.ALL ||
    slug === DIVISION_SLUGS.LIFE_SAVING ||
    slug === DIVISION_SLUGS.FIRE_FIGHTING
  ) {
    return slug
  }
  return null
}
