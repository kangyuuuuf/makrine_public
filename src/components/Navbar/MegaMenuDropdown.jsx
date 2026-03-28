import { Link } from 'react-router-dom'
import { buildShopUrl } from '../../data/navCatalogConfig.js'
import './MegaMenuDropdown.css'

/**
 * Mega menu: one column per category group; subcategory links navigate to /shop with filters.
 *
 * @param {Object} props
 * @param {import('../../data/navCatalogConfig.js').NavbarSection} props.section
 */
export default function MegaMenuDropdown({ section }) {
  return (
    <div
      className="mega-menu__panel"
      role="region"
      aria-label={`${section.label} categories`}
    >
      <div className="mega-menu__panel-inner">
        <div className="mega-menu__grid">
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
      </div>
    </div>
  )
}
