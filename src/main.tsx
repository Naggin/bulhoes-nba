import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

/** Em hospedagens estáticas sem fallback de rota, build com VITE_ROUTER=hash. */
const useHash = import.meta.env.VITE_ROUTER === 'hash'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {useHash ? (
      <HashRouter><App /></HashRouter>
    ) : (
      <BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter>
    )}
  </StrictMode>,
)
