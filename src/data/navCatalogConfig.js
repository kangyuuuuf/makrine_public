/**
 * Top-level navbar sections -> category groups -> display-only leaf labels.
 * Filterable unit is the parent group’s `subcategory_id` (see `NAV_GROUP_TO_SUBCATEGORY`).
 * URL `?category=` uses those subcategory slugs; leaf ids are legacy aliases only.
 */

/** @typedef {{ id: string; label: string }} NavLeaf */

/**
 * @typedef {Object} NavCategoryGroup
 * @property {string} id — slug when this row is itself the only leaf (no children)
 * @property {string} label — group heading shown in the mega menu
 * @property {NavLeaf[]} [children] — omit or empty → group row navigates as a single leaf
 */

/**
 * @typedef {Object} NavbarSection
 * @property {string} id
 * @property {string} label — top-level nav label
 * @property {'life-saving' | 'fire-fighting'} division
 * @property {NavCategoryGroup[]} groups
 */

/** @type {NavbarSection[]} */
export const NAVBAR_SECTIONS = [
  {
    id: 'nav-life-saving',
    label: 'Life Saving Equipment',
    division: 'life-saving',
    groups: [
      {
        id: 'grp-life-saving-equipment',
        label: 'Life Jacket / Life Buoy',
        children: [
          { id: 'life-jackets', label: 'Life Jackets' },
          { id: 'inflatable-life-jackets', label: 'Inflatable Life Jackets' },
          { id: 'life-buoys', label: 'Life Buoys' },
        ],
      },
      {
        id: 'grp-lights',
        label: 'Lights',
        children: [
          { id: 'life-buoy-lights', label: 'Life Buoy Lights' },
          { id: 'life-jacket-lights', label: 'Life Jacket Lights' },
          { id: 'explosion-proof-lights', label: 'Explosion-proof Lights' },
        ],
      },
      {
        id: 'grp-thermal-protective',
        label: 'Immersion Suits & Protective Suits',
        children: [
          { id: 'immersion-suits', label: 'Immersion Suits' },
          { id: 'chemical-protective-suits', label: 'Chemical Protective Suits' },
          { id: 'thermal-protective-aids', label: 'Thermal Protective Aids' },
        ],
      },
      {
        id: 'line-throwing-device',
        label: 'Pneumatic Line Throwing Equipment',
        children: [],
      },
      {
        id: 'life-rafts',
        label: 'Life Rafts',
        children: [],
      },
    ],
  },
  {
    id: 'nav-fire-fighting',
    label: 'Fire Fighting Equipment',
    division: 'fire-fighting',
    groups: [
      {
        id: 'grp-fire-extinguishers',
        label: 'Fire Extinguishers',
        children: [
          { id: 'co2-fire-extinguishers', label: 'CO2 Fire Extinguishers' },
          { id: 'dry-powder-fire-extinguishers', label: 'Dry Powder Fire Extinguishers' },
          { id: 'foam-fire-extinguishers', label: 'Foam Fire Extinguishers' },
          { id: 'other-fire-extinguishers', label: 'Other Fire Extinguishers' },
        ],
      },
      {
        id: 'grp-fire-hose',
        label: 'Fire Hose',
        children: [
          { id: 'hose-coupling', label: 'Hose Coupling' },
          { id: 'i-s-c', label: 'I.S.C' },
          { id: 'fire-nozzle', label: 'Fire Nozzle' },
          { id: 'cap', label: 'Cap' },
        ],
      },
      {
        id: 'grp-firefighting-equipment',
        label: "Firefighter's Equipment",
        children: [
          { id: 'breathing-apparatus', label: 'Breathing Apparatus' },
          { id: 'firefighter-protective-gear', label: 'Firefighter Protective Gear' },
          { id: 'firefighting-tools-accessories', label: 'Firefighting Tools & Accessories' },
        ],
      },
      {
        id: 'grp-tools-misc',
        label: 'Tools & Miscellaneous',
        children: [
          { id: 'calibration-tool', label: 'Calibration Tool' },
          { id: 'imo-signs', label: 'IMO Signs' },
          { id: 'ladder', label: 'Ladder' },
        ],
      },
    ],
  },
]

