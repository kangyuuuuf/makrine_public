import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import App from './App.jsx'
import { ThemeProvider } from './providers/theme/ThemeProvider.jsx'
import { FontProvider } from './providers/typography/FontProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <FontProvider>
        <App />
      </FontProvider>
    </ThemeProvider>
  </StrictMode>,
)
