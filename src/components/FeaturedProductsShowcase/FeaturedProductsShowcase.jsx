import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FEATURED_DEFAULT_INTERVAL_MS,
  FEATURED_PRODUCTS,
  FEATURED_SPEC_LIMIT,
  normalizeFeaturedProductEntry,
} from '../../data/featuredProductsConfig.js'
import { fetchInventoryStatusMap } from '../../data/inventoryStatus.js'
import {
  fetchProductImageIndex,
  findProductBySlug,
  flattenProductsFromWebDisplay,
  mapWebDisplayProductToDetail,
} from '../../data/productDisplayUtils.js'
import './FeaturedProductsShowcase.css'

const USER_PAUSE_MS = 12_000
const FADE_DURATION = 0.65

function getSpecificationItems(product) {
  const groups = product?.specifications
  if (!Array.isArray(groups)) return []

  const items = []
  for (const group of groups) {
    if (typeof group === 'string' && group.trim()) {
      items.push(group.trim())
      continue
    }
    if (group?.items && Array.isArray(group.items)) {
      for (const item of group.items) {
        if (typeof item === 'string' && item.trim()) items.push(item.trim())
      }
    }
  }

  return items.slice(0, FEATURED_SPEC_LIMIT)
}

function FeaturedSlideContent({ product, slideIndex, total }) {
  const specs = getSpecificationItems(product)
  const showInStock = product.availability === 'in_stock'
  const image = product.images?.[0]
  const counter = `${String(slideIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <>
      <div className="featured-showcase__info">
        {showInStock ? (
          <p className="featured-showcase__badge">
            <span className="featured-showcase__badge-dot" aria-hidden />
            Now In Stock
          </p>
        ) : null}

        <h3 className="featured-showcase__product-name">{product.title}</h3>

        {product.model ? <p className="featured-showcase__model">Model {product.model}</p> : null}

        {specs.length > 0 ? (
          <ul className="featured-showcase__specs">
            {specs.map((spec) => (
              <li key={spec} className="featured-showcase__spec">
                {spec}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="featured-showcase__actions">
          <Link to={`/product/${product.slug}`} className="featured-showcase__cta">
            View product
          </Link>
          <span className="featured-showcase__counter" aria-live="polite">
            {counter}
          </span>
        </div>
      </div>

      <div className="featured-showcase__visual">
        <div className="featured-showcase__image-wrap">
          {image?.src ? (
            <div className="featured-showcase__image-blend">
              <img
                className="featured-showcase__image"
                src={image.src}
                alt={image.label || product.title}
                decoding="async"
              />
            </div>
          ) : (
            <span className="featured-showcase__image-placeholder">Image unavailable</span>
          )}
        </div>
      </div>
    </>
  )
}

export default function FeaturedProductsShowcase() {
  const prefersReducedMotion = useReducedMotion()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const pauseUntilRef = useRef(0)
  const touchRef = useRef(/** @type {{ x: number } | null} */ (null))

  useEffect(() => {
    let active = true

    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/products_web_display.json`).then((response) => {
        if (!response.ok) throw new Error(`Failed to load product data: ${response.status}`)
        return response.json()
      }),
      fetchProductImageIndex(),
      fetchInventoryStatusMap().catch(() => ({})),
    ])
      .then(([catalog, imageIndex, inventoryStatusMap]) => {
        if (!active) return

        const allProducts = flattenProductsFromWebDisplay(catalog)
        const featured = FEATURED_PRODUCTS.map((entry) => {
          const { slug, intervalMs } = normalizeFeaturedProductEntry(entry)
          if (!slug) return null
          const raw = findProductBySlug(allProducts, slug)
          if (!raw) return null
          return {
            ...mapWebDisplayProductToDetail(raw, imageIndex, inventoryStatusMap),
            displayIntervalMs: intervalMs,
          }
        }).filter(Boolean)

        setProducts(featured)
        setIndex(0)
      })
      .catch(() => {
        if (active) setProducts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const len = products.length
  const safeIndex = len > 0 ? index % len : 0
  const current = products[safeIndex]
  const currentIntervalMs = current?.displayIntervalMs ?? FEATURED_DEFAULT_INTERVAL_MS

  const bumpUserPause = useCallback(() => {
    pauseUntilRef.current = Date.now() + USER_PAUSE_MS
  }, [])

  const goPrev = useCallback(() => {
    if (len < 2) return
    bumpUserPause()
    setIndex((i) => (i - 1 + len) % len)
  }, [bumpUserPause, len])

  const goNext = useCallback(() => {
    if (len < 2) return
    bumpUserPause()
    setIndex((i) => (i + 1) % len)
  }, [bumpUserPause, len])

  const goTo = useCallback(
    (nextIndex) => {
      if (len < 2) return
      bumpUserPause()
      setIndex(nextIndex)
    },
    [bumpUserPause, len],
  )

  useEffect(() => {
    if (prefersReducedMotion || len < 2) return

    let timeoutId = 0
    let cancelled = false

    const scheduleNext = () => {
      if (cancelled) return

      const pausedFor = pauseUntilRef.current - Date.now()
      const delay = pausedFor > 0 ? pausedFor : currentIntervalMs

      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        if (Date.now() < pauseUntilRef.current) {
          scheduleNext()
          return
        }
        setIndex((i) => (i + 1) % len)
      }, delay)
    }

    scheduleNext()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [prefersReducedMotion, len, safeIndex, currentIntervalMs])

  const fadeMotion = useMemo(
    () =>
      prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: FADE_DURATION, ease: [0.4, 0, 0.2, 1] },
          },
    [prefersReducedMotion],
  )

  const sectionMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <Motion.section
      className="featured-showcase"
      aria-label="Featured products"
      style={
        prefersReducedMotion
          ? undefined
          : { '--featured-advance-ms': `${currentIntervalMs}ms` }
      }
      {...sectionMotion}
    >
      <div className="featured-showcase__bg" aria-hidden />

      <div className="featured-showcase__inner">
        <header className="featured-showcase__header">
          <p className="featured-showcase__eyebrow">
            <span className="featured-showcase__eyebrow-text">Featured products</span>
          </p>
        </header>

        {loading ? (
          <p className="featured-showcase__loading">Loading featured products…</p>
        ) : !current ? (
          <p className="featured-showcase__empty">No featured products configured.</p>
        ) : (
          <>
            <div
              className="featured-showcase__stage"
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured products carousel"
              onTouchStart={(event) => {
                const touch = event.touches[0]
                if (touch) touchRef.current = { x: touch.clientX }
              }}
              onTouchEnd={(event) => {
                const start = touchRef.current
                const touch = event.changedTouches[0]
                touchRef.current = null
                if (!start || !touch) return
                const dx = touch.clientX - start.x
                if (dx > 50) goPrev()
                else if (dx < -50) goNext()
              }}
            >
              {prefersReducedMotion ? (
                <div className="featured-showcase__slide">
                  <FeaturedSlideContent product={current} slideIndex={safeIndex} total={len} />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <Motion.div key={current.id} className="featured-showcase__slide" {...fadeMotion}>
                    <FeaturedSlideContent product={current} slideIndex={safeIndex} total={len} />
                  </Motion.div>
                </AnimatePresence>
              )}
            </div>

            {len > 1 ? (
              <>
                {!prefersReducedMotion ? (
                  <div className="featured-showcase__progress" aria-hidden>
                    <div key={safeIndex} className="featured-showcase__progress-fill" />
                  </div>
                ) : null}

                <div className="featured-showcase__controls">
                  <div className="featured-showcase__dots" role="tablist" aria-label="Choose product">
                    {products.map((product, dotIndex) => (
                      <button
                        key={product.id}
                        type="button"
                        role="tab"
                        aria-selected={dotIndex === safeIndex}
                        aria-label={`${product.title}, slide ${dotIndex + 1} of ${len}`}
                        className={
                          'featured-showcase__dot' +
                          (dotIndex === safeIndex ? ' featured-showcase__dot--active' : '')
                        }
                        onClick={() => goTo(dotIndex)}
                      />
                    ))}
                  </div>

                  <div className="featured-showcase__nav-group">
                    <button
                      type="button"
                      className="featured-showcase__nav"
                      aria-label="Previous product"
                      onClick={goPrev}
                    >
                      <ChevronLeftIcon strokeWidth={1.75} aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="featured-showcase__nav"
                      aria-label="Next product"
                      onClick={goNext}
                    >
                      <ChevronRightIcon strokeWidth={1.75} aria-hidden />
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </Motion.section>
  )
}
