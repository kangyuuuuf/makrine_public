import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import PlaceholderBlock from './PlaceholderBlock.jsx'

/**
 * @param {Object} props
 * @param {{ id: string; label: string }[]} props.images
 */
export default function ImageGallery({ images }) {
  const safeImages = useMemo(() => (images?.length ? images : [{ id: 'placeholder-1', label: 'Image Placeholder' }]), [images])
  const [activeIndex, setActiveIndex] = useState(0)

  const canPrev = activeIndex > 0
  const canNext = activeIndex < safeImages.length - 1

  const onPrev = () => {
    if (canPrev) setActiveIndex((idx) => idx - 1)
  }

  const onNext = () => {
    if (canNext) setActiveIndex((idx) => idx + 1)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="relative">
        <PlaceholderBlock
          className="h-[320px] w-full rounded-3xl shadow-sm sm:h-[380px] lg:h-[430px]"
          label={safeImages[activeIndex]?.label}
        />
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

      <div className="mt-4 grid grid-cols-5 gap-3">
        {safeImages.map((item, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Switch to ${item.label}`}
              className={`rounded-2xl border p-0.5 transition-all duration-200 hover:-translate-y-0.5 ${
                isActive ? 'border-slate-400 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <PlaceholderBlock className="h-14 w-full rounded-2xl sm:h-16" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
