export const INVENTORY_API_ENDPOINT = import.meta.env.VITE_INVENTORY_API_URL || '/api/inventory-status'

const VALID_STATUS = new Set(['in_stock', 'limited', 'unknown'])

export function normalizeInventoryStatus(value) {
  return VALID_STATUS.has(value) ? value : 'unknown'
}

export function getInventoryStatusForProduct(statusMap, productId) {
  if (!statusMap || typeof statusMap !== 'object') return 'unknown'
  return normalizeInventoryStatus(statusMap[productId])
}

export async function fetchInventoryStatusMap() {
  if (!INVENTORY_API_ENDPOINT) return {}

  const response = await fetch(INVENTORY_API_ENDPOINT)
  if (!response.ok) throw new Error(`Failed to load inventory status: ${response.status}`)

  const data = await response.json().catch(() => ({}))
  return data?.items && typeof data.items === 'object' ? data.items : {}
}
