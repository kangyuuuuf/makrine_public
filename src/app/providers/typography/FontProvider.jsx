import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { applyFontVariables, fontPresets } from './fontManager'
import { loadGoogleFonts } from './googleFontsLoader'

const FontContext = createContext(null)
const STORAGE_KEY = 'makrine-font-preset'

export function FontProvider({ children }) {
  const [fontPresetName, setFontPresetName] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'englishDefault',
  )

  useEffect(() => {
    const preset = fontPresets[fontPresetName] || fontPresets.englishDefault
    loadGoogleFonts(preset.googleFonts)
    applyFontVariables(preset)
    localStorage.setItem(STORAGE_KEY, fontPresetName)
  }, [fontPresetName])

  const value = useMemo(
    () => ({
      fontPresetName,
      setFontPresetName,
      fontPreset: fontPresets[fontPresetName] || fontPresets.englishDefault,
      fontPresetNames: Object.keys(fontPresets),
      toggleFontPreset: () =>
        setFontPresetName((prev) =>
          prev === 'englishDefault' ? 'englishCompact' : 'englishDefault',
        ),
    }),
    [fontPresetName],
  )

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>
}

export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) throw new Error('useFont must be used within FontProvider')
  return context
}
