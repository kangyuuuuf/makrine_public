import { useMemo } from 'react'
import PlaceholderBlock from './PlaceholderBlock.jsx'

/**
 * @param {Object} props
 * @param {number} [props.descriptionLines]
 */
export default function ProductInfo({ descriptionLines = 4 }) {
  const lines = useMemo(() => Array.from({ length: descriptionLines }, (_, idx) => idx), [descriptionLines])

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Product Information</h1>
      <div className="mt-4 space-y-3">
        <PlaceholderBlock className="h-9 w-4/5" label="Product name placeholder" />
        <PlaceholderBlock className="h-6 w-1/2" label="Manufacturer placeholder" />
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
