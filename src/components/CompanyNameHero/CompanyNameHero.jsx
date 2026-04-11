import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import './CompanyNameHero.css'

const EYEBROW = 'Marine safety solutions'
const BRAND = 'Makrine'
const TAGLINE = 'Life Saving and Fire Fighting Equipment'

const TITLE_OPTIONS = { delay: 55 }
const TAGLINE_OPTIONS = { delay: 42, skipAddStyles: true }

function hideTypewriterCursor(state) {
  const el = state?.elements?.cursor
  if (el) el.style.display = 'none'
}

function CompanyNameHero() {
  const prefersReducedMotion = useReducedMotion()
  const reduced = Boolean(prefersReducedMotion)
  const [showTagline, setShowTagline] = useState(reduced)

  if (reduced) {
    return (
      <section
        className="company-name-hero"
        aria-labelledby="company-name-hero-heading"
      >
        <div className="company-name-hero__glow" aria-hidden="true" />
        <div className="company-name-hero__inner">
          <p className="company-name-hero__eyebrow">{EYEBROW}</p>
          <h1 id="company-name-hero-heading" className="company-name-hero__title">
            <span className="company-name-hero__title-text">{BRAND}</span>
          </h1>
          <p className="company-name-hero__tagline">{TAGLINE}</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="company-name-hero"
      aria-labelledby="company-name-hero-heading"
    >
      <div className="company-name-hero__glow" aria-hidden="true" />
      <div className="company-name-hero__inner">
        <p className="company-name-hero__eyebrow">{EYEBROW}</p>
        <h1 id="company-name-hero-heading" className="company-name-hero__title">
          <Typewriter
            component="span"
            options={TITLE_OPTIONS}
            onInit={(tw) => {
              tw
                .typeString(BRAND)
                .callFunction(hideTypewriterCursor)
                .pauseFor(450)
                .callFunction(() => {
                  setShowTagline(true)
                })
                .start()
            }}
          />
        </h1>
        <p className="company-name-hero__tagline">
          {showTagline ? (
            <Typewriter
              component="span"
              options={TAGLINE_OPTIONS}
              onInit={(tw) => {
                tw
                  .typeString(TAGLINE)
                  .callFunction(hideTypewriterCursor)
                  .start()
              }}
            />
          ) : (
            <span aria-hidden="true">&nbsp;</span>
          )}
        </p>
      </div>
    </section>
  )
}

export default CompanyNameHero
