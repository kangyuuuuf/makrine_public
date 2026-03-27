import { motion as Motion, useReducedMotion } from 'framer-motion'

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string[]} props.paragraphs
 * @param {string} props.image
 */
export default function CategoryHero({ title, paragraphs, image }) {
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
    <section className="overflow-hidden border-b border-[var(--border)] bg-white pb-10 sm:pb-12">
      <div className="grid gap-8 lg:h-[20rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-0">
        <Motion.div
          className="flex flex-col justify-center gap-4 max-lg:pt-2 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-10 lg:py-5"
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
        </Motion.div>
        <Motion.div
          className="relative min-h-[180px] overflow-hidden bg-neutral-100 lg:h-full lg:min-h-0 lg:border-l lg:border-[var(--border)]"
          initial={reduce ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.08 }}
        >
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Motion.div>
      </div>
    </section>
  )
}
