import { useTheme } from '../../app/providers/theme/ThemeProvider.jsx'
import { useFont } from '../../app/providers/typography/FontProvider.jsx'
import './Home.css'

function HomePage() {
  const { themeName, toggleTheme, theme } = useTheme()
  const { fontPresetName, toggleFontPreset, fontPreset } = useFont()
  const primaryScale = Object.entries(theme.primary)
  const fontSemantic = Object.entries(fontPreset.semantic)

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Makrine Theme Manager</h1>
          <p>Brand primary color is extracted from your image: #112F57</p>
        </div>
        <div className="actions">
          <button className="action" onClick={toggleTheme}>
            Toggle Theme ({themeName})
          </button>
          <button className="action secondary" onClick={toggleFontPreset}>
            Toggle Font ({fontPresetName})
          </button>
        </div>
      </header>

      <section className="panel">
        <h2>Primary color scale (extensible)</h2>
        <div className="swatches">
          {primaryScale.map(([step, color]) => (
            <div key={step} className="swatch">
              <div className="swatch-color" style={{ background: color }} />
              <div className="swatch-meta">
                <strong>{step}</strong>
                <span>{color}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Semantic color tokens</h2>
        <div className="semantic-grid">
          {Object.entries(theme.semantic).map(([key, value]) => (
            <div key={key} className="semantic-item">
              <span>{key}</span>
              <code>{value}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Typography tokens</h2>
        <div className="semantic-grid">
          {fontSemantic.map(([key, value]) => (
            <div key={key} className="semantic-item">
              <span>{key}</span>
              <code>
                {value.fontFamily}/{value.fontSize}/{value.lineHeight}/
                {value.fontWeight}
              </code>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
