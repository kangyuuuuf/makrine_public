import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CatalogSidebar from '../../components/catalog/CatalogSidebar.jsx'
import CategoryHero from '../../components/catalog/CategoryHero.jsx'
import ProductCard from '../../components/catalog/ProductCard.jsx'
import QuotationInquiryModal from '../../components/inquiry/QuotationInquiryModal.jsx'
import {
  expandCategoryFilterToSubcategoryIds,
  expandCategoryFiltersToSubcategorySet,
  getDivisionForCategoryValue,
  getDivisionForGroupId,
  getSubcategoryIdForNavGroup,
} from '../../data/navCatalogConfig.js'
import {
  CATALOG_HERO_BY_DIVISION,
  DIVISION_SLUGS,
  FILTER_GROUPS_BY_DIVISION,
  parseDivisionSlug,
} from '../../data/catalogConfig.js'
import {
  buildSubcategoryFilterOptionsFromWebDisplay,
  fetchProductImageIndex,
  mapWebDisplayCatalogProducts,
} from '../../data/productDisplayUtils.js'

const INQUIRY_API_ENDPOINT = import.meta.env.VITE_INQUIRY_API_URL || '/api/inquiry'
const PRODUCTS_PER_PAGE = 24

function toggleSetValue(set, value) {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1)
  }

  const pages = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) pages.push('...')
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < totalPages - 1) pages.push('...')

  pages.push(totalPages)
  return pages
}

/**
 * @param {Object} props
 * @param {'all' | 'life-saving' | 'fire-fighting'} props.division
 * @param {boolean} props.isProductRoute — `/product` uses `?division=` / `?category=`; `/catalog/:division` uses path only
 */
