const toCssVarName = (name) =>
  `--${name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`

export const fontPresets = {
  englishDefault: {
    googleFonts: [
      { family: 'Inter', weights: [400, 500, 600, 700] },
      { family: 'Merriweather', weights: [400, 700] },
      { family: 'JetBrains Mono', weights: [400, 500] },
    ],
    family: {
      sans: 'Inter, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: '"Merriweather", Georgia, "Times New Roman", serif',
      mono: '"JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, monospace',
    },
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.65,
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    semantic: {
      display: {
        fontFamily: 'sans',
        fontSize: '3xl',
        lineHeight: 'tight',
        fontWeight: 'bold',
      },
      h1: {
        fontFamily: 'sans',
        fontSize: '2xl',
        lineHeight: 'tight',
        fontWeight: 'semibold',
      },
      h2: {
        fontFamily: 'sans',
        fontSize: 'xl',
        lineHeight: 'normal',
        fontWeight: 'semibold',
      },
      body: {
        fontFamily: 'sans',
        fontSize: 'md',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
      bodySm: {
        fontFamily: 'sans',
        fontSize: 'sm',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
      code: {
        fontFamily: 'mono',
        fontSize: 'sm',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
      button: {
        fontFamily: 'sans',
        fontSize: 'md',
        lineHeight: 'normal',
        fontWeight: 'medium',
      },
      caption: {
        fontFamily: 'sans',
        fontSize: 'xs',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
    },
  },
  englishCompact: {
    googleFonts: [
      { family: 'IBM Plex Sans', weights: [400, 500, 600, 700] },
      { family: 'Merriweather', weights: [400, 700] },
      { family: 'JetBrains Mono', weights: [400, 500] },
    ],
    family: {
      sans: '"IBM Plex Sans", Inter, "Segoe UI", Roboto, Arial, sans-serif',
      serif: '"Merriweather", Georgia, "Times New Roman", serif',
      mono: '"JetBrains Mono", Consolas, monospace',
    },
    size: {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '17px',
      xl: '19px',
      '2xl': '22px',
      '3xl': '28px',
    },
    lineHeight: {
      tight: 1.18,
      normal: 1.42,
      relaxed: 1.55,
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    semantic: {
      display: {
        fontFamily: 'sans',
        fontSize: '3xl',
        lineHeight: 'tight',
        fontWeight: 'bold',
      },
      h1: {
        fontFamily: 'sans',
        fontSize: '2xl',
        lineHeight: 'tight',
        fontWeight: 'semibold',
      },
      h2: {
        fontFamily: 'sans',
        fontSize: 'xl',
        lineHeight: 'normal',
        fontWeight: 'semibold',
      },
      body: {
        fontFamily: 'sans',
        fontSize: 'md',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
      bodySm: {
        fontFamily: 'sans',
        fontSize: 'sm',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
      code: {
        fontFamily: 'mono',
        fontSize: 'sm',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
      button: {
        fontFamily: 'sans',
        fontSize: 'md',
        lineHeight: 'normal',
        fontWeight: 'medium',
      },
      caption: {
        fontFamily: 'sans',
        fontSize: 'xs',
        lineHeight: 'normal',
        fontWeight: 'regular',
      },
    },
  },
}

export const applyFontVariables = (preset) => {
  const root = document.documentElement

  Object.entries(preset.family).forEach(([k, v]) => {
    root.style.setProperty(`--font-family-${k}`, v)
  })

  Object.entries(preset.size).forEach(([k, v]) => {
    root.style.setProperty(`--font-size-${k}`, v)
  })

  Object.entries(preset.lineHeight).forEach(([k, v]) => {
    root.style.setProperty(`--line-height-${k}`, String(v))
  })

  Object.entries(preset.weight).forEach(([k, v]) => {
    root.style.setProperty(`--font-weight-${k}`, String(v))
  })

  Object.entries(preset.semantic).forEach(([token, rule]) => {
    const cap = `${token[0].toUpperCase()}${token.slice(1)}`
    root.style.setProperty(
      toCssVarName(`font${cap}Family`),
      `var(--font-family-${rule.fontFamily})`,
    )
    root.style.setProperty(
      toCssVarName(`font${cap}Size`),
      `var(--font-size-${rule.fontSize})`,
    )
    root.style.setProperty(
      toCssVarName(`font${cap}LineHeight`),
      `var(--line-height-${rule.lineHeight})`,
    )
    root.style.setProperty(
      toCssVarName(`font${cap}Weight`),
      `var(--font-weight-${rule.fontWeight})`,
    )
  })
}
