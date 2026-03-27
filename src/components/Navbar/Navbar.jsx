import { LayoutGroup, motion as Motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../../assets/icon.png'
import './Navbar.css'

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Life Saving Equipment', to: '/catalog/life-saving' },
  { label: 'Fire Fighting Equipment', to: '/catalog/fire-fighting' },
  { label: 'News', href: '#news' },
  { label: 'Contact', href: '#contact' },
]

function getNavActiveIndex(pathname, hash) {
  if (pathname === '/about') {
    return NAV_ITEMS.findIndex((item) => item.to === '/about')
  }
  const catalogIdx = NAV_ITEMS.findIndex((item) => item.to === pathname)
  if (catalogIdx >= 0) {
    return catalogIdx
  }
  const normalizedHash = hash && hash.length > 0 ? hash : '#home'
  const index = NAV_ITEMS.findIndex((item) => item.href === normalizedHash)
  return index >= 0 ? index : 0
}

function Navbar() {
  const { pathname, hash } = useLocation()
  const activeIndex = getNavActiveIndex(pathname, hash)
  const prefersReducedMotion = useReducedMotion()

  const indicatorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }

  return (
    <header className="site-nav" role="banner">
      <div className="site-nav__inner">
        <Link className="site-nav__brand" to="/">
          <img
            className="site-nav__logo"
            src={logoImg}
            alt="Makrine"
            decoding="async"
          />
        </Link>

        <nav className="site-nav__actions" aria-label="Main navigation">
          <LayoutGroup id="main-nav">
            <ul className="site-nav__links">
              {NAV_ITEMS.map(({ label, href, to }, index) => {
                const className =
                  'site-nav__link' + (activeIndex === index ? ' site-nav__link--active' : '')
                const content = (
                  <>
                    <span className="site-nav__link-label">{label}</span>
                    {activeIndex === index ? (
                      <Motion.span
                        layoutId="nav-indicator"
                        className="site-nav__indicator"
                        aria-hidden
                        transition={indicatorTransition}
                      />
                    ) : null}
                  </>
                )
                return (
                  <li key={to ?? href} className="site-nav__links-item">
                    {to ? (
                      <Link className={className} to={to}>
                        {content}
                      </Link>
                    ) : (
                      <a className={className} href={href}>
                        {content}
                      </a>
                    )}
                  </li>
                )
              })}
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
