import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.ariaLabelledBy
 * @param {string} [props.overlayLabel]
 * @param {import('react').ReactNode} props.children
 */
export default function InquiryPopup({
  isOpen,
  onClose,
  ariaLabelledBy,
  overlayLabel = 'Close dialog',
  children,
}) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <Motion.button
            key="inquiry-popup-overlay"
            type="button"
            aria-label={overlayLabel}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-slate-950/65 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <Motion.div
            key="inquiry-popup-panel-wrapper"
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            className="fixed inset-0 z-[81] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.24 }}
          >
            <Motion.div
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_24px_64px_rgba(2,6,23,0.28)]"
              initial={reduce ? false : { y: 20, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: 8, scale: 0.99, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </Motion.div>
          </Motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
