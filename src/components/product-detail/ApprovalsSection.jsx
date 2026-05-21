import { mapApprovalsToDisplay } from '../../data/productDisplayUtils.js'
import ApprovalBadge from './ApprovalBadge.jsx'

/**
 * @param {Object} props
 * @param {{ label: string; imageSrc?: string | null }[] | string[]} props.approvals
 */
export default function ApprovalsSection({ approvals }) {
  if (!approvals?.length) return null

  const items =
    typeof approvals[0] === 'string'
      ? mapApprovalsToDisplay(/** @type {string[]} */ (approvals))
      : approvals

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-xl font-semibold text-slate-900">Approvals</h2>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        {items.map((approval) => (
          <ApprovalBadge
            key={approval.label}
            label={approval.label}
            imageSrc={approval.imageSrc}
          />
        ))}
      </div>
    </section>
  )
}
