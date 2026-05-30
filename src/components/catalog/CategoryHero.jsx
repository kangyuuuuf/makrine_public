import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { DIVISION_LABELS } from '../../data/catalogConfig.js'

const JUMP_BUTTON_CLASS =
  'group inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-[var(--color-primary-600)] bg-gradient-to-r from-[var(--color-primary-700)] via-[var(--color-primary-500)] to-[var(--color-primary-400)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_color-mix(in_srgb,var(--color-primary-700)_28%,transparent)] transition-[background,box-shadow,border-color] duration-200 hover:border-[var(--color-primary-700)] hover:from-[var(--color-primary-800)] hover:via-[var(--color-primary-600)] hover:to-[var(--color-primary-500)] hover:shadow-[0_6px_18px_color-mix(in_srgb,var(--color-primary-800)_32%,transparent)] active:border-[var(--color-primary-900)] active:from-[var(--color-primary-900)] active:via-[var(--color-primary-700)] active:to-[var(--color-primary-600)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'

const JUMP_ICON_CLASS =
  'h-4 w-4 shrink-0 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white'

/** @type {Record<'all' | 'life-saving' | 'fire-fighting', ('all' | 'life-saving' | 'fire-fighting')[]>} */
const JUMP_TARGETS_BY_DIVISION = {
  all: ['life-saving', 'fire-fighting'],
  'life-saving': ['all', 'fire-fighting'],
  'fire-fighting': ['all', 'life-saving'],
}

/** @type {Record<'all' | 'life-saving' | 'fire-fighting', string>} */
const JUMP_SECTION_LABEL_BY_DIVISION = {
  all: 'Browse by section',
  'life-saving': 'Browse other section',
  'fire-fighting': 'Browse other section',
}

/**
 * @param {Object} props
 * @param {'all' | 'life-saving' | 'fire-fighting'} props.division
 * @param {('all' | 'life-saving' | 'fire-fighting')[]} props.targets
 * @param {(id: 'all' | 'life-saving' | 'fire-fighting') => void} props.onDivisionChange
 */
function SectionJumpButtons({ division, targets, onDivisionChange }) {
  if (targets.length === 0) return null

  const sectionLabel = JUMP_SECTION_LABEL_BY_DIVISION[division] ?? 'Browse by section'

  const gridClass =
    targets.length > 1
      ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3'
      : 'grid grid-cols-1 gap-2.5'

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3 pt-1">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
        {sectionLabel}
      </p>
      <div className={gridClass} role="group" aria-label={sectionLabel}>
        {targets.map((targetId) => (
          <button
            key={targetId}
            type="button"
            onClick={() => onDivisionChange(targetId)}
            className={JUMP_BUTTON_CLASS}
          >
            <span>{DIVISION_LABELS[targetId]}</span>
            <ChevronRightIcon className={JUMP_ICON_CLASS} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  )
}

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
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-600)]"
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
          {division && typeof onDivisionChange === 'function' ? (
            <Motion.div variants={item}>
              <SectionJumpButtons
                division={division}
                targets={JUMP_TARGETS_BY_DIVISION[division] ?? []}
                onDivisionChange={onDivisionChange}
              />
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
