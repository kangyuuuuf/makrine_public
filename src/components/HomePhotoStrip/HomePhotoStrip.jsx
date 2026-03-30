import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import brandIconOnly from '../../assets/icon_only.png'
import homePic1 from '../../assets/homePic1.png'
import homePic2 from '../../assets/homePic2.png'
import webAssert6 from '../../assets/web/webAssert6.jpg'
import webAssert9 from '../../assets/web/webAssert9.png'
import webAssert11 from '../../assets/web/webAssert11.avif'
import webAssert12 from '../../assets/web/webAssert12.avif'
import './HomePhotoStrip.css'

/** @type {{ src: string; alt: string }[]} */
const GALLERY = [
  { src: homePic1, alt: 'Marine safety equipment and operations at Makrine' },
  { src: homePic2, alt: 'Makrine warehouse and product handling' },
  { src: webAssert6, alt: 'Makrine company and marine safety context' },
  { src: webAssert9, alt: 'Partnership and marine equipment supply' },
  { src: webAssert11, alt: 'Marine safety solutions and equipment' },
  { src: webAssert12, alt: 'Industrial and maritime operations' },
]

const AUTO_ADVANCE_MS = 5500
const USER_PAUSE_MS = 7000

export default function HomePhotoStrip() {
  const [index, setIndex] = useState(0)
  const pauseUntilRef = useRef(0)
  const touchRef = useRef(/** @type {{ x: number } | null} */ (null))
  const prefersReducedMotion = useReducedMotion()

  const len = GALLERY.length
  const current = GALLERY[index]

  const bumpUserPause = useCallback(() => {
    pauseUntilRef.current = Date.now() + USER_PAUSE_MS
  }, [])

  const goPrev = useCallback(() => {
    bumpUserPause()
    setIndex((i) => (i - 1 + len) % len)
  }, [bumpUserPause, len])

  const goNext = useCallback(() => {
    bumpUserPause()
    setIndex((i) => (i + 1) % len)
  }, [bumpUserPause, len])

  const goTo = useCallback(
    (i) => {
      bumpUserPause()
      setIndex(i)
    },
    [bumpUserPause],
  )

  useEffect(() => {
    if (prefersReducedMotion || len < 2) return

    const tick = () => {
      if (Date.now() < pauseUntilRef.current) return
      setIndex((i) => (i + 1) % len)
    }

    const id = window.setInterval(tick, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [prefersReducedMotion, len])

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }

  const imageMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 1.02 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.985 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }

  const counter = `${String(index + 1).padStart(2, '0')} · ${String(len).padStart(2, '0')}`

  return (
    <Motion.section
      className="home-photo-strip"
      aria-labelledby="home-photo-strip-heading"
      style={
        prefersReducedMotion
          ? undefined
          : { '--home-photo-advance-ms': `${AUTO_ADVANCE_MS}ms` }
      }
      {...motionProps}
    >
      <div className="home-photo-strip__blobs" aria-hidden>
        <div className="home-photo-strip__blob home-photo-strip__blob--tl" />
        <div className="home-photo-strip__blob home-photo-strip__blob--br" />
      </div>
      <div className="home-photo-strip__gridline home-photo-strip__gridline--left" aria-hidden />
      <div className="home-photo-strip__gridline home-photo-strip__gridline--right" aria-hidden />

      <div className="home-photo-strip__inner">
        <header className="home-photo-strip__header">
          <p className="home-photo-strip__eyebrow">In focus</p>
          <h2 id="home-photo-strip-heading" className="home-photo-strip__title">
            Photo <span className="home-photo-strip__title-accent">gallery</span>
          </h2>
          <div className="home-photo-strip__icon-row">
            <img
              src={brandIconOnly}
              alt=""
              width={40}
              height={40}
              className="home-photo-strip__brand-icon"
              decoding="async"
            />
          </div>
          <div className="home-photo-strip__accent" />
          <p className="home-photo-strip__sub">
            A look at our facilities, partners, and the field — auto-advancing, with full control when you want it.
          </p>
        </header>

        <div className="home-photo-strip__showcase">
          <span className="home-photo-strip__index" aria-live="off">
            {counter}
          </span>

          <div
            className="home-photo-strip__stage"
            role="region"
            aria-roledescription="carousel"
            aria-label="Photo gallery carousel"
            onTouchStart={(e) => {
              const t = e.touches[0]
              if (t) touchRef.current = { x: t.clientX }
            }}
            onTouchEnd={(e) => {
              const start = touchRef.current
              const t = e.changedTouches[0]
              touchRef.current = null
              if (!start || !t) return
              const dx = t.clientX - start.x
              if (dx > 50) goPrev()
              else if (dx < -50) goNext()
            }}
          >
            <button
              type="button"
              className="home-photo-strip__nav home-photo-strip__nav--prev"
              aria-label="Previous photo"
              onClick={goPrev}
            >
              <ChevronLeftIcon strokeWidth={1.75} aria-hidden />
            </button>

            <div className="home-photo-strip__chrome">
              <div className="home-photo-strip__frame">
                <div className="home-photo-strip__frame-shine" aria-hidden />
                <div className="home-photo-strip__vignette" aria-hidden />
                {prefersReducedMotion ? (
                  <img
                    className="home-photo-strip__img"
                    src={current.src}
                    alt={current.alt}
                    decoding="async"
                  />
                ) : (
                  <AnimatePresence mode="wait">
                    <Motion.img
                      key={current.src}
                      className="home-photo-strip__img"
                      src={current.src}
                      alt={current.alt}
                      decoding="async"
                      {...imageMotion}
                    />
                  </AnimatePresence>
                )}
              </div>

              {!prefersReducedMotion ? (
                <div className="home-photo-strip__progress" aria-hidden>
                  <div key={index} className="home-photo-strip__progress-fill" />
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="home-photo-strip__nav home-photo-strip__nav--next"
              aria-label="Next photo"
              onClick={goNext}
            >
              <ChevronRightIcon strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <div className="home-photo-strip__dots" role="tablist" aria-label="Choose slide">
            {GALLERY.map((_, i) => (
              <button
                key={String(i)}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photo ${i + 1} of ${len}`}
                className={
                  'home-photo-strip__dot' + (i === index ? ' home-photo-strip__dot--active' : '')
                }
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </Motion.section>
  )
}
