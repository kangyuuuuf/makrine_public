import { LayoutGroup, motion as Motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../../assets/icon.png'
import { buildShopUrl, NAVBAR_SECTIONS } from '../../data/navCatalogConfig.js'
import MegaMenuDropdown from './MegaMenuDropdown.jsx'
import './Navbar.css'

/** @typedef {{ to?: string; href?: string; label: string; kind?: 'mega'; section?: import('../../data/navCatalogConfig.js').NavbarSection }} NavItem */

/** @type {NavItem[]} */
const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  ...NAVBAR_SECTIONS.map((section) => ({ kind: /** @type {'mega'} */ ('mega'), section, label: section.label })),
  { to: '/contact', label: 'Contact' },
]

/**
 * Path as seen by `<Route path>`, even when `location.pathname` still includes Vite `base`
 * or a trailing slash.
 * @param {string} pathname
 */
function normalizeAppPathname(pathname) {
  const rawBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  let p = pathname
  if (rawBase && rawBase !== '/' && p.startsWith(rawBase)) {
    const rest = p.slice(rawBase.length) || '/'
    p = rest.startsWith('/') ? rest : `/${rest}`
  }
  const trimmed = p.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

/**
 * @param {string} pathname
 * @param {string} hash
 * @param {string} search
 */
function getNavActiveIndex(pathname, hash, search) {
  const path = normalizeAppPathname(pathname)
  if (path === '/') {
    return NAV_ITEMS.findIndex((item) => item.to === '/')
  }
  if (path === '/about') {
    return NAV_ITEMS.findIndex((item) => item.to === '/about')
  }
  if (path === '/contact') {
    return NAV_ITEMS.findIndex((item) => item.to === '/contact')
  }
  if (path === '/shop') {
    const div = new URLSearchParams(search).get('division')
    if (div) {
      const idx = NAV_ITEMS.findIndex(
        (item) => item.kind === 'mega' && item.section?.division === div,
      )
      if (idx >= 0) return idx
    }
  }
  const megaCatalogIdx = NAV_ITEMS.findIndex(
    (item) => item.kind === 'mega' && path === `/catalog/${item.section?.division}`,
  )
  if (megaCatalogIdx >= 0) return megaCatalogIdx

  const normalizedHash = hash && hash.length > 0 ? hash : '#home'
  const hashIdx = NAV_ITEMS.findIndex((item) => item.href === normalizedHash)
  return hashIdx >= 0 ? hashIdx : 0
}

function Navbar() {
  const { pathname, hash, search } = useLocation()
  const activeIndex = getNavActiveIndex(pathname, hash, search)
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
              {NAV_ITEMS.map((item, index) => {
                const className =
                  'site-nav__link' + (activeIndex === index ? ' site-nav__link--active' : '')

                if (item.kind === 'mega' && item.section) {
                  const { section } = item
                  return (
                    <li key={section.id} className="site-nav__links-item mega-menu">
                      <Link className={className} to={buildShopUrl(section.division)}>
                        <>
                          <span className="site-nav__link-label">{section.label}</span>
                          {activeIndex === index ? (
                            <Motion.span
                              layoutId="nav-indicator"
                              className="site-nav__indicator"
                              aria-hidden
                              transition={indicatorTransition}
                            />
                          ) : null}
                        </>
                      </Link>
                      <MegaMenuDropdown section={section} />
                    </li>
                  )
                }

                const key = item.to ?? item.href ?? item.label
                const content = (
                  <>
                    <span className="site-nav__link-label">{item.label}</span>
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
                  <li key={key} className="site-nav__links-item">
                    {item.to ? (
                      <Link className={className} to={item.to}>
                        {content}
                      </Link>
                    ) : (
                      <a className={className} href={item.href}>
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
