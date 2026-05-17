import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

/**
 * Footer-style inquiry action anchored to the bottom-right of the product aside.
 * @param {Object} props
 * @param {() => void} props.onClick
 */
export default function InquiryAsideAction({ onClick }) {
  return (
    <footer className="relative shrink-0 border-t border-[var(--color-primary-100)] bg-gradient-to-t from-white via-white/95 to-white/80 px-5 py-4 md:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-white/90 to-transparent"
        aria-hidden
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClick}
          className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-[var(--color-primary-600)] bg-[var(--color-primary-600)] py-2.5 pl-3.5 pr-4 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_color-mix(in_srgb,var(--color-primary-700)_45%,transparent)] ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary-700)] hover:bg-[var(--color-primary-700)] hover:shadow-[0_8px_20px_-4px_color-mix(in_srgb,var(--color-primary-700)_50%,transparent)] active:translate-y-0 active:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition group-hover:bg-white/20"
            aria-hidden
          >
            <ChatBubbleLeftRightIcon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </span>
          <span className="pr-0.5 tracking-tight">Add to Inquiry</span>
        </button>
      </div>
    </footer>
  )
}