function CatalogPageInner({ division, isProductRoute }) {
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
      const subcategoryId = getSubcategoryIdForNavGroup(groupId)
      if (subcategoryId) return new Set([subcategoryId])
    }
    const cat = searchParams.get('category')
    const categoryDivision = cat ? getDivisionForCategoryValue(cat) : null
    if (cat && categoryDivision && (division === 'all' || categoryDivision === division)) {
      const subcategoryIds = expandCategoryFilterToSubcategoryIds(cat)
      if (subcategoryIds.length > 0) return new Set(subcategoryIds)
    }
    return new Set()
  })
  const [availability, setAvailability] = useState(() => new Set())
  const [approvals, setApprovals] = useState(() => new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inquiryProduct, setInquiryProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [subcategoryFilterOptions, setSubcategoryFilterOptions] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let active = true

    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/products_web_display.json`).then((response) => {
        if (!response.ok) throw new Error(`Failed to load product data: ${response.status}`)
        return response.json()
      }),
      fetchProductImageIndex(),
    ])
      .then(([data, imageIndex]) => {
        if (!active) return
        setProducts(mapWebDisplayCatalogProducts(data, imageIndex))
        setSubcategoryFilterOptions(buildSubcategoryFilterOptionsFromWebDisplay(data))
      })
      .catch(() => {
        if (!active) return
        setProducts([])
        setSubcategoryFilterOptions(null)
      })

    return () => {
      active = false
    }
  }, [])

  const activeSubcategoryFilters = useMemo(
    () => expandCategoryFiltersToSubcategorySet(categories),
    [categories],
  )

  const filteredProducts = useMemo(() => {
    let list = products
    const query = searchQuery.trim().toLowerCase()

    if (division !== 'all') {
      list = list.filter((product) => product.division === division)
    }

    if (activeSubcategoryFilters.size > 0) {
      list = list.filter((product) => activeSubcategoryFilters.has(product.category))
    }

    if (query) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.slug.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query),
      )
    }

    if (availability.size > 0) {
      list = list.filter((product) => availability.has(product.availability))
    }

    if (approvals.size > 0) {
      list = list.filter((product) =>
        product.approvalFilters.some((key) => approvals.has(key)),
      )
    }

    return list
  }, [
    activeSubcategoryFilters,
    availability,
    approvals,
    division,
    products,
    searchQuery,
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [division, searchQuery, categories, availability, approvals])

  const divisionCatalog = useMemo(() => {
    if (division === 'all') return products
    return products.filter((product) => product.division === division)
  }, [division, products])
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)),
    [filteredProducts.length],
  )
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredProducts, safeCurrentPage])

  const paginationItems = useMemo(
    () => buildPaginationItems(safeCurrentPage, totalPages),
    [safeCurrentPage, totalPages],
  )

  const showingFrom = filteredProducts.length === 0 ? 0 : (safeCurrentPage - 1) * PRODUCTS_PER_PAGE + 1
  const showingTo = Math.min(safeCurrentPage * PRODUCTS_PER_PAGE, filteredProducts.length)

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setCategories(new Set())
    setAvailability(new Set())
    setApprovals(new Set())
    if (isProductRoute) {
      const next = new URLSearchParams(searchParams)
      next.delete('category')
      next.delete('group')
      setSearchParams(next, { replace: true })
    }
  }, [isProductRoute, searchParams, setSearchParams])

  const onDivisionChange = useCallback(
    (next) => {
      if (isProductRoute) {
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
    [isProductRoute, navigate, searchParams, setSearchParams],
  )

  const categoryOptions =
    subcategoryFilterOptions?.[division] ?? FILTER_GROUPS_BY_DIVISION[division].categories

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
    approvals,
    onApprovalToggle: (v) => setApprovals((s) => toggleSetValue(s, v)),
    onClearFilters: clearFilters,
  }

  const onProductCta = useCallback((productId) => {
    const selectedProduct = products.find((product) => product.id === productId)
    if (!selectedProduct) return
    setInquiryProduct({ id: selectedProduct.id, name: selectedProduct.name })
  }, [products])

  const onProductDetail = useCallback(
    (productId) => {
      const selectedProduct = products.find((product) => product.id === productId)
      if (!selectedProduct?.link) return
      navigate(selectedProduct.link)
    },
    [navigate, products],
  )

  const goToPage = useCallback(
    (nextPage) => {
      const clamped = Math.max(1, Math.min(totalPages, nextPage))
      setCurrentPage(clamped)
    },
    [totalPages],
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
                  Showing <span className="font-semibold tabular-nums text-[var(--text-primary)]">{showingFrom}</span>
                  {' '}-{' '}
                  <span className="font-semibold tabular-nums text-[var(--text-primary)]">{showingTo}</span>
                  {' '}of <span className="tabular-nums">{divisionCatalog.length}</span> products
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
                      key={`grid-${division}-page-${safeCurrentPage}`}
                      className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 xl:grid-cols-3"
                      layout
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {paginatedProducts.map((product) => (
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

                {filteredProducts.length > 0 && totalPages > 1 ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToPage(safeCurrentPage - 1)}
                      disabled={safeCurrentPage === 1}
                      className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {paginationItems.map((item, index) => (
                      item === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-sm text-[var(--text-secondary)]">...</span>
                      ) : (
                        <button
                          key={`page-${item}`}
                          type="button"
                          onClick={() => goToPage(item)}
                          className={`rounded-md px-3 py-2 text-sm ${
                            item === safeCurrentPage
                              ? 'bg-[var(--color-primary-600)] text-white'
                              : 'border border-[var(--border)] text-[var(--text-primary)]'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    ))}

                    <button
                      type="button"
                      onClick={() => goToPage(safeCurrentPage + 1)}
                      disabled={safeCurrentPage === totalPages}
                      className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
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
  const isProductRoute = location.pathname === '/product' || location.pathname === '/shop'

  if (isProductRoute) {
    const divisionFromQuery = parseDivisionSlug(searchParams.get('division'))
    const division = divisionFromQuery ?? 'all'
    return (
      <CatalogPageInner
        key={`product-${searchParams.toString()}`}
        division={division}
        isProductRoute
      />
    )
  }

  const division = parseDivisionSlug(divisionSlug)

  if (division === null) {
    return <Navigate to={`/catalog/${DIVISION_SLUGS.LIFE_SAVING}`} replace />
  }

  return <CatalogPageInner key={division} division={division} isProductRoute={false} />
}
