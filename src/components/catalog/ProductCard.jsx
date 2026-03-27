const BADGE_STYLES = {
  in_stock: 'bg-sky-800 text-white',
  limited: 'bg-amber-600 text-white',
}

/**
 * @param {Object} props
 * @param {{ id: string; name: string; shortDescription?: string; image: string; availability: 'in_stock' | 'limited' | 'out_of_stock' }} props.product
 * @param {string} [props.ctaLabel]
 * @param {(id: string) => void} [props.onCta]
 */
export default function ProductCard({ product, ctaLabel = 'Add to Inquiry', onCta }) {
  const { id, name, shortDescription, image, availability } = product
  const showBadge = availability === 'in_stock' || availability === 'limited'
  const badgeLabel = availability === 'in_stock' ? 'In Stock' : 'Limited'

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-transparent">
      <div className="relative aspect-[3/2] min-h-[11rem] overflow-hidden bg-neutral-100 sm:min-h-[13rem] md:min-h-[14rem]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
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
        <button
          type="button"
          onClick={() => onCta?.(id)}
          className="mt-auto w-full rounded-md border border-[var(--color-primary-600)] bg-[var(--color-primary-600)] px-4 py-3.5 text-base font-medium text-white transition hover:bg-[var(--color-primary-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        >
          {ctaLabel}
        </button>
      </div>
    </article>
  )
}
