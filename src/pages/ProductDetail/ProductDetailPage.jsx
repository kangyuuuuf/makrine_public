import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductDetailPage as ProductDetailLayout } from '../../components/product-detail/index.js'
import { MOCK_PRODUCTS } from '../../data/catalogMock.js'

export default function ProductDetailPageRoute() {
  const { productId } = useParams()
  const product = useMemo(() => MOCK_PRODUCTS.find((item) => item.id === productId) || null, [productId])

  return (
    <main className="bg-white pb-14 pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          className="inline-flex items-center rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]"
        >
          Back to Shop
        </Link>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {product ? (
            <>
              Selected product: <span className="font-medium text-slate-900">{product.name}</span> ({product.id})
            </>
          ) : (
            <>Product not found in mock data. Showing placeholder layout.</>
          )}
        </div>
      </div>

      <ProductDetailLayout />
    </main>
  )
}
