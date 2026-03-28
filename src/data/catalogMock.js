import heroImg from '../assets/hero.png'
import homePic1 from '../assets/homePic1.png'
import homePic2 from '../assets/homePic2.png'
import webAssert11 from '../assets/web/webAssert11.avif'
import webAssert12 from '../assets/web/webAssert12.avif'
import { CATALOG_PRODUCT_EXAMPLES } from './catalogProductExamples.js'
import { getCategoryFilterOptionsForDivision } from './navCatalogConfig.js'

/** @typedef {'in_stock' | 'limited' | 'out_of_stock'} StockStatus */

/** @typedef {'life-saving' | 'fire-fighting'} CatalogDivisionId */

/**
 * @typedef {Object} CatalogProduct
 * @property {string} id
 * @property {string} name
 * @property {string} [shortDescription]
 * @property {string} image
 * @property {CatalogDivisionId} division
 * @property {string} category
 * @property {StockStatus} availability
 * @property {string[]} certifications
 */

export const DIVISION_SLUGS = /** @type {const} */ ({
  LIFE_SAVING: 'life-saving',
  FIRE_FIGHTING: 'fire-fighting',
})

/** @type {CatalogDivisionId[]} */
export const DIVISION_ORDER = ['life-saving', 'fire-fighting']

export const DIVISION_LABELS = {
  'life-saving': 'Life Saving Equipment',
  'fire-fighting': 'Fire Fighting Equipment',
}

/**
 * @type {Record<CatalogDivisionId, { title: string; paragraphs: string[]; image: string }>}
 */
export const CATALOG_HERO_BY_DIVISION = {
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

/** Category filters are derived from the same nav tree as the mega menu (single source of truth). */
export const FILTER_GROUPS_BY_DIVISION = {
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
    { value: 'out_of_stock', label: 'Out of Stock' },
  ],
  certifications: [
    { value: 'CCS', label: 'CCS' },
    { value: 'MED', label: 'MED' },
    { value: 'USCG', label: 'USCG' },
  ],
}

/** @type {CatalogProduct[]} */
export const MOCK_PRODUCTS = [
  {
    id: 'ls-301',
    name: 'MK-Ocean Pro SOLAS Lifejacket 275N',
    shortDescription: 'Twin-chamber inflatable with harness points; MED & SOLAS approved.',
    image: homePic1,
    division: 'life-saving',
    category: 'life-jackets',
    availability: 'in_stock',
    certifications: ['MED', 'USCG'],
  },
  {
    id: 'ls-112',
    name: 'Arctic-Line Immersion Suit — Insulated',
    shortDescription: 'Thermal protection for cold-water operations; periodic service kits available.',
    image: homePic2,
    division: 'life-saving',
    category: 'immersion-suits',
    availability: 'limited',
    certifications: ['CCS', 'MED'],
  },
  {
    id: 'ls-044',
    name: 'HDPE Lifebuoy 30" — SOLAS Ring',
    shortDescription: 'Retro-reflective tape and grab-line; bulk fleet pricing on inquiry.',
    image: homePic2,
    division: 'life-saving',
    category: 'life-buoys',
    availability: 'in_stock',
    certifications: ['MED', 'USCG'],
  },
  {
    id: 'ls-208',
    name: 'Throwing Line Container — Quick-Deploy',
    shortDescription: 'UV-stabilized case; compatible with standard deck mounts.',
    image: homePic1,
    division: 'life-saving',
    category: 'line-throwing-device',
    availability: 'in_stock',
    certifications: ['CCS'],
  },
  {
    id: 'ls-519',
    name: 'Twin-Cell Work Vest 150N',
    shortDescription: 'Deck crew PPE with crotch strap and D-ring tether.',
    image: heroImg,
    division: 'life-saving',
    category: 'inflatable-life-jackets',
    availability: 'out_of_stock',
    certifications: ['MED'],
  },
  {
    id: 'ls-077',
    name: 'Emergency Drinking Water — Survival Pack',
    shortDescription: 'FOIL sachets; five-year shelf life; pallet quantities.',
    image: homePic2,
    division: 'life-saving',
    category: 'life-rafts',
    availability: 'limited',
    certifications: ['USCG', 'MED'],
  },
  {
    id: 'ls-633',
    name: 'Self-Righting Line — Inflatable Liferaft',
    shortDescription: 'Spare equipment for davit-launched ISO liferafts.',
    image: homePic1,
    division: 'life-saving',
    category: 'life-rafts',
    availability: 'in_stock',
    certifications: ['CCS', 'MED', 'USCG'],
  },
  {
    id: 'ls-401',
    name: 'Anti-Suffocation Immersion Hood',
    shortDescription: 'One-size interface for compatible suit systems.',
    image: heroImg,
    division: 'life-saving',
    category: 'immersion-suits',
    availability: 'in_stock',
    certifications: ['MED'],
  },
  {
    id: 'ff-201',
    name: 'CO₂ Marine Extinguisher 5 kg',
    shortDescription: 'Steel body; bracket mount; MED & SOLAS compatible ratings.',
    image: homePic1,
    division: 'fire-fighting',
    category: 'co2-fire-extinguishers',
    availability: 'in_stock',
    certifications: ['MED', 'USCG'],
  },
  {
    id: 'ff-318',
    name: 'Deck Hose Assembly 2.5" × 15 m',
    shortDescription: 'EPDM liner; brass storz couplings; LR inspection tags on request.',
    image: heroImg,
    division: 'fire-fighting',
    category: 'fire-hose-hydrant-systems',
    availability: 'limited',
    certifications: ['CCS', 'MED'],
  },
  {
    id: 'ff-092',
    name: 'Aluminium Fire Nozzle — Jet/Spray',
    shortDescription: 'Pistol-grip control; suitable for shipboard manifolds up to 16 bar.',
    image: homePic2,
    division: 'fire-fighting',
    category: 'fire-hose-hydrant-systems',
    availability: 'in_stock',
    certifications: ['MED'],
  },
  {
    id: 'ff-445',
    name: 'Proximity Fire Suit — Aluminized',
    shortDescription: 'Three-layer radiant heat barrier; compatible with SCBA back-mount.',
    image: homePic1,
    division: 'fire-fighting',
    category: 'firefighter-protective-gear',
    availability: 'in_stock',
    certifications: ['CCS', 'MED', 'USCG'],
  },
  {
    id: 'ff-510',
    name: 'Smoke & Heat Detector Head — Marine',
    shortDescription: 'Addressable loop device; IP44 enclosure for accommodation spaces.',
    image: homePic2,
    division: 'fire-fighting',
    category: 'miscellaneous-small-items',
    availability: 'out_of_stock',
    certifications: ['MED'],
  },
  {
    id: 'ff-120',
    name: 'Dry Chemical Extinguisher 6 kg ABC',
    shortDescription: 'Annual service kits and hydrotest documentation available.',
    image: heroImg,
    division: 'fire-fighting',
    category: 'dry-powder-fire-extinguishers',
    availability: 'in_stock',
    certifications: ['USCG', 'MED'],
  },
  ...CATALOG_PRODUCT_EXAMPLES,
]

/**
 * @param {string | undefined} slug
 * @returns {CatalogDivisionId | null}
 */
export function parseDivisionSlug(slug) {
  if (slug === DIVISION_SLUGS.LIFE_SAVING || slug === DIVISION_SLUGS.FIRE_FIGHTING) {
    return slug
  }
  return null
}
