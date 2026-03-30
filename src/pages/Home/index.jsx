import AboutSection from '../../components/AboutSection/AboutSection.jsx'
import HomePhotoStrip from '../../components/HomePhotoStrip/HomePhotoStrip.jsx'
import ValuesSection from '../../components/ValuesSection/ValuesSection.jsx'
import './Home.css'
import CompanyNameHero from '../../components/CompanyNameHero/CompanyNameHero.jsx'

function HomePage() {
  return (
    <main className="app-shell" id="home">
      <CompanyNameHero />
      <AboutSection />

      {/* <HomePhotoStrip /> */}

      <ValuesSection />
    </main>
  )
}

export default HomePage
