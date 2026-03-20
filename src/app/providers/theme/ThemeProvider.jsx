import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { applyThemeVariables, themes } from './themeManager'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'makrine-theme'

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'brand-light',
  )

  useEffect(() => {
    const nextTheme = themes[themeName] || themes['brand-light']
    applyThemeVariables(nextTheme)
    localStorage.setItem(STORAGE_KEY, themeName)
  }, [themeName])

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme: themes[themeName] || themes['brand-light'],
      themeNames: Object.keys(themes),
      toggleTheme: () =>
        setThemeName((prev) =>
          prev === 'brand-light' ? 'brand-dark' : 'brand-light',
        ),
    }),
    [themeName],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
