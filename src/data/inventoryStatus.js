export const INVENTORY_API_ENDPOINT =
  import.meta.env.VITE_INVENTORY_API_URL || '/public/inventory-status'

const API_STATUS_TO_AVAILABILITY = {
  'in stock': 'in_stock',
  in_stock: 'in_stock',
  limited: 'limited',
}

/**
 * A product can represent several variants with comma-separated SKUs.
 * Placeholder SKUs must never be sent to the public inventory API.
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeInventorySkus(value) {
  if (typeof value !== 'string') return []

  return [...new Set(
    value
      .split(',')
      .map((sku) => sku.trim())
      .filter((sku) => sku && sku.toUpperCase() !== 'TODO'),
  )]
}

/** @param {unknown} value */
export function normalizeInventoryStatus(value) {
  if (typeof value !== 'string') return 'unknown'
  return API_STATUS_TO_AVAILABILITY[value.trim().toLowerCase()] ?? 'unknown'
}

/**
 * Resolve a single card status from one or more product SKUs. Limited takes
 * precedence so a product family never overstates variant availability.
 * @param {Record<string, 'in_stock' | 'limited'> | null | undefined} statusMap
 * @param {unknown} skuValue
 */
export function getInventoryStatusForProduct(statusMap, skuValue) {
  if (!statusMap || typeof statusMap !== 'object') return 'unknown'

  const statuses = normalizeInventorySkus(skuValue)
    .map((sku) => statusMap[sku])
    .filter(Boolean)

  if (statuses.includes('limited')) return 'limited'
  if (statuses.includes('in_stock')) return 'in_stock'
  return 'unknown'
}

/**
 * @param {unknown[]} skuValues
 * @returns {string[]}
 */
export function collectInventorySkus(skuValues) {
  return [...new Set(skuValues.flatMap((value) => normalizeInventorySkus(value)))]
}

/**
 * @param {unknown[]} skuValues
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Record<string, 'in_stock' | 'limited'>>}
 */
export async function fetchInventoryStatusMap(skuValues, options = {}) {
  const skus = collectInventorySkus(Array.isArray(skuValues) ? skuValues : [])
  if (!INVENTORY_API_ENDPOINT || skus.length === 0) return {}

  const response = await fetch(INVENTORY_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skus),
    signal: options.signal,
  })

  if (!response.ok) throw new Error(`Failed to load inventory status: ${response.status}`)

  const data = await response.json()
  if (!Array.isArray(data)) return {}

  const requestedSkus = new Set(skus)
  const statusMap = {}

  for (const item of data) {
    if (!item || typeof item !== 'object' || typeof item.sku !== 'string') continue
    const sku = item.sku.trim()
    const status = normalizeInventoryStatus(item.status)
    if (requestedSkus.has(sku) && status !== 'unknown') statusMap[sku] = status
  }

  return statusMap
}
