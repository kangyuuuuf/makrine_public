import { Link } from 'react-router-dom'
import {
  buildShopUrl,
  getSubcategoryIdForNavGroup,
  NAVBAR_SECTIONS,
} from '../../data/navCatalogConfig.js'
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
                  const subcategoryId = getSubcategoryIdForNavGroup(group.id)
                  const groupFilterUrl = buildShopUrl(
                    section.division,
                    subcategoryId ?? group.id,
                  )

                  return (
                    <div key={group.id} className="mega-menu__column">
                      <Link className="mega-menu__column-link" to={groupFilterUrl}>
                        <span className="mega-menu__group-title mega-menu__group-title--in-link">
                          {group.label}
                        </span>
                        {hasChildren ? (
                          <ul className="mega-menu__list">
                            {group.children.map((item) => (
                              <li key={item.id}>
                                <span className="mega-menu__sublabel">{item.label}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </Link>
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
