import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductDetailPage as ProductDetailLayout } from '../../components/product-detail/index.js'

function normalizePublicImagePath(path) {
  if (typeof path !== 'string' || !path.trim()) return ''
  const baseUrl = import.meta.env.BASE_URL || '/'
  const normalized = path.trim().replace(/^\/+/, '')
  return `${baseUrl}${normalized}`
}

export default function ProductDetailPageRoute() {
  const { productId } = useParams()
  const [sourceProducts, setSourceProducts] = useState([])

  useEffect(() => {
    let active = true
    const sourceUrl = `${import.meta.env.BASE_URL}data/product_full.json`

    fetch(sourceUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load product data: ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!active) return
        setSourceProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!active) return
        setSourceProducts([])
      })

    return () => {
      active = false
    }
  }, [])

  const product = useMemo(
    () =>
      sourceProducts.find(
        (item) => typeof item?.slug === 'string' && item.slug.trim() === productId,
      ) || null,
    [productId, sourceProducts],
  )

  const detailData = useMemo(() => {
    if (!product) return undefined
    const images = Array.isArray(product.images)
      ? product.images
          .filter((img) => typeof img === 'string' && img.trim())
          .map((img, index) => ({
            id: `${product.slug || productId}-image-${index + 1}`,
            src: normalizePublicImagePath(img),
            label: `${product.name || 'Product'} image ${index + 1}`,
          }))
      : []

    return {
      images,
      certifications: [],
      descriptionLines: 4,
      name: product.name || 'Product Information',
      slug: product.slug || productId || '',
      model: typeof product.model === 'string' ? product.model : '',
    }
  }, [product, productId])

  return (
    <main className="bg-white pb-14 pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/product"
          className="inline-flex items-center rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
        >
          Back to Product
        </Link>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {product ? (
            <>
              Selected product: <span className="font-medium text-slate-900">{product.name}</span> ({product.slug})
            </>
          ) : (
            <>Product not found in real product data. Showing placeholder layout.</>
          )}
        </div>
      </div>

      <ProductDetailLayout data={detailData} />
    </main>
  )
}
