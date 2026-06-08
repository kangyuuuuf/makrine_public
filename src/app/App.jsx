import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './ScrollToTop.jsx'
import { Analytics } from '@vercel/analytics/next';
import Navbar from '../components/Navbar/Navbar.jsx'
import HomePage from '../pages/Home/index.jsx'
import AboutPage from '../pages/About/AboutPage.jsx'
import ContactPage from '../pages/Contact/ContactPage.jsx'
import CatalogPage from '../pages/Catalog/CatalogPage.jsx'
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage.jsx'
import FooterSection from '../components/FooterSection/FooterSection.jsx'
import { DIVISION_SLUGS } from '../data/catalogConfig.js'
function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Analytics />
      <div className="site-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/catalog"
            element={<Navigate to={`/catalog/${DIVISION_SLUGS.LIFE_SAVING}`} replace />}
          />
          <Route path="/product" element={<CatalogPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/catalog/:division" element={<CatalogPage />} />
        </Routes>
        <FooterSection />
      </div>
    </BrowserRouter>
  )
}

export default App
