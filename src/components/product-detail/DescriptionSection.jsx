/**
 * @param {Object} props
 * @param {string} props.description
 */
export default function DescriptionSection({ description }) {
  if (typeof description !== 'string' || !description.trim()) return null

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-semibold text-slate-900">Description</h2>
      <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{description}</p>
    </section>
  )
}
