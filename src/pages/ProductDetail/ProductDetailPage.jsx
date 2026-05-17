import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductDetailPage as ProductDetailLayout } from '../../components/product-detail/index.js'
import QuotationInquiryModal from '../../components/inquiry/QuotationInquiryModal.jsx'
import {
  fetchProductImageIndex,
  flattenProductsFromWebDisplay,
  findProductBySlug,
  mapWebDisplayProductToDetail,
} from '../../data/productDisplayUtils.js'

const PAGE_EASE = [0.22, 1, 0.36, 1]
const INQUIRY_API_ENDPOINT = import.meta.env.VITE_INQUIRY_API_URL || '/api/inquiry'

export default function ProductDetailPageRoute() {
  const { productId } = useParams()
  const reduce = useReducedMotion()
  const [catalog, setCatalog] = useState(null)
  const [imageIndex, setImageIndex] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [inquiryProduct, setInquiryProduct] = useState(null)

  useEffect(() => {
    let active = true

    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/products_web_display.json`).then((response) => {
        if (!response.ok) throw new Error(`Failed to load product data: ${response.status}`)
        return response.json()
      }),
      fetchProductImageIndex(),
    ])
      .then(([data, index]) => {
        if (!active) return
        setCatalog(data)
        setImageIndex(index)
        setLoadError(false)
      })
      .catch(() => {
        if (!active) return
        setCatalog(null)
        setImageIndex(null)
        setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [])

  const products = useMemo(() => flattenProductsFromWebDisplay(catalog), [catalog])

  const product = useMemo(
    () => findProductBySlug(products, productId),
    [productId, products],
  )

  const detailData = useMemo(
    () => mapWebDisplayProductToDetail(product, imageIndex),
    [product, imageIndex],
  )

  const onAddToInquiry = useCallback(() => {
    if (!detailData?.id) return
    setInquiryProduct({ id: detailData.id, name: detailData.title })
  }, [detailData])

  const closeInquiryModal = useCallback(() => {
    setInquiryProduct(null)
  }, [])

  const submitInquiry = useCallback(async (payload) => {
    if (!INQUIRY_API_ENDPOINT) {
      throw new Error('Inquiry API is not configured. Please set VITE_INQUIRY_API_URL.')
    }

    const response = await fetch(INQUIRY_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const data = await response.json().catch(() => ({}))
      return {
        inquiryId: typeof data?.inquiryId === 'string' ? data.inquiryId : '',
      }
    }

    let message = 'Unable to submit your inquiry right now. Please try again later.'
    try {
      const data = await response.json()
      if (typeof data?.message === 'string' && data.message.trim()) message = data.message
    } catch {
      // Ignore JSON parse failures and use fallback message.
    }

    throw new Error(message)
  }, [])

  return (
    <main className="bg-white pb-14 pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={reduce ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.32, ease: PAGE_EASE }}
        >
        <Link
          to="/product"
          className="group -ml-1 inline-flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-3 text-[15px] font-semibold text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] shadow-sm transition group-hover:border-[var(--color-primary-300)] group-hover:bg-[var(--color-primary-100)] group-hover:text-[var(--color-primary-700)]"
            aria-hidden
          >
            <ChevronLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </span>
          Back to Product
        </Link>
        </Motion.div>

        {loadError ? (
          <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Unable to load product data. Please try again later.
          </p>
        ) : null}

        {!loadError && catalog && !product ? (
          <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Product not found. Showing placeholder layout.
          </p>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        <Motion.div
          key={productId}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: PAGE_EASE }}
        >
          <ProductDetailLayout
            data={detailData ?? undefined}
            onAddToInquiry={detailData?.id ? onAddToInquiry : undefined}
          />
        </Motion.div>
      </AnimatePresence>

      <QuotationInquiryModal
        isOpen={Boolean(inquiryProduct)}
        productName={inquiryProduct?.name ?? ''}
        productId={inquiryProduct?.id}
        onClose={closeInquiryModal}
        onSubmit={submitInquiry}
      />
    </main>
  )
}
