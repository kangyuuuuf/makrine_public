/**
 * Top-level navbar sections → category groups → leaf subcategories.
 * Leaf `id` values map to `product.category` and shop URL `?category=` params.
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
        label: 'Life-saving Equipment',
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
        label: 'Thermal & Protective',
        children: [
          { id: 'immersion-suits', label: 'Immersion Suits' },
          { id: 'chemical-protective-suits', label: 'Chemical Protective Suits' },
          { id: 'thermal-protective-aids', label: 'Thermal Protective Aids' },
        ],
      },
      {
        id: 'line-throwing-device',
        label: 'Line-Throwing Device',
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
          { id: 'fire-hose-hydrant-systems', label: 'Fire Hose & Hydrant Systems' },
        ],
      },
      {
        id: 'grp-firefighting-equipment',
        label: 'Firefighting Equipment',
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
          { id: 'box-ladder-rope', label: 'Box, Ladder, Rope' },
          { id: 'toolkit-accessories', label: 'Toolkit & Accessories' },
          { id: 'miscellaneous-small-items', label: 'Miscellaneous Small Items' },
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
 * @param {string} value
 * @returns {'life-saving' | 'fire-fighting' | null}
 */
export function getDivisionForCategoryValue(value) {
  for (const section of NAVBAR_SECTIONS) {
    for (const g of section.groups) {
      const leaves = leavesFromGroup(g)
      if (leaves.some((l) => l.value === value)) return section.division
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
 * Shop URL with query params (shareable, works with browser history).
 * @param {'life-saving' | 'fire-fighting'} division
 * @param {string} [categoryId] — leaf category slug（与 `group` 二选一）
 * @param {{ group?: string }} [options] — 大类 id，选中该组下全部子类
 */
export function buildShopUrl(division, categoryId, options) {
  const params = new URLSearchParams({ division })
  if (options?.group) {
    params.set('group', options.group)
  } else if (categoryId) {
    params.set('category', categoryId)
  }
  const q = params.toString()
  return q ? `/shop?${q}` : '/shop'
}
