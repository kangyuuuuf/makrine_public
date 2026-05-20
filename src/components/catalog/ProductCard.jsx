const BADGE_STYLES = {
  in_stock: 'bg-sky-800 text-white',
  limited: 'bg-amber-600 text-white',
}

const BADGE_LABELS = {
  in_stock: 'In Stock',
  limited: 'Limited',
}

/**
 * @param {Object} props
 * @param {{ id: string; name: string; shortDescription?: string; image: string; availability: 'in_stock' | 'limited' | 'unknown' }} props.product
 * @param {string} [props.ctaLabel]
 * @param {string} [props.detailLabel]
 * @param {(id: string) => void} [props.onDetail]
 * @param {(id: string) => void} [props.onCta]
 */
export default function ProductCard({
  product,
  ctaLabel = 'Add to Inquiry',
  detailLabel = 'Detail',
  onDetail,
  onCta,
}) {
  const { id, name, shortDescription, image, availability } = product
  const showBadge = Boolean(BADGE_LABELS[availability])
  const badgeLabel = BADGE_LABELS[availability]

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-transparent">
      <div className="relative aspect-[3/2] min-h-[11rem] overflow-hidden bg-neutral-100 sm:min-h-[13rem] md:min-h-[14rem]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400"
          >
            No image
          </div>
        )}
        {showBadge ? (
          <span
            className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-sm font-semibold tracking-wide ${BADGE_STYLES[availability]}`}
          >
            {badgeLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-4 pt-5 sm:pt-6">
        <div className="min-h-0 flex-1 space-y-2">
          <h3 className="text-lg font-semibold leading-snug text-[var(--text-primary)] sm:text-xl">
            {name}
          </h3>
          {shortDescription ? (
            <p className="line-clamp-1 text-base leading-relaxed text-[var(--text-secondary)]">
              {shortDescription}
            </p>
          ) : null}
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onDetail?.(id)}
            className="w-full cursor-pointer rounded-md border border-[var(--border)] bg-white px-3 py-3.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            {detailLabel}
          </button>
          <button
            type="button"
            onClick={() => onCta?.(id)}
            className="w-full cursor-pointer rounded-md border border-[var(--color-primary-500)] bg-[var(--color-primary-500)] px-3 py-3.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:border-[var(--color-primary-700)] hover:bg-[var(--color-primary-700)] active:border-[var(--color-primary-900)] active:bg-[var(--color-primary-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
