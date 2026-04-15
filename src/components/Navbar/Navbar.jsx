import { LayoutGroup, motion as Motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../../assets/icon.png'
import ProductMegaMenuDropdown from './MegaMenuDropdown.jsx'
import './Navbar.css'

/** @typedef {{ to?: string; href?: string; label: string }} NavItem */

/** @type {NavItem[]} */
const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/product', label: 'Product' },
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
 */
function getNavActiveIndex(pathname, hash) {
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
  if (path === '/product' || path === '/shop') {
    return NAV_ITEMS.findIndex((item) => item.to === '/product')
  }
  if (path.startsWith('/catalog/') || path.startsWith('/product/') || path.startsWith('/shop/')) {
    return NAV_ITEMS.findIndex((item) => item.to === '/product')
  }

  const normalizedHash = hash && hash.length > 0 ? hash : '#home'
  const hashIdx = NAV_ITEMS.findIndex((item) => item.href === normalizedHash)
  return hashIdx >= 0 ? hashIdx : 0
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
              {NAV_ITEMS.map((item, index) => {
                const className =
                  'site-nav__link' + (activeIndex === index ? ' site-nav__link--active' : '')

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

                if (item.to === '/product') {
                  return (
                    <li key={key} className="site-nav__links-item mega-menu">
                      <Link className={className} to={item.to}>
                        {content}
                      </Link>
                      <ProductMegaMenuDropdown />
                    </li>
                  )
                }

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

      </div>
    </header>
  )
}

export default Navbar
