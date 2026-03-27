import { motion as Motion, useReducedMotion } from 'framer-motion'
import {
  ShieldCheckIcon,
  BeakerIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import brandIconOnly from '../../assets/icon_only.png'
import storyImage from '../../assets/web/webAssert6.jpg'
import partnershipImage from '../../assets/web/webAssert9.png'
import './AboutPage.css'

function SectionHeadingBrandIcon({ align = 'start' }) {
  const wrapClass =
    align === 'center'
      ? 'about-page__heading-icon-wrap about-page__heading-icon-wrap--center'
      : 'about-page__heading-icon-wrap'
  return (
    <div className={wrapClass}>
      <img
        src={brandIconOnly}
        alt=""
        width={48}
        height={48}
        className="about-page__heading-icon-img"
        decoding="async"
      />
    </div>
  )
}

const FEATURES = [
  {
    title: 'Certified Products',
    description: 'CCS / MED / USCG compliant',
    Icon: ShieldCheckIcon,
  },
  {
    title: 'Quality Guaranteed',
    description: 'Every item is tested and traceable',
    Icon: BeakerIcon,
  },
  {
    title: 'Stable Pricing',
    description: 'Direct connection with manufacturers',
    Icon: CurrencyDollarIcon,
  },
  {
    title: 'Local Houston Stock',
    description: 'Fast response, urgent orders supported',
    Icon: MapPinIcon,
  },
  {
    title: 'Customer-First Service',
    description: 'Quick communication, responsible after-sales',
    Icon: ChatBubbleLeftRightIcon,
  },
]

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }

  const contactHref = `${import.meta.env.BASE_URL}#contact`

  return (
    <main className="about-page">
      <Motion.section
        className="about-page__section"
        aria-labelledby="our-story-heading"
        {...motionProps}
      >
        <div className="about-page__inner">
          <div className="about-page__grid-2">
            <div className="about-page__stack">
              <div>
                <h2 id="our-story-heading" className="about-page__title">
                  Our Story
                </h2>
                <SectionHeadingBrandIcon />
                <div className="about-page__accent" />
              </div>
              <div className="about-page__body-stack">
                <p>Makrine began with a question:</p>
                <p>
                  Why is lifesaving equipment, something meant to protect lives, often difficult to source, slow to
                  deliver, and lacking real user feedback?
                </p>
                <p>We started with one mission: deliver tested, compliant equipment with clarity and responsibility.</p>
                <p>
                  We’re a company shaped by the needs of our customers, flexible, adaptive, and constantly evolving with
                  real feedback.
                </p>
              </div>
            </div>
            <div className="about-page__media">
              <img
                className="about-page__media-img"
                src={storyImage}
                alt="Makrine company operations, warehouse, and marine safety equipment"
                decoding="async"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Motion.section>

      <Motion.section
        className="about-page__section about-page__section--soft"
        aria-labelledby="why-makrine-heading"
        {...motionProps}
      >
        <div className="about-page__blob about-page__blob--top" aria-hidden />
        <div className="about-page__blob about-page__blob--br" aria-hidden />
        <div className="about-page__blob about-page__blob--left" aria-hidden />

        <div className="about-page__inner">
          <div className="about-page__why-header">
            <p className="about-page__eyebrow">What sets us apart</p>
            <h2 id="why-makrine-heading" className="about-page__title--why">
              Why Makrine
            </h2>
            <SectionHeadingBrandIcon align="center" />
            <div className="about-page__accent about-page__accent--center" />
          </div>

          <div className="about-page__feature-grid">
            {FEATURES.map((feature) => {
              const { title, description, Icon } = feature
              return (
                <article key={title} className="about-page__feature-card">
                  <div className="about-page__feature-icon-wrap">
                    <Icon strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="about-page__feature-title">{title}</h3>
                  <p className="about-page__feature-desc">{description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </Motion.section>

      <Motion.section
        className="about-page__section"
        aria-labelledby="work-together-heading"
        {...motionProps}
      >
        <div className="about-page__inner">
          <div className="about-page__grid-2">
            <div className="about-page__cell--media">
              <div className="about-page__media">
                <img
                  className="about-page__media-img"
                  src={partnershipImage}
                  alt="Partnership and collaboration for marine safety and equipment supply"
                  decoding="async"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="about-page__cell--cta-text">
              <div>
                <h2 id="work-together-heading" className="about-page__title">
                  Let’s Work Together
                </h2>
                <SectionHeadingBrandIcon />
                <div className="about-page__accent" />
              </div>
              <p className="about-page__body">
                Whether you need lifesaving equipment, firefighting supplies, or long-term cooperation, we’re here to
                support your operations with reliability and care.
              </p>
              <div>
                <a href={contactHref} className="about-page__cta">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Motion.section>
    </main>
  )
}
