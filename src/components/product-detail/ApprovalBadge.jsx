import { useState } from 'react'

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string | null} [props.imageSrc]
 */
export default function ApprovalBadge({ label, imageSrc = null }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(imageSrc) && !imageFailed

  if (showImage) {
    return (
      <span className="inline-block max-w-full shrink-0 overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={`${label} approval`}
          className="block h-10 w-auto max-w-full sm:h-11"
          onError={() => setImageFailed(true)}
        />
      </span>
    )
  }

  return (
    <span className="inline-flex h-10 items-center rounded-full bg-[var(--color-primary-600)] px-4 text-sm font-semibold tracking-wide text-white shadow-sm sm:h-11">
      {label}
    </span>
  )
}
