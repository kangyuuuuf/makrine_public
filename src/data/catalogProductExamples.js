/**
 * 演示用示例商品：覆盖导航中尚未有实体的叶子分类，便于本地预览筛选与列表。
 * 与 navCatalogConfig 中的 category slug 一一对应。
 */
import heroImg from '../assets/hero.png'
import homePic1 from '../assets/homePic1.png'
import homePic2 from '../assets/homePic2.png'

/** 与 `catalogMock` 中 `MOCK_PRODUCTS` 项结构一致 */
export const CATALOG_PRODUCT_EXAMPLES = [
  /* Life-saving — Lights */
  {
    id: 'ex-ls-lbl-01',
    name: 'SOLAS LED Life Buoy Light — Flash 75 cd',
    shortDescription: 'Automatic water activation; minimum 2 h steady output; MED approved.',
    image: homePic1,
    division: 'life-saving',
    category: 'life-buoy-lights',
    availability: 'in_stock',
    certifications: ['MED', 'USCG'],
  },
  {
    id: 'ex-ls-ljl-01',
    name: 'PFD Strobe — Life Jacket Mount',
    shortDescription: 'Compact strobes for work vests; IP67 housing; replaceable cell pack.',
    image: homePic2,
    division: 'life-saving',
    category: 'life-jacket-lights',
    availability: 'limited',
    certifications: ['MED'],
  },
  {
    id: 'ex-ls-exp-01',
    name: 'Ex-proof Deck Floodlight — Zone 1',
    shortDescription: 'ATEX/IECEx for hazardous cargo areas; low-glare diffuser option.',
    image: heroImg,
    division: 'life-saving',
    category: 'explosion-proof-lights',
    availability: 'in_stock',
    certifications: ['CCS'],
  },
  /* Life-saving — Thermal & Protective */
  {
    id: 'ex-ls-chem-01',
    name: 'Chemical Splash Coverall — Type 3',
    shortDescription: 'Sealed seams; compatible with common SCBA face seals.',
    image: homePic2,
    division: 'life-saving',
    category: 'chemical-protective-suits',
    availability: 'in_stock',
    certifications: ['MED'],
  },
  {
    id: 'ex-ls-tpa-01',
    name: 'Thermal Protective Aid — SOLAS Pack',
    shortDescription: 'Insulated body cover for survival craft; compact vacuum pack.',
    image: homePic1,
    division: 'life-saving',
    category: 'thermal-protective-aids',
    availability: 'limited',
    certifications: ['MED', 'USCG'],
  },
  /* Fire fighting — extinguishers & hose */
  {
    id: 'ex-ff-foam-01',
    name: 'Foam Extinguisher 9 L — AFFF Marine',
    shortDescription: 'Stainless cylinder; brass valve; bracket kit included.',
    image: homePic1,
    division: 'fire-fighting',
    category: 'foam-fire-extinguishers',
    availability: 'in_stock',
    certifications: ['MED', 'USCG'],
  },
  {
    id: 'ex-ff-oth-01',
    name: 'Clean-Agent Extinguisher 4 kg — FE-36',
    shortDescription: 'For E-room and switchboard spaces; low residue.',
    image: heroImg,
    division: 'fire-fighting',
    category: 'other-fire-extinguishers',
    availability: 'limited',
    certifications: ['MED'],
  },
  {
    id: 'ex-ff-ba-01',
    name: 'SCBA Set 6.8 L — Cylinder & Harness',
    shortDescription: 'Positive pressure demand valve; buddy-breathing port optional.',
    image: homePic2,
    division: 'fire-fighting',
    category: 'breathing-apparatus',
    availability: 'in_stock',
    certifications: ['CCS', 'MED'],
  },
  {
    id: 'ex-ff-tools-01',
    name: 'Fire Axe & Halligan Kit — Stow Bag',
    shortDescription: 'Forged heads; non-sparking striking face option.',
    image: homePic1,
    division: 'fire-fighting',
    category: 'firefighting-tools-accessories',
    availability: 'in_stock',
    certifications: ['USCG'],
  },
  {
    id: 'ex-ff-box-01',
    name: 'Fiberglass Hose Box — 2.5" × 15 m',
    shortDescription: 'UV-stable lid; quick-release latch; deck mount hardware.',
    image: homePic2,
    division: 'fire-fighting',
    category: 'box-ladder-rope',
    availability: 'in_stock',
    certifications: ['MED'],
  },
  {
    id: 'ex-ff-toolkit-01',
    name: 'Annual Service Toolkit — Extinguishers',
    shortDescription: 'Gauges, O-rings, tamper seals; refill adapters sold separately.',
    image: heroImg,
    division: 'fire-fighting',
    category: 'toolkit-accessories',
    availability: 'limited',
    certifications: ['MED'],
  },
]