/**
 * @param {NavCategoryGroup} group
 * @returns {{ value: string; label: string }[]}
 */
function leavesFromGroup(group) {
  if (group.children && group.children.length > 0) {
    return group.children.map((c) => ({ value: c.id, label: c.label }))
  }
  return [{ value: group.id, label: group.label }]
}

/**
 * Flat checkbox list for the catalog sidebar (one entry per filterable leaf).
 * @param {'life-saving' | 'fire-fighting'} division
 */
export function getCategoryFilterOptionsForDivision(division) {
  const section = NAVBAR_SECTIONS.find((s) => s.division === division)
  if (!section) return []
  /** @type {{ value: string; label: string }[]} */
  const out = []
  for (const g of section.groups) {
    out.push(...leavesFromGroup(g))
  }
  return out
}

/**
 * Flat checkbox list for all divisions combined.
 * @returns {{ value: string; label: string }[]}
 */
export function getCategoryFilterOptionsForAllDivisions() {
  /** @type {{ value: string; label: string }[]} */
  const out = []
  for (const section of NAVBAR_SECTIONS) {
    for (const g of section.groups) {
      out.push(...leavesFromGroup(g))
    }
  }
  return out
}

/**
 * Nav group id → `products_web_display.json` `subcategory_id` (sidebar / product filter).
 * @type {Record<string, string>}
 */
export const NAV_GROUP_TO_SUBCATEGORY = {
  'grp-life-saving-equipment': 'life-jacket-life-buoy',
  'grp-lights': 'lights',
  'grp-thermal-protective': 'immersion-suits-protective-suits',
  'line-throwing-device': 'pneumatic-line-throwing-equipment',
  'life-rafts': 'life-rafts',
  'grp-fire-extinguishers': 'fire-extinguishers',
  'grp-fire-hose': 'fire-hose',
  'grp-firefighting-equipment': 'firefighters-equipment',
  'grp-tools-misc': 'tools-miscellaneous',
}

/**
 * @param {string} groupId — `NavCategoryGroup.id`
 * @returns {string | null}
 */
export function getSubcategoryIdForNavGroup(groupId) {
  if (typeof groupId !== 'string' || !groupId.trim()) return null
  return NAV_GROUP_TO_SUBCATEGORY[groupId.trim()] ?? null
}

/**
 * @param {string} value — subcategory id, nav group id, or legacy nav leaf id
 * @returns {'life-saving' | 'fire-fighting' | null}
 */
export function getDivisionForCategoryValue(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  const normalized = value.trim()

  for (const section of NAVBAR_SECTIONS) {
    for (const g of section.groups) {
      const subcategoryId = getSubcategoryIdForNavGroup(g.id)
      if (subcategoryId === normalized) return section.division
      const leaves = leavesFromGroup(g)
      if (leaves.some((l) => l.value === normalized)) return section.division
    }
  }

  if (Object.values(NAV_GROUP_TO_SUBCATEGORY).includes(normalized)) {
    for (const section of NAVBAR_SECTIONS) {
      for (const g of section.groups) {
        if (getSubcategoryIdForNavGroup(g.id) === normalized) return section.division
      }
    }
  }

  return null
}

/**
 * 某一大类（含子类的分组）下的所有叶子 category slug，用于 `?group=` 展开为多选筛选。
 * 无子类的分组返回单元素数组（与点叶子链接等价）。
 * @param {'life-saving' | 'fire-fighting'} division
 * @param {string} groupId — `NavCategoryGroup.id`
 * @returns {string[] | null} — 无效 id 时返回 null
 */
export function getLeafCategoryIdsForGroup(division, groupId) {
  const section = NAVBAR_SECTIONS.find((s) => s.division === division)
  if (!section) return null
  const group = section.groups.find((g) => g.id === groupId)
  if (!group) return null
  const leaves = leavesFromGroup(group)
  return leaves.map((l) => l.value)
}

