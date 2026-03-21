import { useTheme } from '../../app/providers/theme/ThemeProvider.jsx'
import { useFont } from '../../app/providers/typography/FontProvider.jsx'
import CompanyNameHero from '../../components/CompanyNameHero/CompanyNameHero.jsx'
import './Home.css'

function HomePage() {
  const { themeName, toggleTheme, theme } = useTheme()
  const { fontPresetName, toggleFontPreset, fontPreset } = useFont()
  const primaryScale = Object.entries(theme.primary)
  const fontSemantic = Object.entries(fontPreset.semantic)

  return (
    <main className="app-shell" id="home">
      <CompanyNameHero />

      <header className="topbar">
        <div>
          <h2 className="topbar-heading">Theme &amp; typography</h2>
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

      <div id="about" className="page-anchor" aria-hidden="true" />

      <section className="panel" id="life-saving">
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

      <section className="panel" id="fire-fighting">
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

      <section className="panel" id="news">
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

      <div id="contact" className="page-anchor" aria-hidden="true" />
      <div id="login" className="page-anchor" aria-hidden="true" />
    </main>
  )
}

export default HomePage
