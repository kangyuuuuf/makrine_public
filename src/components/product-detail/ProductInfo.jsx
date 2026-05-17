/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.model]
 * @param {string} [props.categoryName]
 * @param {string} [props.subcategoryName]
 */
export default function ProductInfo({
  title = 'Product',
  model = '',
  categoryName = '',
  subcategoryName = '',
}) {
  const showModel = typeof model === 'string' && model.trim().length > 0
  const showCategory = typeof categoryName === 'string' && categoryName.trim().length > 0
  const showSubcategory = typeof subcategoryName === 'string' && subcategoryName.trim().length > 0
  const showBreadcrumb = showCategory || showSubcategory

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      {showBreadcrumb ? (
        <p className="text-sm text-slate-500">
          {showCategory ? <span>{categoryName}</span> : null}
          {showCategory && showSubcategory ? <span className="mx-2 text-slate-300">/</span> : null}
          {showSubcategory ? <span className="font-medium text-slate-700">{subcategoryName}</span> : null}
        </p>
      ) : null}

      <h1 className={`text-3xl font-semibold tracking-tight text-slate-900 ${showBreadcrumb ? 'mt-3' : ''}`}>
        {title}
      </h1>

      {showModel ? (
        <p className="mt-5 text-sm text-slate-600">
          <span className="font-medium text-slate-800">Model:</span> {model}
        </p>
      ) : null}
    </section>
  )
}
