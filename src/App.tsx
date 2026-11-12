import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CartFab } from './components/layout/CartFab'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { CartDrawer } from './components/cart/CartDrawer'
import { CartToast } from './components/cart/CartToast'

/**
 * Rotas:
 *  /                 → Home (hero, times, destaques)
 *  /catalogo         → grade completa com filtros (?time=...&cat=...&q=...)
 *  /time/:abbr       → mesma grade, pré-filtrada pelo time (sigla, ex.: LAL)
 *  /produto/:id      → abre o produto em modal sobre a grade (Catalog lida com isso)
 */
export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-court focus:px-4 focus:py-2 focus:font-bold focus:text-ink-950"
      >
        Pular para o conteúdo
      </a>
      <ScrollToTop />
      <Header />
      <div id="conteudo" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/time/:abbr" element={<Catalog />} />
          <Route path="/produto/:id" element={<Catalog />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
      <CartDrawer />
      <CartToast />
      <CartFab />
    </div>
  )
}
