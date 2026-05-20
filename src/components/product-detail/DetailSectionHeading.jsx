/**
 * @param {Object} props
 * @param {string} [props.id]
 * @param {React.ReactNode} props.children
 */
export default function DetailSectionHeading({ id, children }) {
  return (
    <div>
      <h2 id={id} className="text-xl font-semibold text-slate-900">
        {children}
      </h2>
      <div
        className="mt-3 h-0.5 w-14 rounded-full bg-gradient-to-r from-[var(--color-primary-700)] via-[var(--color-primary-500)] to-[var(--color-primary-300)] sm:w-16"
        aria-hidden
      />
    </div>
  )
}
