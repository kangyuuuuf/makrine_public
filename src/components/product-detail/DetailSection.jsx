import PlaceholderBlock from './PlaceholderBlock.jsx'

export default function DetailSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-semibold text-slate-900">Detailed Information</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <PlaceholderBlock className="h-56 rounded-3xl border-dashed" label="Detail image placeholder one" />
        <PlaceholderBlock className="h-56 rounded-3xl border-dashed" label="Detail image placeholder two" />
      </div>

      <PlaceholderBlock className="mt-4 h-64 w-full rounded-3xl border-dashed md:h-80" label="Long specification placeholder" />
    </section>
  )
}
