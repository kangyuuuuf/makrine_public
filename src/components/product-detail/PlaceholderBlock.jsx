/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.label]
 */
export default function PlaceholderBlock({ className = '', label }) {
  return (
    <div
      aria-label={label}
      className={`rounded-2xl border border-slate-200 bg-slate-50 ${className}`}
    />
  )
}
