/** encodeURIComponent leaves () unencoded; Vite treats those URLs as SPA routes. */
function encodePublicPathSegment(segment) {
  return encodeURIComponent(segment).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`,
  )
}

export function normalizePublicImagePath(path) {
  if (typeof path !== 'string' || !path.trim()) return ''
  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalized = path.trim().replace(/^\/+/, '')
  const encoded = normalized
    .split('/')
    .filter(Boolean)
    .map((segment) => encodePublicPathSegment(segment))
    .join('/')
  return `${baseUrl}${encoded}`
}

/** @param {string} name */
export function normalizeProductNameForImageMatch(name) {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/suite/g, 'suit')
    .replace(/\//g, ':')
    .replace(/w\/o/g, 'w:o')
    .replace(/w\//g, 'w:')
}

/**
 * @param {{ title?: string; images?: string[] }} product
 * @param {{ byNormalizedTitle?: Record<string, string[]> } | null} imageIndex
 * @returns {string[]}
 */
export function resolveProductImagePaths(product, imageIndex) {
  const fromJson = Array.isArray(product?.images)
    ? product.images.filter((img) => typeof img === 'string' && img.trim())
    : []
  if (fromJson.length > 0) return fromJson

  const title = product?.title
  if (!hasNonEmptyString(title) || !imageIndex?.byNormalizedTitle) return []

  const key = normalizeProductNameForImageMatch(title)
  return imageIndex.byNormalizedTitle[key] ?? []
}

/** Approval code (lowercase slug) → image filename under public/data/approval/ */
const APPROVAL_IMAGE_FILE_ALIASES = {
  ccs: 'css',
}

/**
 * @param {string} label
 * @returns {string | null}
 */
export function getApprovalImageSrc(label) {
  if (!hasNonEmptyString(label)) return null
  const slug = label.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!slug) return null
  const fileSlug = APPROVAL_IMAGE_FILE_ALIASES[slug] ?? slug
  return normalizePublicImagePath(`data/approval/${fileSlug}.png`)
}

/**
 * @param {string} label
 * @returns {{ label: string; imageSrc: string | null }}
 */
export function mapApprovalToDisplay(label) {
  const trimmed = label.trim()
  return {
    label: trimmed,
    imageSrc: getApprovalImageSrc(trimmed),
  }
}

/**
 * @param {string[]} approvals
 * @returns {{ label: string; imageSrc: string | null }[]}
 */
export function mapApprovalsToDisplay(approvals) {
  if (!Array.isArray(approvals)) return []
  return approvals.filter((item) => hasNonEmptyString(item)).map((item) => mapApprovalToDisplay(item))
}

const CATEGORY_ID_TO_DIVISION = {
  'life-saving-equipment': 'life-saving',
  'fire-fighting-equipment': 'fire-fighting',
}

export function flattenProductsFromWebDisplay(catalog) {
  if (!catalog?.categories || !Array.isArray(catalog.categories)) return []

  const products = []
  for (const category of catalog.categories) {
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) {
        products.push(product)
      }
    }
  }
  return products
}

export function findProductBySlug(products, slug) {
  if (typeof slug !== 'string' || !slug.trim()) return null
  const normalized = slug.trim()
  return products.find((item) => item?.slug === normalized) || null
}

export function hasNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function hasNonEmptyStringArray(value) {
  return Array.isArray(value) && value.some((item) => hasNonEmptyString(item))
}

/**
 * @param {unknown} value
 * @returns {{ title?: string; items: string[] }[] | null}
 */
export function parseFlexibleListField(value) {
  if (value == null) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [{ items: [trimmed] }] : null
  }

  if (!Array.isArray(value) || value.length === 0) return null

  const allStrings = value.every((item) => typeof item === 'string')
  if (allStrings) {
    const items = value.map((item) => item.trim()).filter(Boolean)
    return items.length ? [{ items }] : null
  }

  const groups = []
  for (const entry of value) {
    if (typeof entry === 'string') {
      const trimmed = entry.trim()
      if (trimmed) groups.push({ items: [trimmed] })
      continue
    }

    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue

    for (const [rawTitle, rawItems] of Object.entries(entry)) {
      const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''
      const items = normalizeFlexibleItems(rawItems)
      if (items.length > 0) {
        groups.push(title ? { title, items } : { items })
      }
    }
  }

  return groups.length ? groups : null
}

/**
 * @param {unknown} attributes
 * @returns {{ key: string; label: string; value: string }[] | null}
 */
export function parseAttributesField(attributes) {
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) return null

  const entries = Object.entries(attributes)
    .map(([key, rawValue]) => {
      const label = formatAttributeLabel(key)
      const value = formatAttributeValue(rawValue)
      if (!label || !value) return null
      return { key, label, value }
    })
    .filter(Boolean)

  return entries.length ? entries : null
}

function normalizeFlexibleItems(rawItems) {
  if (typeof rawItems === 'string') {
    const trimmed = rawItems.trim()
    return trimmed ? [trimmed] : []
  }

  if (!Array.isArray(rawItems)) return []

  return rawItems
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

function formatAttributeLabel(key) {
  if (typeof key !== 'string' || !key.trim()) return ''
  return key
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatAttributeValue(rawValue) {
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim()
    return trimmed || ''
  }

  if (Array.isArray(rawValue)) {
    const items = rawValue
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
    return items.join(', ')
  }

  if (rawValue != null && typeof rawValue === 'object') {
    return Object.entries(rawValue)
      .map(([key, value]) => {
        const nested = formatAttributeValue(value)
        return nested ? `${formatAttributeLabel(key)}: ${nested}` : ''
      })
      .filter(Boolean)
      .join('; ')
  }

  return ''
}

/**
 * @param {ReturnType<typeof flattenProductsFromWebDisplay>[number]} product
 * @param {number} index
 */
export function mapWebDisplayProductToCatalog(product, index = 0, imageIndex = null) {
  const slug = hasNonEmptyString(product?.slug)
    ? product.slug.trim()
    : hasNonEmptyString(product?.id)
      ? product.id.trim()
      : `product-${index + 1}`

  const imagePaths = resolveProductImagePaths(product, imageIndex)
  const imagePath = imagePaths[0] ?? ''

  let availability = 'out_of_stock'
  if (product?.stock_status === 'in_stock') availability = 'in_stock'
  else if (product?.stock_status === 'limited') availability = 'limited'

  const certifications = hasNonEmptyStringArray(product?.approvals)
    ? product.approvals.filter((item) => hasNonEmptyString(item))
    : []

  const firstSpecification =
    Array.isArray(product?.specifications) && typeof product.specifications[0] === 'string'
      ? product.specifications[0].trim()
      : ''

  let shortDescription = ''
  if (hasNonEmptyString(product?.description)) shortDescription = product.description.trim()
  else if (hasNonEmptyString(product?.model)) shortDescription = `Model ${product.model.trim()}`
  else if (firstSpecification) shortDescription = firstSpecification

  return {
    id: slug,
    slug,
    link: `/product/${slug}`,
    name: hasNonEmptyString(product?.title) ? product.title.trim() : slug,
    image: imagePath ? normalizePublicImagePath(imagePath) : '',
    shortDescription,
    division: CATEGORY_ID_TO_DIVISION[product?.category_id] || 'all',
    category: hasNonEmptyString(product?.subcategory_id) ? product.subcategory_id.trim() : '',
    availability,
    certifications,
  }
}

export function mapWebDisplayCatalogProducts(catalog, imageIndex = null) {
  return flattenProductsFromWebDisplay(catalog).map((product, index) =>
    mapWebDisplayProductToCatalog(product, index, imageIndex),
  )
}

export async function fetchProductImageIndex() {
  const sourceUrl = `${import.meta.env.BASE_URL}data/product-image-index.json`
  try {
    const response = await fetch(sourceUrl)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * @param {Parameters<typeof flattenProductsFromWebDisplay>[0]} catalog
 */
export function buildSubcategoryFilterOptionsFromWebDisplay(catalog) {
  /** @type {Record<'all' | 'life-saving' | 'fire-fighting', { value: string; label: string }[]>} */
  const options = {
    all: [],
    'life-saving': [],
    'fire-fighting': [],
  }

  if (!catalog?.categories) return options

  for (const category of catalog.categories) {
    const division = CATEGORY_ID_TO_DIVISION[category.id]
    for (const subcategory of category.subcategories || []) {
      if (!hasNonEmptyString(subcategory?.id)) continue
      const entry = {
        value: subcategory.id.trim(),
        label: hasNonEmptyString(subcategory?.name) ? subcategory.name.trim() : subcategory.id.trim(),
      }
      options.all.push(entry)
      if (division) options[division].push(entry)
    }
  }

  return options
}

export function mapWebDisplayProductToDetail(product, imageIndex = null) {
  if (!product) return null

  const imagePaths = resolveProductImagePaths(product, imageIndex)
  const images = imagePaths.map((img, index) => ({
    id: `${product.slug || product.id || 'product'}-image-${index + 1}`,
    src: normalizePublicImagePath(img),
    label: `${product.title || 'Product'} image ${index + 1}`,
  }))

  const approvals = mapApprovalsToDisplay(product.approvals)

  const slug = hasNonEmptyString(product.slug)
    ? product.slug.trim()
    : hasNonEmptyString(product.id)
      ? product.id.trim()
      : ''

  return {
    id: slug,
    title: hasNonEmptyString(product.title) ? product.title.trim() : 'Product',
    model: hasNonEmptyString(product.model) ? product.model.trim() : '',
    categoryName: hasNonEmptyString(product.category_name) ? product.category_name.trim() : '',
    subcategoryName: hasNonEmptyString(product.subcategory_name) ? product.subcategory_name.trim() : '',
    slug,
    images,
    approvals,
    specifications: parseFlexibleListField(product.specifications),
    configurations: parseFlexibleListField(product.configurations),
    attributes: parseAttributesField(product.attributes),
    description: hasNonEmptyString(product.description) ? product.description.trim() : '',
  }
}
