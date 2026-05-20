import DetailSectionHeading from './DetailSectionHeading.jsx'

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {{ title?: string; items: string[] }[]} props.groups
 */
export default function ProductFieldSection({ title, groups }) {
  if (!groups?.length) return null

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <DetailSectionHeading>{title}</DetailSectionHeading>

      <div className="mt-5 space-y-6">
        {groups.map((group, groupIndex) => {
          const groupKey = `${group.title || 'group'}-${groupIndex}`
          return (
            <div key={groupKey}>
              {group.title ? (
                <h3 className="text-base font-semibold text-slate-800">{group.title}</h3>
              ) : null}
              <ul
                className={`list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 ${group.title ? 'mt-3' : ''}`}
              >
                {group.items.map((item, itemIndex) => (
                  <li key={`${groupIndex}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
