import ApprovalBadge from './ApprovalBadge.jsx'
import InquiryAsideAction from './InquiryAsideAction.jsx'

const AVAILABILITY_LABELS = {
  in_stock: 'In Stock',
  limited: 'Limited',
}

const AVAILABILITY_STYLES = {
  in_stock: 'border-sky-200 bg-sky-50 text-sky-800',
  limited: 'border-amber-200 bg-amber-50 text-amber-800',
}

function SectionHeading({ id, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-4 w-1 shrink-0 rounded-full bg-[var(--color-primary-600)]"
        aria-hidden
      />
      <h2
        id={id}
        className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
      >
        {children}
      </h2>
    </div>
  )
}

/**
 * Right-column product summary: title, approvals, and specifications.
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.model]
 * @param {string} [props.categoryName]
 * @param {string} [props.subcategoryName]
 * @param {'in_stock' | 'limited' | 'unknown'} [props.availability]
 * @param {{ label: string; imageSrc?: string | null }[]} props.approvals
 * @param {{ title?: string; items: string[] }[] | null} props.specifications
 * @param {() => void} [props.onAddToInquiry]
 */
export default function ProductDetailAside({
  title = 'Product',
  model = '',
  categoryName = '',
  subcategoryName = '',
  availability = 'unknown',
  approvals = [],
  specifications = null,
  onAddToInquiry,
}) {
  const showModel = typeof model === 'string' && model.trim().length > 0
  const showCategory = typeof categoryName === 'string' && categoryName.trim().length > 0
  const showSubcategory = typeof subcategoryName === 'string' && subcategoryName.trim().length > 0
  const showBreadcrumb = showCategory || showSubcategory
  const availabilityLabel = AVAILABILITY_LABELS[availability]
  const availabilityClass = AVAILABILITY_STYLES[availability]
  const showAvailability = Boolean(availabilityLabel && availabilityClass)
  const showApprovals = approvals?.length > 0
  const showSpecifications = specifications?.length > 0

  return (
    <aside className="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-primary-200)] bg-gradient-to-br from-[var(--color-primary-50)] via-white to-white shadow-[0_8px_30px_-12px_color-mix(in_srgb,var(--color-primary-700)_18%,transparent)]">
      <div
        className="h-1 shrink-0 bg-gradient-to-r from-[var(--color-primary-700)] via-[var(--color-primary-500)] to-[var(--color-primary-300)]"
        aria-hidden
      />

      <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 px-6 py-7 md:px-8 md:py-8">
        {showBreadcrumb ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-600)]">
            {showCategory ? <span>{categoryName}</span> : null}
            {showCategory && showSubcategory ? (
              <span className="text-[var(--color-primary-300)]" aria-hidden>
                /
              </span>
            ) : null}
            {showSubcategory ? (
              <span className="text-[var(--color-primary-800)]">{subcategoryName}</span>
            ) : null}
          </p>
        ) : null}

        <h1
          className={`text-2xl font-bold leading-tight tracking-tight text-[var(--color-primary-900)] sm:text-3xl ${showBreadcrumb ? 'mt-3' : ''}`}
        >
          {title}
        </h1>

        {showAvailability ? (
          <p className={`mt-5 inline-flex items-center rounded-lg border px-3.5 py-2 text-sm font-semibold shadow-sm ${availabilityClass}`}>
            {availabilityLabel}
          </p>
        ) : null}

        {showModel ? (
          <p className={`${showAvailability ? 'ml-0 mt-3 sm:ml-3 sm:mt-5' : 'mt-5'} inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary-200)] bg-white/80 px-3.5 py-2 text-sm shadow-sm backdrop-blur-sm`}>
            <span className="font-semibold uppercase tracking-wide text-[var(--color-primary-600)]">
              Model
            </span>
            <span className="font-medium text-[var(--text-primary)]">{model}</span>
          </p>
        ) : null}
      </header>

      {showApprovals ? (
        <section
          className={`shrink-0 border-t border-[var(--color-primary-100)] px-6 py-6 md:px-8 ${!showSpecifications ? 'flex flex-1 flex-col' : ''}`}
          aria-labelledby="product-approvals-heading"
        >
          <SectionHeading id="product-approvals-heading">Approvals</SectionHeading>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {approvals.map((approval) => (
              <ApprovalBadge
                key={approval.label}
                label={approval.label}
                imageSrc={approval.imageSrc}
              />
            ))}
          </div>
        </section>
      ) : null}

      {showSpecifications ? (
        <section
          className="flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-[var(--color-primary-100)] bg-[color-mix(in_srgb,var(--color-primary-50)_55%,white)] px-6 py-6 md:px-8"
          aria-labelledby="product-specifications-heading"
        >
          <SectionHeading id="product-specifications-heading">Specifications</SectionHeading>
          <div className="mt-5 flex-1 space-y-6">
            {specifications.map((group, groupIndex) => {
              const groupKey = `${group.title || 'group'}-${groupIndex}`
              return (
                <div key={groupKey}>
                  {group.title ? (
                    <h3 className="text-sm font-semibold text-[var(--color-primary-800)]">
                      {group.title}
                    </h3>
                  ) : null}
                  <ul className={`space-y-2.5 ${group.title ? 'mt-3' : ''}`}>
                    {group.items.map((item, itemIndex) => (
                      <li
                        key={`${groupIndex}-${itemIndex}`}
                        className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-primary)]"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-500)]"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      ) : !showApprovals ? (
        <div className="flex-1" aria-hidden />
      ) : null}

      {onAddToInquiry ? <InquiryAsideAction onClick={onAddToInquiry} /> : null}
      </div>
    </aside>
  )
}
