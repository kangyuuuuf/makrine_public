import { motion as Motion, useReducedMotion } from 'framer-motion'
import brandIcon from '../../assets/icon_only.png'
import './ValuesSection.css'

const EASE_OUT = [0.4, 0, 0.2, 1]

const CARD_DURATION = 0.5

const CARD_STAGGER = 0.2

function ValueCard({ title, description, imageUrl, variants }) {
  return (
    <Motion.div className="value-card" variants={variants}>
      <div className="value-card__media">
        <img src={imageUrl} alt={title} className="value-card__img" />
        <div className="value-card__title-wrap">
          <h3 className="value-card__title">{title}</h3>
        </div>
      </div>
      <p className="value-card__description">{description}</p>
    </Motion.div>
  )
}

const VALUES = [
  {
    title: 'Authenticity',
    description:
      'We bring compassion, sincerity, and integrity to everything we do. At Makrine, authenticity means being honest in our relationships, transparent in our processes, and accountable in our decisions. We believe trust is built through consistency in our products, our partnerships, and our long-term commitments.',
    imageUrl:
      'https://images.unsplash.com/photo-1761856907560-0b03c9a88e4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHZpZXclMjB3aW5kb3clMjBtYXJpdGltZXxlbnwxfHx8fDE3NzQxMjg1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Ingenuity',
    description:
      'In a highly regulated industry, real innovation comes from insight. Ingenuity is the ability to find smart, practical solutions within complexity. At Makrine, we push beyond compliance, designing safer, more user-driven safety products through innovation and collaboration.',
    imageUrl:
      'https://images.unsplash.com/photo-1773161960049-3ec16360da87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwJTIwcG9ydGhvbGUlMjBtYXJpbmV8ZW58MXx8fHwxNzc0MTI4NTcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Responsibility',
    description:
      'Business should serve a greater good. Responsibility, to us, means being accountable for our impact on people, communities, and the planet. As socially responsible entrepreneurs, we use innovation and enterprise to empower communities and help build a safer, more sustainable maritime world.',
    imageUrl:
      'https://images.unsplash.com/photo-1772140994501-a12bbc57a1e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxpY29wdGVyJTIwcmVzY3VlJTIwbWFyaXRpbWV8ZW58MXx8fHwxNzc0MTI4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
]

function ValuesSection() {
  const prefersReducedMotion = useReducedMotion()
  const reduced = Boolean(prefersReducedMotion)

  const off = { opacity: 0, y: 16 }
  const on = { opacity: 1, y: 0 }

  const innerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.35,
        delayChildren: reduced ? 0 : 0,
      },
    },
  }

  const topBlockVariants = {
    hidden: reduced ? on : off,
    visible: {
      ...on,
      transition: {
        type: 'tween',
        duration: reduced ? 0 : 0.35,
        ease: EASE_OUT,
      },
    },
  }

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : CARD_STAGGER,
        delayChildren: reduced ? 0 : 0,
      },
    },
  }

  const cardVariants = {
    hidden: reduced ? on : off,
    visible: {
      ...on,
      transition: {
        type: 'tween',
        duration: reduced ? 0 : CARD_DURATION,
        ease: EASE_OUT,
      },
    },
  }

  const viewport = { once: true, amount: 0.35 }

  return (
    <section className="values-section" aria-labelledby="values-section-heading">
      <Motion.div
        className="values-section__inner"
        variants={innerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <Motion.div variants={topBlockVariants} className="values-section__top">
          <div className="values-section__header">
            <h2 id="values-section-heading" className="values-section__heading">
              Our Value
            </h2>
            <h2 id="values-section__heading" className="values-section__heading">
              Authenticity | Ingenuity | Responsibility
            </h2>
          </div>

          <div className="values-section__icon" aria-hidden="true">
            <img
              className="values-section__icon-img"
              src={brandIcon}
              alt=""
              width={48}
              height={48}
              decoding="async"
            />
          </div>

          <div className="values-section__intro">
            <p>
              At Makrine, our values guide every decision, design, and partnership.
              They represent who we are — a company built on trust, driven by
              creativity, and grounded in a sense of duty to the people and the
              world we serve.
            </p>
          </div>
        </Motion.div>

        <Motion.div
          variants={gridContainerVariants}
          className="values-section__grid"
        >
          {VALUES.map((value) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              imageUrl={value.imageUrl}
              variants={cardVariants}
            />
          ))}
        </Motion.div>
      </Motion.div>
    </section>
  )
}

export default ValuesSection
