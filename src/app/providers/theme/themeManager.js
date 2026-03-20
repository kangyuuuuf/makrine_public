const hexToRgb = (hex) => {
  const cleaned = hex.replace('#', '')
  const normalized =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned
  const value = Number.parseInt(normalized, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

const rgbToHex = ({ r, g, b }) => {
  const toHex = (value) => value.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)))

const mix = (base, target, ratio) => ({
  r: clamp(base.r + (target.r - base.r) * ratio),
  g: clamp(base.g + (target.g - base.g) * ratio),
  b: clamp(base.b + (target.b - base.b) * ratio),
})

const buildPrimaryScale = (primaryHex) => {
  const base = hexToRgb(primaryHex)
  const white = { r: 255, g: 255, b: 255 }
  const black = { r: 0, g: 0, b: 0 }

  return {
    50: rgbToHex(mix(base, white, 0.92)),
    100: rgbToHex(mix(base, white, 0.84)),
    200: rgbToHex(mix(base, white, 0.7)),
    300: rgbToHex(mix(base, white, 0.52)),
    400: rgbToHex(mix(base, white, 0.3)),
    500: primaryHex,
    600: rgbToHex(mix(base, black, 0.12)),
    700: rgbToHex(mix(base, black, 0.24)),
    800: rgbToHex(mix(base, black, 0.36)),
    900: rgbToHex(mix(base, black, 0.5)),
  }
}

export const createThemeFromPrimary = (primaryHex, mode = 'light') => {
  const primary = buildPrimaryScale(primaryHex)
  const isDark = mode === 'dark'

  return {
    mode,
    primary,
    semantic: isDark
      ? {
          bgPage: '#0B1220',
          bgSurface: '#111A2A',
          bgSoft: '#182437',
          textPrimary: '#E5EDF7',
          textSecondary: '#AAB8CD',
          border: '#24334A',
          focusRing: primary[300],
          success: '#2E8B57',
          warning: '#D97706',
          danger: '#DC2626',
        }
      : {
          bgPage: '#F7FAFD',
          bgSurface: '#FFFFFF',
          bgSoft: '#ECF2F8',
          textPrimary: '#0E1B2E',
          textSecondary: '#3A4A63',
          border: '#D8E1EB',
          focusRing: primary[400],
          success: '#1F8A4C',
          warning: '#B45309',
          danger: '#B91C1C',
        },
  }
}

export const themes = {
  'brand-light': createThemeFromPrimary('#112F57', 'light'),
  'brand-dark': createThemeFromPrimary('#112F57', 'dark'),
}

export const applyThemeVariables = (theme) => {
  const root = document.documentElement
  root.dataset.theme = theme.mode

  Object.entries(theme.primary).forEach(([step, value]) => {
    root.style.setProperty(`--color-primary-${step}`, value)
  })

  Object.entries(theme.semantic).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`
    root.style.setProperty(cssVar, value)
  })
}
