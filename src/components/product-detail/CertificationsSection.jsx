/**
 * @param {Object} props
 * @param {string[]} props.badges
 */
export default function CertificationsSection({ badges }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-semibold text-slate-900">Certifications</h2>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {badges.map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        Reserved for certification logos, downloadable PDFs, and compliance files.
      </div>
    </section>
  )
}
