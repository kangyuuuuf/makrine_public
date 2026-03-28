import { motion as Motion, useReducedMotion } from 'framer-motion'
import { PhoneIcon, ClockIcon, CubeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import brandIconOnly from '../../assets/icon_only.png'
import './ContactPage.css'

const ADDRESS_LINE_1 = '3130 Strawberry Rd, Suite D'
const ADDRESS_LINE_2 = 'Pasadena, TX 77504'

const GOOGLE_MAPS_EMBED_SRC =
  'https://www.google.com/maps?q=Makrine+LLC+3130+Strawberry+Rd+Suite+D+Pasadena+TX+77504&output=embed'

function SectionHeadingBrandIcon({ align = 'start' }) {
  const wrapClass =
    align === 'center'
      ? 'contact-page__heading-icon-wrap contact-page__heading-icon-wrap--center'
      : 'contact-page__heading-icon-wrap'
  return (
    <div className={wrapClass}>
      <img
        src={brandIconOnly}
        alt=""
        width={48}
        height={48}
        className="contact-page__heading-icon-img"
        decoding="async"
      />
    </div>
  )
}

function LocationMapEmbed() {
  return (
    <div className="contact-page__map">
      <iframe
        className="contact-page__map-iframe"
        src={GOOGLE_MAPS_EMBED_SRC}
        title="Google Map: Makrine LLC, 3130 Strawberry Rd, Suite D, Pasadena, TX 77504"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  )
}

export default function ContactPage() {
  const prefersReducedMotion = useReducedMotion()
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <main className="contact-page">
      <Motion.section className="contact-page__section contact-page__section--hero" aria-labelledby="contact-hero-heading" {...motionProps}>
        <div className="contact-page__inner">
          <div className="contact-page__hero">
            <p className="contact-page__eyebrow">Get in touch</p>
            <h1 id="contact-hero-heading" className="contact-page__title contact-page__title--hero">
              Contact Us
            </h1>
            <SectionHeadingBrandIcon />
            <div className="contact-page__accent" />
            <p className="contact-page__lead">
              We’re here to help with equipment questions, orders, and partnership inquiries. Visit our Houston-area
              office or reach our team using the details below.
            </p>
            <p className="contact-page__hero-note">
              Prefer the form?{' '}
              <a href="#contact" className="contact-page__inline-link">
                Send a message via Ask the Captain
              </a>
              .
            </p>
          </div>
        </div>
      </Motion.section>

      <Motion.section
        className="contact-page__section contact-page__section--soft"
        aria-labelledby="our-location-heading"
        {...motionProps}
      >
        <div className="contact-page__blob contact-page__blob--top" aria-hidden />
        <div className="contact-page__blob contact-page__blob--br" aria-hidden />

        <div className="contact-page__inner">
          <header className="contact-page__section-header">
            <h2 id="our-location-heading" className="contact-page__title">
              Our Location
            </h2>
            <SectionHeadingBrandIcon align="center" />
            <div className="contact-page__accent contact-page__accent--center" />
            <p className="contact-page__section-sub">
              Headquarters and warehouse — same address as listed across Makrine communications.
            </p>
          </header>

          <div className="contact-page__location-grid">
            <div className="contact-page__location-stack">
              <article className="contact-page__card contact-page__card--address">
                <h3 className="contact-page__card-title">Makrine</h3>
                <address className="contact-page__address">
                  {ADDRESS_LINE_1}
                  <br />
                  {ADDRESS_LINE_2}
                </address>
                <p className="contact-page__address-note">United States</p>
              </article>

              <aside className="contact-page__card contact-page__card--meta" aria-label="Contact details">
                <ul className="contact-page__meta-list">
                  <li className="contact-page__meta-item">
                    <span className="contact-page__meta-icon" aria-hidden>
                      <PhoneIcon strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="contact-page__meta-label">Phone</p>
                      <a className="contact-page__meta-value" href="tel:+17132555005">
                        (713) 255-5005
                      </a>
                    </div>
                  </li>
                  <li className="contact-page__meta-item">
                    <span className="contact-page__meta-icon" aria-hidden>
                      <CubeIcon strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="contact-page__meta-label">Sales</p>
                      <a className="contact-page__meta-value" href="mailto:sales@makrine.com">
                        sales@makrine.com
                      </a>
                    </div>
                  </li>
                  <li className="contact-page__meta-item">
                    <span className="contact-page__meta-icon" aria-hidden>
                      <Cog6ToothIcon strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="contact-page__meta-label">Operations</p>
                      <a className="contact-page__meta-value" href="mailto:admin@makrine.com">
                        admin@makrine.com
                      </a>
                    </div>
                  </li>
                  <li className="contact-page__meta-item">
                    <span className="contact-page__meta-icon" aria-hidden>
                      <ClockIcon strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="contact-page__meta-label">Business hours</p>
                      <p className="contact-page__meta-value contact-page__meta-value--static">
                        Monday–Friday, 8:00 AM – 5:00 PM CST
                      </p>
                    </div>
                  </li>
                </ul>
              </aside>
            </div>

            <LocationMapEmbed />
          </div>
        </div>
      </Motion.section>
    </main>
  )
}
