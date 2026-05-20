import DetailSectionHeading from './DetailSectionHeading.jsx'

/**
 * @param {Object} props
 * @param {{ key: string; label: string; value: string }[]} props.attributes
 */
export default function AttributesSection({ attributes }) {
  if (!attributes?.length) return null

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <DetailSectionHeading>Attributes</DetailSectionHeading>

      <dl className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-100">
        {attributes.map((attribute) => (
          <div
            key={attribute.key}
            className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[minmax(8rem,12rem)_1fr] sm:gap-4"
          >
            <dt className="text-sm font-medium text-slate-600">{attribute.label}</dt>
            <dd className="text-sm leading-relaxed text-slate-800">{attribute.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
