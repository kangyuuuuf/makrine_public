import { useMemo } from 'react'
import PlaceholderBlock from './PlaceholderBlock.jsx'

/**
 * @param {Object} props
 * @param {number} [props.descriptionLines]
 * @param {string} [props.name]
 * @param {string} [props.slug]
 * @param {string} [props.model]
 */
export default function ProductInfo({ descriptionLines = 4, name = 'Product Information', slug = '', model = '' }) {
  const lines = useMemo(() => Array.from({ length: descriptionLines }, (_, idx) => idx), [descriptionLines])
  const showSlug = typeof slug === 'string' && slug.trim().length > 0
  const showModel = typeof model === 'string' && model.trim().length > 0

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Product</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{name}</h1>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        {showSlug ? (
          <p>
            <span className="font-medium text-slate-800">Slug:</span> {slug}
          </p>
        ) : null}
        {showModel ? (
          <p>
            <span className="font-medium text-slate-800">Model:</span> {model}
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        {lines.map((line) => (
          <PlaceholderBlock
            key={line}
            className={`h-4 ${line === lines.length - 1 ? 'w-3/4' : 'w-full'}`}
            label="Description placeholder"
          />
        ))}
      </div>
    </section>
  )
}
