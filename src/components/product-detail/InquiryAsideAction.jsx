import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

/**
 * Inquiry CTA anchored to the bottom of the product aside, using the same gradient language as the card.
 * @param {Object} props
 * @param {() => void} props.onClick
 */
export default function InquiryAsideAction({ onClick }) {
  return (
    <footer className="relative shrink-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary-50)_90%,white)] via-white to-[color-mix(in_srgb,var(--color-primary-100)_28%,white)] px-6 py-5 md:px-8 md:py-6">
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-200)]/60 to-transparent md:inset-x-8"
        aria-hidden
      />
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[var(--color-primary-600)] bg-[var(--color-primary-600)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_color-mix(in_srgb,var(--color-primary-700)_45%,transparent)] ring-1 ring-white/20 transition-all duration-200 hover:border-[var(--color-primary-700)] hover:bg-[var(--color-primary-700)] hover:shadow-[0_8px_20px_-4px_color-mix(in_srgb,var(--color-primary-700)_50%,transparent)] active:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition group-hover:bg-white/20"
          aria-hidden
        >
          <ChatBubbleLeftRightIcon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
        </span>
        <span className="tracking-tight">Add to Inquiry</span>
      </button>
    </footer>
  )
}
