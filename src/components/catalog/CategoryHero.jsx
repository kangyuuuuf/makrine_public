import { motion as Motion, useReducedMotion } from 'framer-motion'
import { DIVISION_LABELS } from '../../data/catalogMock.js'

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string[]} props.paragraphs
 * @param {string} props.image
 * @param {'all' | 'life-saving' | 'fire-fighting' | undefined} [props.division]
 * @param {(id: 'all' | 'life-saving' | 'fire-fighting') => void} [props.onDivisionChange] — same behavior as the Section dropdown in the catalog sidebar
 */
export default function CategoryHero({ title, paragraphs, image, division, onDivisionChange }) {
  const reduce = useReducedMotion()
  const jumpButtonClass =
    'inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'

  const dur = reduce ? 0 : 0.45
  const stagger = reduce ? 0 : 0.07

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: reduce ? 0 : 0.04,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="touch-pan-y overflow-hidden border-b border-[var(--border)] bg-white pb-10 sm:pb-12">
      <div className="grid gap-8 lg:h-[20rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-0">
        <Motion.div
          className="flex flex-col justify-center gap-4 max-lg:pt-2 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-10 lg:py-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <Motion.p
            variants={item}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
          >
            Product category
          </Motion.p>
          <Motion.h1
            variants={item}
            className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl"
          >
            {title}
          </Motion.h1>
          <div className="flex max-w-xl flex-col gap-3">
            {paragraphs.map((text, i) => (
              <Motion.p
                key={i}
                variants={item}
                className="text-[15px] leading-relaxed text-[var(--text-secondary)]"
              >
                {text}
              </Motion.p>
            ))}
          </div>
          {division === 'all' && typeof onDivisionChange === 'function' ? (
            <Motion.div
              variants={item}
              className="grid w-full max-w-2xl grid-cols-1 gap-3 pt-1 sm:grid-cols-2"
              role="group"
              aria-label="Jump to product section"
            >
              <button
                type="button"
                onClick={() => onDivisionChange('life-saving')}
                className={jumpButtonClass}
              >
                {DIVISION_LABELS['life-saving']}
              </button>
              <button
                type="button"
                onClick={() => onDivisionChange('fire-fighting')}
                className={jumpButtonClass}
              >
                {DIVISION_LABELS['fire-fighting']}
              </button>
            </Motion.div>
          ) : null}
        </Motion.div>
        <Motion.div
          className="relative min-h-[180px] overflow-hidden bg-neutral-100 lg:h-full lg:min-h-0 lg:border-l lg:border-[var(--border)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.08 }}
        >
          <img
            src={image}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          />
        </Motion.div>
      </div>
    </section>
  )
}