/**
 * @param {string} groupId
 * @returns {'life-saving' | 'fire-fighting' | null}
 */
export function getDivisionForGroupId(groupId) {
  for (const section of NAVBAR_SECTIONS) {
    if (section.groups.some((g) => g.id === groupId)) return section.division
  }
  return null
}

/**
 * Nav / sidebar leaf ids → `products_web_display.json` `subcategory_id` values.
 * @type {Record<string, string[]>}
 */
export const NAV_LEAF_TO_SUBCATEGORIES = {
  'life-jackets': ['life-jacket-life-buoy'],
  'inflatable-life-jackets': ['life-jacket-life-buoy'],
  'life-buoys': ['life-jacket-life-buoy'],
  'life-buoy-lights': ['lights'],
  'life-jacket-lights': ['lights'],
  'explosion-proof-lights': ['lights'],
  'immersion-suits': ['immersion-suits-protective-suits'],
  'chemical-protective-suits': ['immersion-suits-protective-suits'],
  'thermal-protective-aids': ['immersion-suits-protective-suits'],
  'line-throwing-device': ['pneumatic-line-throwing-equipment'],
  'life-rafts': ['life-rafts'],
  'co2-fire-extinguishers': ['fire-extinguishers'],
  'dry-powder-fire-extinguishers': ['fire-extinguishers'],
  'foam-fire-extinguishers': ['fire-extinguishers'],
  'other-fire-extinguishers': ['fire-extinguishers'],
  'hose-coupling': ['fire-hose'],
  'i-s-c': ['fire-hose'],
  'fire-nozzle': ['fire-hose'],
  cap: ['fire-hose'],
  'breathing-apparatus': ['firefighters-equipment'],
  'firefighter-protective-gear': ['firefighters-equipment'],
  'firefighting-tools-accessories': ['firefighters-equipment'],
  'calibration-tool': ['tools-miscellaneous'],
  'imo-signs': ['tools-miscellaneous'],
  ladder: ['tools-miscellaneous'],
}

/**
 * @param {string} categoryId — subcategory id, nav group id, or legacy nav leaf id
 * @returns {string[]}
 */
export function expandCategoryFilterToSubcategoryIds(categoryId) {
  if (typeof categoryId !== 'string' || !categoryId.trim()) return []
  const normalized = categoryId.trim()

  const fromGroup = getSubcategoryIdForNavGroup(normalized)
  if (fromGroup) return [fromGroup]

  const mapped = NAV_LEAF_TO_SUBCATEGORIES[normalized]
  if (mapped?.length) return mapped

  if (Object.values(NAV_GROUP_TO_SUBCATEGORY).includes(normalized)) return [normalized]

  return [normalized]
}

/**
 * @param {Iterable<string>} categoryIds
 * @returns {Set<string>}
 */
export function expandCategoryFiltersToSubcategorySet(categoryIds) {
  const result = new Set()
  for (const categoryId of categoryIds) {
    for (const subcategoryId of expandCategoryFilterToSubcategoryIds(categoryId)) {
      result.add(subcategoryId)
    }
  }
  return result
}

/**
 * Product URL with query params (shareable, works with browser history).
 * @param {'life-saving' | 'fire-fighting'} division
 * @param {string} [categoryId] — subcategory slug, nav group id, or legacy leaf id
 * @param {{ group?: string }} [options] — legacy: nav group id → same subcategory as group title
 */
export function buildShopUrl(division, categoryId, options) {
  const params = new URLSearchParams({ division })
  const raw = options?.group ?? categoryId
  if (raw) {
    const subcategoryIds = expandCategoryFilterToSubcategoryIds(raw)
    if (subcategoryIds[0]) params.set('category', subcategoryIds[0])
  }
  const q = params.toString()
  return q ? `/product?${q}` : '/product'
}
