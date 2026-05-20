import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import ImageMagnifier from './ImageMagnifier.jsx'
import PlaceholderBlock from './PlaceholderBlock.jsx'

/**
 * @param {Object} props
 * @param {{ id: string; label: string; src?: string }[]} props.images
 */
export default function ImageGallery({ images }) {
  const reduce = useReducedMotion()
  const safeImages = useMemo(() => (images?.length ? images : [{ id: 'placeholder-1', label: 'Image Placeholder' }]), [images])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = safeImages[activeIndex]
  const imageKey = activeImage?.src ?? activeImage?.id ?? activeIndex

  const canPrev = activeIndex > 0
  const canNext = activeIndex < safeImages.length - 1

  const onPrev = () => {
    if (canPrev) setActiveIndex((idx) => idx - 1)
  }

  const onNext = () => {
    if (canNext) setActiveIndex((idx) => idx + 1)
  }

  const mainImageMinHeightClass = 'min-h-[320px] sm:min-h-[380px]'

  return (
    <section className="flex h-full w-full min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div
        className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden ${mainImageMinHeightClass}`}
      >
        <AnimatePresence mode="wait">
          {activeImage?.src ? (
            <Motion.div
              key={imageKey}
              className="absolute inset-0 h-full w-full"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <ImageMagnifier
                src={activeImage.src}
                alt={activeImage?.label || 'Product image'}
                disabled={reduce}
                className="h-full w-full rounded-3xl bg-white object-contain p-2 shadow-sm"
              />
            </Motion.div>
          ) : (
            <Motion.div
              key={imageKey}
              className="absolute inset-0 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.22 }}
            >
              <PlaceholderBlock
                className="h-full w-full rounded-3xl shadow-sm"
                label={activeImage?.label}
              />
            </Motion.div>
          )}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous image"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next image"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 shrink-0 grid grid-cols-5 gap-3">
        {safeImages.map((item, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Switch to ${item.label}`}
              className={`flex h-14 w-full items-center justify-center rounded-2xl border p-0.5 transition-all duration-200 hover:-translate-y-0.5 sm:h-16 ${
                isActive ? 'border-slate-400 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.label || 'Product thumbnail'}
                  className="h-full w-full rounded-2xl bg-white object-contain p-1"
                />
              ) : (
                <PlaceholderBlock className="h-14 w-full rounded-2xl sm:h-16" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
