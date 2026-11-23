import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Le site est intégralement en français : une langue mal déclarée pousse Chrome
// à traduire la page automatiquement, ce qui réécrit le DOM et casse le rendu React.
document.documentElement.lang = 'fr'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
