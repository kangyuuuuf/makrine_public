import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CatalogSidebar from '../../components/catalog/CatalogSidebar.jsx'
import CategoryHero from '../../components/catalog/CategoryHero.jsx'
import ProductCard from '../../components/catalog/ProductCard.jsx'
import QuotationInquiryModal from '../../components/inquiry/QuotationInquiryModal.jsx'
import {
  getDivisionForCategoryValue,
  getDivisionForGroupId,
  getLeafCategoryIdsForGroup,
} from '../../data/navCatalogConfig.js'
import {
  CATALOG_HERO_BY_DIVISION,
  DIVISION_SLUGS,
  FILTER_GROUPS_BY_DIVISION,
  MOCK_PRODUCTS,
  parseDivisionSlug,
} from '../../data/catalogMock.js'

const INQUIRY_API_ENDPOINT = import.meta.env.VITE_INQUIRY_API_URL || ''

function toggleSetValue(set, value) {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

function productMatchesFilters(
  product,
  division,
  searchQuery,
  categories,
  availability,
  certifications,
) {
  if (division !== 'all' && product.division !== division) return false
  const q = searchQuery.trim().toLowerCase()
  if (q) {
    const blob = `${product.name} ${product.shortDescription ?? ''} ${product.id}`.toLowerCase()
    if (!blob.includes(q)) return false
  }
  if (categories.size > 0 && !categories.has(product.category)) return false
  if (availability.size > 0 && !availability.has(product.availability)) return false
  if (certifications.size > 0) {
    const hasAny = [...certifications].some((c) => product.certifications.includes(c))
    if (!hasAny) return false
  }
  return true
}

/**
 * @param {Object} props
 * @param {'all' | 'life-saving' | 'fire-fighting'} props.division
 * @param {boolean} props.isShopRoute — `/shop` uses `?division=` / `?category=`; `/catalog/:division` uses path only
 */
function CatalogPageInner({ division, isShopRoute }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const reduce = useReducedMotion()
  const ghostButtonClass =
    'inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'
  const primaryButtonClass =
    'mt-6 inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'

  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState(() => {
    const groupId = searchParams.get('group')
    const groupDivision = groupId ? getDivisionForGroupId(groupId) : null
    if (groupId && groupDivision && (division === 'all' || groupDivision === division)) {
      const ids = getLeafCategoryIdsForGroup(groupDivision, groupId)
      if (ids && ids.length > 0) return new Set(ids)
    }
    const cat = searchParams.get('category')
    const categoryDivision = cat ? getDivisionForCategoryValue(cat) : null
    if (cat && categoryDivision && (division === 'all' || categoryDivision === division)) {
      return new Set([cat])
    }
    return new Set()
  })
  const [availability, setAvailability] = useState(() => new Set())
  const [certifications, setCertifications] = useState(() => new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inquiryProduct, setInquiryProduct] = useState(null)

  const divisionCatalog = useMemo(
    () => (division === 'all' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.division === division)),
    [division],
  )

  const filteredProducts = useMemo(
    () =>
      MOCK_PRODUCTS.filter((p) =>
        productMatchesFilters(p, division, searchQuery, categories, availability, certifications),
      ),
    [division, searchQuery, categories, availability, certifications],
  )

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setCategories(new Set())
    setAvailability(new Set())
    setCertifications(new Set())
    if (isShopRoute) {
      const next = new URLSearchParams(searchParams)
      next.delete('category')
      next.delete('group')
      setSearchParams(next, { replace: true })
    }
  }, [isShopRoute, searchParams, setSearchParams])

  const onDivisionChange = useCallback(
    (next) => {
      if (isShopRoute) {
        const nextParams = new URLSearchParams(searchParams)
        if (next === 'all') {
          nextParams.delete('division')
        } else {
          nextParams.set('division', next)
        }
        nextParams.delete('category')
        nextParams.delete('group')
        setSearchParams(nextParams)
      } else {
        navigate(`/catalog/${next}`)
      }
    },
    [isShopRoute, navigate, searchParams, setSearchParams],
  )

  const categoryOptions = FILTER_GROUPS_BY_DIVISION[division].categories

  const sidebarProps = {
    division,
    onDivisionChange,
    categoryOptions,
    searchQuery,
    onSearchChange: setSearchQuery,
    categories,
    onCategoryToggle: (v) => setCategories((s) => toggleSetValue(s, v)),
    availability,
    onAvailabilityToggle: (v) => setAvailability((s) => toggleSetValue(s, v)),
    certifications,
    onCertToggle: (v) => setCertifications((s) => toggleSetValue(s, v)),
    onClearFilters: clearFilters,
  }

  const onProductCta = useCallback((productId) => {
    const selectedProduct = MOCK_PRODUCTS.find((product) => product.id === productId)
    if (!selectedProduct) return
    setInquiryProduct({ id: selectedProduct.id, name: selectedProduct.name })
  }, [])

  const onProductDetail = useCallback(
    (productId) => {
      navigate(`/shop/product/${productId}`)
    },
    [navigate],
  )

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

    if (response.ok) return

    let message = 'Unable to submit your inquiry right now. Please try again later.'
    try {
      const data = await response.json()
      if (typeof data?.message === 'string' && data.message.trim()) message = data.message
    } catch {
      // Ignore JSON parse failures and use fallback message.
    }

    throw new Error(message)
  }, [])

  const hero = CATALOG_HERO_BY_DIVISION[division]

  const gridTransition = reduce
    ? { duration: 0 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : 0.04,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: gridTransition,
    },
  }

  return (
    <main className="bg-white pb-16 lg:pb-12">
      <div className="lg:flex lg:min-h-[calc(100svh-6rem)]">
        <Motion.aside
          className="hidden min-h-0 w-72 shrink-0 flex-col border-0 bg-white px-6 pb-8 pt-5 lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh-6rem)] lg:max-h-[calc(100svh-6rem)] lg:overflow-y-auto lg:border-r lg:border-[var(--border)]"
          aria-label="Product filters"
          initial={reduce ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            Search &amp; refine
          </h2>
          <CatalogSidebar {...sidebarProps} />
        </Motion.aside>

        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
            <CategoryHero
              title={hero.title}
              paragraphs={hero.paragraphs}
              image={hero.image}
              division={division}
              onDivisionChange={onDivisionChange}
            />

            <div className="mt-10 flex flex-col gap-8">
              <div className="flex items-center justify-between gap-4 lg:hidden">
                <p className="text-sm tabular-nums text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{filteredProducts.length}</span>
                  {' '}
                  products
                </p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className={ghostButtonClass}
                >
                  <FunnelIcon className="h-4 w-4" aria-hidden />
                  Filters
                </button>
              </div>

              <div className="min-w-0">
                <Motion.p
                  className="mb-6 hidden text-sm text-[var(--text-secondary)] lg:block"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.15, duration: reduce ? 0 : 0.35 }}
                >
                  Showing{' '}
                  <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                    {filteredProducts.length}
                  </span>{' '}
                  of <span className="tabular-nums">{divisionCatalog.length}</span> products
                </Motion.p>

                <AnimatePresence mode="wait">
                  {filteredProducts.length === 0 ? (
                    <Motion.div
                      key="empty"
                      role="status"
                      className="rounded-lg border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center"
                      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                      transition={{ duration: reduce ? 0 : 0.28 }}
                    >
                      <p className="text-base font-medium text-[var(--text-primary)]">No products match your filters</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        Try clearing filters or broadening search terms.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className={primaryButtonClass}
                      >
                        Clear all filters
                      </button>
                    </Motion.div>
                  ) : (
                    <Motion.ul
                      key={`grid-${division}-${filteredProducts.map((p) => p.id).join('|')}`}
                      className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 xl:grid-cols-3"
                      layout
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {filteredProducts.map((product) => (
                        <Motion.li
                          key={product.id}
                          layout
                          variants={cardVariants}
                          className="will-change-transform"
                        >
                          <ProductCard product={product} onDetail={onProductDetail} onCta={onProductCta} />
                        </Motion.li>
                      ))}
                    </Motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <Motion.button
              key="catalog-drawer-backdrop"
              type="button"
              className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
              aria-label="Close filter panel"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.22 }}
            />
            <Motion.div
              key="catalog-drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="catalog-drawer-title"
              className="fixed inset-y-0 left-0 z-[61] flex w-[min(22rem,calc(100vw-2rem))] flex-col border-r border-[var(--border)] bg-white lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'tween',
                ease: [0.22, 1, 0.36, 1],
                duration: reduce ? 0 : 0.34,
              }}
            >
              <div className="flex flex-1 flex-col overflow-hidden px-5 pb-6 pt-4">
                <div className="mb-3 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <h2
                    id="catalog-drawer-title"
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]"
                  >
                    Search &amp; refine
                  </h2>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors duration-200 hover:bg-neutral-100 hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                    aria-label="Close filters"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <CatalogSidebar {...sidebarProps} suppressMobileHeader />
              </div>
            </Motion.div>
          </>
        ) : null}
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

export default function CatalogPage() {
  const location = useLocation()
  const { division: divisionSlug } = useParams()
  const [searchParams] = useSearchParams()
  const isShopRoute = location.pathname === '/shop'

  if (isShopRoute) {
    const divisionFromQuery = parseDivisionSlug(searchParams.get('division'))
    const division = divisionFromQuery ?? 'all'
    return (
      <CatalogPageInner
        key={`shop-${searchParams.toString()}`}
        division={division}
        isShopRoute
      />
    )
  }

  const division = parseDivisionSlug(divisionSlug)

  if (division === null) {
    return <Navigate to={`/catalog/${DIVISION_SLUGS.LIFE_SAVING}`} replace />
  }

  return <CatalogPageInner key={division} division={division} isShopRoute={false} />
}
