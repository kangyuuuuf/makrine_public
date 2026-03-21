import { useState } from 'react'
import Typewriter from 'typewriter-effect'
import './CompanyNameHero.css'

const TITLE_OPTIONS = { delay: 55 }
const TAGLINE_OPTIONS = { delay: 42, skipAddStyles: true }

function hideTypewriterCursor(state) {
  const el = state?.elements?.cursor
  if (el) el.style.display = 'none'
}

function CompanyNameHero() {
  const [showTagline, setShowTagline] = useState(false)

  return (
    <section
      className="company-name-hero"
      aria-labelledby="company-name-hero-heading"
    >
      <h1 id="company-name-hero-heading" className="company-name-hero__title">
        <Typewriter
          component="span"
          options={TITLE_OPTIONS}
          onInit={(tw) => {
            tw
              .typeString('Makrine')
              .callFunction(hideTypewriterCursor)
              .pauseFor(450)
              .callFunction(() => {
                setShowTagline(true)
              })
              .start()
          }}
        />
      </h1>
      {showTagline ? (
        <p className="company-name-hero__tagline">
          <Typewriter
            component="span"
            options={TAGLINE_OPTIONS}
            onInit={(tw) => {
              tw
                .typeString('the key of marine safety')
                .callFunction(hideTypewriterCursor)
                .start()
            }}
          />
        </p>
      ) : null}
    </section>
  )
}

export default CompanyNameHero
