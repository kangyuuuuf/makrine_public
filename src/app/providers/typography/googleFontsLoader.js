const PRECONNECT_FONT_API_ID = 'gf-preconnect-api'
const PRECONNECT_FONT_STATIC_ID = 'gf-preconnect-static'
const STYLESHEET_ID = 'gf-dynamic-fonts'

const toFamilyQuery = ({ family, weights = [400] }) => {
  const familyName = family.trim().replace(/\s+/g, '+')
  const weightQuery = Array.from(new Set(weights))
    .sort((a, b) => a - b)
    .join(';')
  return `family=${familyName}:wght@${weightQuery}`
}

const ensurePreconnect = (id, href) => {
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'preconnect'
  link.href = href
  if (href.includes('gstatic')) link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

export const loadGoogleFonts = (fonts = []) => {
  if (!fonts.length) return

  ensurePreconnect(PRECONNECT_FONT_API_ID, 'https://fonts.googleapis.com')
  ensurePreconnect(PRECONNECT_FONT_STATIC_ID, 'https://fonts.gstatic.com')

  const query = fonts.map(toFamilyQuery).join('&')
  const href = `https://fonts.googleapis.com/css2?${query}&display=swap`

  let sheet = document.getElementById(STYLESHEET_ID)
  if (!sheet) {
    sheet = document.createElement('link')
    sheet.id = STYLESHEET_ID
    sheet.rel = 'stylesheet'
    document.head.appendChild(sheet)
  }

  if (sheet.getAttribute('href') !== href) {
    sheet.setAttribute('href', href)
  }
}
