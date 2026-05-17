import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const imgRoot = path.join(root, 'public/data/img')
const slugRoot = path.join(root, 'public/data/img-slug')
const catalogPath = path.join(root, 'public/data/products_web_display.json')
const outputPath = path.join(root, 'public/data/product-image-index.json')

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i
const SCREENSHOT_PATTERN = /截屏|screenshot/i
const SAFE_FILENAME = /^[\w.-]+$/

/** Normalized product title → normalized folder name */
const TITLE_TO_FOLDER_ALIASES = {
  'nakajima type i.s.c': 'nakajima type isc.s',
}

function normalizeProductNameForImageMatch(name) {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/suite/g, 'suit')
    .replace(/\//g, ':')
    .replace(/w\/o/g, 'w:o')
    .replace(/w\//g, 'w:')
}

function sortImageFiles(files) {
  return [...files].sort((a, b) => {
    const aShot = SCREENSHOT_PATTERN.test(a)
    const bShot = SCREENSHOT_PATTERN.test(b)
    if (aShot !== bShot) return aShot ? 1 : -1
    return a.localeCompare(b, undefined, { numeric: true })
  })
}

function loadTitleToSlugMap() {
  if (!fs.existsSync(catalogPath)) return new Map()

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  const titleToSlug = new Map()

  for (const category of catalog.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) {
        const title = typeof product.title === 'string' ? product.title.trim() : ''
        const slug = typeof product.slug === 'string' ? product.slug.trim() : ''
        if (title && slug) {
          titleToSlug.set(normalizeProductNameForImageMatch(title), slug)
        }
      }
    }
  }

  return titleToSlug
}

function slugifyFolderName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function safeImageFilename(file, index) {
  if (SAFE_FILENAME.test(file)) return file
  const ext = path.extname(file).toLowerCase() || '.jpg'
  return `image-${index + 1}${ext}`
}

function linkOrCopyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (fs.existsSync(target)) fs.unlinkSync(target)
  try {
    fs.linkSync(source, target)
  } catch {
    fs.copyFileSync(source, target)
  }
}

function walkProductFolders(titleToSlug) {
  if (!fs.existsSync(imgRoot)) {
    console.warn(`Image root not found: ${imgRoot}`)
    return {}
  }

  if (fs.existsSync(slugRoot)) {
    fs.rmSync(slugRoot, { recursive: true, force: true })
  }
  fs.mkdirSync(slugRoot, { recursive: true })

  const byNormalizedTitle = {}
  const folders = fs.readdirSync(imgRoot, { withFileTypes: true }).filter((d) => d.isDirectory())

  for (const folderEntry of folders) {
    let folderName = folderEntry.name
    let folderPath = path.join(imgRoot, folderName)
    const trimmedName = folderName.trim()
    if (trimmedName && trimmedName !== folderName) {
      const trimmedPath = path.join(imgRoot, trimmedName)
      if (!fs.existsSync(trimmedPath)) {
        fs.renameSync(folderPath, trimmedPath)
        console.log(`Renamed folder: "${folderName}" → "${trimmedName}"`)
        folderName = trimmedName
        folderPath = trimmedPath
      }
    }

    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((f) => f.isFile() && IMAGE_EXT.test(f.name))
      .map((f) => f.name)

    if (files.length === 0) continue

    const normalizedKey = normalizeProductNameForImageMatch(folderName)
    let slug = titleToSlug.get(normalizedKey)
    const aliasKey = TITLE_TO_FOLDER_ALIASES[normalizedKey]
    if (!slug && aliasKey) slug = titleToSlug.get(aliasKey)

    const resolvedSlug = slug || slugifyFolderName(folderName)
    if (!slug) {
      console.warn(`No catalog slug for folder "${folderName}", using "${resolvedSlug}"`)
    }

    const sorted = sortImageFiles(files)
    const relativePaths = []
    const slugDir = path.join(slugRoot, resolvedSlug)

    sorted.forEach((file, index) => {
      const safeName = safeImageFilename(file, index)
      const source = path.join(folderPath, file)
      const target = path.join(slugDir, safeName)
      linkOrCopyFile(source, target)
      relativePaths.push(`data/img-slug/${resolvedSlug}/${safeName}`.replace(/\\/g, '/'))
    })

    byNormalizedTitle[normalizedKey] = relativePaths
  }

  return byNormalizedTitle
}

const titleToSlug = loadTitleToSlugMap()
const byNormalizedTitle = walkProductFolders(titleToSlug)

for (const [from, to] of Object.entries(TITLE_TO_FOLDER_ALIASES)) {
  if (byNormalizedTitle[to] && !byNormalizedTitle[from]) {
    byNormalizedTitle[from] = byNormalizedTitle[to]
  }
}

const index = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  image_root: 'data/img-slug',
  byNormalizedTitle,
}

fs.writeFileSync(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8')
console.log(
  `Wrote ${outputPath} (${Object.keys(byNormalizedTitle).length} products, ${Object.values(byNormalizedTitle).flat().length} images)`,
)
