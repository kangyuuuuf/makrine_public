import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const catalogPath = path.join(root, 'public/data/products_web_display.json')
const outputPath = path.join(root, 'public/sitemap.xml')

const SITE_URL = (process.env.SITE_URL || 'https://www.makrine.com').replace(/\/$/, '')

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/catalog/all', priority: '0.9', changefreq: 'weekly' },
  { path: '/catalog/life-saving', priority: '0.9', changefreq: 'weekly' },
  { path: '/catalog/fire-fighting', priority: '0.9', changefreq: 'weekly' },
]

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastmod(date) {
  return date.toISOString().slice(0, 10)
}

function collectProductSlugs(catalog) {
  const slugs = []
  for (const category of catalog.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) {
        const id = typeof product.id === 'string' ? product.id.trim() : ''
        if (id) slugs.push(id)
      }
    }
  }
  return slugs
}

function buildUrlEntry(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

function main() {
  if (!fs.existsSync(catalogPath)) {
    console.error('Catalog not found:', catalogPath)
    process.exit(1)
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  const lastmod = formatLastmod(fs.statSync(catalogPath).mtime)
  const entries = []

  for (const route of STATIC_ROUTES) {
    entries.push(
      buildUrlEntry(`${SITE_URL}${route.path}`, lastmod, route.changefreq, route.priority),
    )
  }

  for (const slug of collectProductSlugs(catalog)) {
    entries.push(buildUrlEntry(`${SITE_URL}/product/${slug}`, lastmod, 'monthly', '0.7'))
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')

  fs.writeFileSync(outputPath, xml, 'utf8')
  console.log(`Wrote sitemap with ${entries.length} URLs to ${outputPath}`)
}

main()
