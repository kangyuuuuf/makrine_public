import { Link } from 'react-router-dom'
import { buildShopUrl, NAVBAR_SECTIONS } from '../../data/navCatalogConfig.js'
import './MegaMenuDropdown.css'

/**
 * Merged mega menu for the single `Product` navbar item.
 * Includes both Life Saving and Fire Fighting sections with explicit titles.
 */
export default function ProductMegaMenuDropdown() {
  return (
    <div className="mega-menu__panel" role="region" aria-label="Product categories">
      <div className="mega-menu__panel-inner">
        <div className="mega-menu__sections">
          {NAVBAR_SECTIONS.map((section) => (
            <section key={section.id} className="mega-menu__section">
              <header className="mega-menu__section-head">
                <Link className="mega-menu__section-title" to={buildShopUrl(section.division)}>
                  {section.label}
                </Link>
              </header>

              <div className="mega-menu__grid mega-menu__grid--section">
                {section.groups.map((group) => {
                  const hasChildren = group.children && group.children.length > 0

                  if (!hasChildren) {
                    return (
                      <div key={group.id} className="mega-menu__column mega-menu__column--single">
                        <Link
                          className="mega-menu__group-title mega-menu__group-title--link"
                          to={buildShopUrl(section.division, group.id)}
                        >
                          {group.label}
                        </Link>
                      </div>
                    )
                  }

                  return (
                    <div key={group.id} className="mega-menu__column">
                      <Link
                        className="mega-menu__group-title mega-menu__group-title--heading-link"
                        to={buildShopUrl(section.division, undefined, { group: group.id })}
                      >
                        {group.label}
                      </Link>
                      <ul className="mega-menu__list">
                        {group.children.map((item) => (
                          <li key={item.id}>
                            <Link className="mega-menu__link" to={buildShopUrl(section.division, item.id)}>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
