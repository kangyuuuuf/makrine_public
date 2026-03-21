import { useState } from 'react'
import { LayoutGroup, motion as Motion, useReducedMotion } from 'framer-motion'
import logoImg from '../../assets/icon.png'
import './Navbar.css'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Life Saving Equipment', href: '#life-saving' },
  { label: 'Fire Fighting Equipment', href: '#fire-fighting' },
  { label: 'News', href: '#news' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const indicatorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }

  return (
    <header className="site-nav" role="banner">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#home">
          <img
            className="site-nav__logo"
            src={logoImg}
            alt="Makrine"
            decoding="async"
          />
        </a>

        <nav className="site-nav__actions" aria-label="Main navigation">
          <LayoutGroup id="main-nav">
            <ul className="site-nav__links">
              {NAV_ITEMS.map(({ label, href }, index) => (
                <li key={href} className="site-nav__links-item">
                  <a
                    className={
                      'site-nav__link' + (activeIndex === index ? ' site-nav__link--active' : '')
                    }
                    href={href}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="site-nav__link-label">{label}</span>
                    {activeIndex === index ? (
                      <Motion.span
                        layoutId="nav-indicator"
                        className="site-nav__indicator"
                        aria-hidden
                        transition={indicatorTransition}
                      />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </LayoutGroup>
        </nav>

        <a className="site-nav__login" href="#login">
          <span className="site-nav__login-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M6 19c0-3.314 2.686-6 6-6s6 2.686 6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="site-nav__login-text">Log In</span>
        </a>
      </div>
    </header>
  )
}

export default Navbar
