import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, ChevronDown, Truck, MessageCircle } from 'lucide-react'
import { useCart, useCartCount } from '../../store/cart'
import { FRANCHISES } from '../../data/teams'
import { waLink } from '../../lib/config'

const NAV: { label: string; to: string; cat?: string }[] = [
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Retrô', to: '/catalogo?cat=retro', cat: 'retro' },
  { label: 'City Edition', to: '/catalogo?cat=especiais', cat: 'especiais' },
]

const navClass = (active: boolean) =>
  `relative inline-flex h-10 items-center rounded-lg px-3 font-display text-lg font-bold uppercase tracking-wide transition hover:text-court focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court ${
    active ? 'text-court' : 'text-ink-100'
  }`

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const count = useCartCount()
  const setOpen = useCart((s) => s.setOpen)

  const [menu, setMenu] = useState(false)
  const [teams, setTeams] = useState(false)
  const [mobileTeams, setMobileTeams] = useState(false)
  const [search, setSearch] = useState(false)
  const [q, setQ] = useState(params.get('q') ?? '')
  const [bump, setBump] = useState(false)
  const teamsRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const prevCount = useRef(count)

  const currentCat = location.pathname === '/catalogo' ? params.get('cat') : null

  // Ao trocar de rota: sincroniza a busca com a URL e fecha menus (ajuste durante o render, sem efeito)
  const routeKey = location.pathname + location.search
  const [prevRoute, setPrevRoute] = useState(routeKey)
  if (routeKey !== prevRoute) {
    setPrevRoute(routeKey)
    setQ(params.get('q') ?? '')
    setMenu(false)
    setTeams(false)
    setSearch(false)
  }

  // trava scroll com o menu mobile aberto
  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menu])

  // fecha o dropdown de times com clique fora / Esc
  useEffect(() => {
    if (!teams) return
    const onDown = (e: MouseEvent) => {
      if (!teamsRef.current?.contains(e.target as Node)) setTeams(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTeams(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [teams])

  useEffect(() => {
    if (search) mobileInputRef.current?.focus()
  }, [search])

  // "pulo" do badge quando o carrinho cresce
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true)
      const t = window.setTimeout(() => setBump(false), 400)
      prevCount.current = count
      return () => window.clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/catalogo?q=${encodeURIComponent(term)}` : '/catalogo')
    setSearch(false)
    setMenu(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-ink-950/70">
      {/* faixa superior */}
      <div className="hidden border-b border-ink-800/60 bg-ink-900/60 md:block">
        <div className="container-x flex h-8 items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="size-3.5 text-court" aria-hidden="true" />
            Enviamos para todo o Brasil
          </span>
          <span>Personalize com seu jogador e número · Pedido pelo WhatsApp</span>
        </div>
      </div>

      <div className="container-x flex h-16 items-center gap-2 md:h-[4.5rem] md:gap-4">
        {/* menu mobile */}
        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-label={menu ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          className="grid size-11 shrink-0 place-items-center rounded-xl text-ink-100 transition hover:bg-ink-800 md:hidden"
        >
          {menu ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>

        {/* logo */}
        <Link
          to="/"
          aria-label="Bulhões Sports — início"
          className="group flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-court font-display text-xl font-black text-ink-950 transition group-hover:rotate-[-6deg]">
            B
          </span>
          <span className="font-display text-2xl font-black uppercase leading-none tracking-wide md:text-[1.7rem]">
            Bulhões <span className="text-court">Sports</span>
          </span>
          <span className="ml-1 hidden rounded border border-ink-700 px-1.5 py-0.5 text-[10px] font-extrabold tracking-widest text-ink-400 sm:inline">
            NBA
          </span>
        </Link>

        {/* nav desktop */}
        <nav aria-label="Principal" className="ml-2 hidden items-center gap-1 md:flex">
          <NavLink to="/catalogo" end className={({ isActive }) => navClass(isActive && !currentCat)}>
            Catálogo
          </NavLink>

          <div ref={teamsRef} className="relative">
            <button
              type="button"
              onClick={() => setTeams((t) => !t)}
              aria-expanded={teams}
              aria-haspopup="true"
              className={`${navClass(location.pathname.startsWith('/time/'))} gap-1`}
            >
              Times
              <ChevronDown className={`size-4 transition ${teams ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {teams && (
              <div
                className="absolute top-full left-1/2 mt-2 w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-ink-700 bg-ink-900 p-4 shadow-card"
                role="menu"
                aria-label="Times da NBA"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-display text-lg font-black uppercase tracking-wide">Escolha o seu time</p>
                  <Link to="/catalogo" role="menuitem" className="text-xs font-bold text-court hover:underline">
                    Ver todos os produtos
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {FRANCHISES.map((t) => (
                    <Link
                      key={t.abbr}
                      role="menuitem"
                      to={`/time/${t.abbr}`}
                      style={{ '--team': t.primary, '--team-2': t.secondary } as CSSProperties}
                      className="group/t flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-100 transition hover:bg-ink-800"
                    >
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-md bg-(--team) font-display text-[11px] font-black text-white ring-1 ring-white/10 transition group-hover/t:scale-110"
                        aria-hidden="true"
                      >
                        {t.abbr}
                      </span>
                      <span className="truncate">{t.short}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {NAV.filter((n) => n.cat).map((n) => (
            <Link key={n.to} to={n.to} className={navClass(currentCat === n.cat)}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* busca desktop */}
        <form onSubmit={submitSearch} role="search" className="hidden md:block">
          <label className="relative block">
            <span className="sr-only">Buscar produto, time ou jogador</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar time, modelo…"
              className="h-10 w-48 rounded-xl border border-ink-700 bg-ink-900 pr-3 pl-9 text-sm text-ink-100 transition placeholder:text-ink-400 focus:w-64 focus:border-court focus:outline-none lg:w-56 lg:focus:w-80"
            />
          </label>
        </form>

        {/* busca mobile (ícone) */}
        <button
          type="button"
          onClick={() => setSearch((s) => !s)}
          aria-label={search ? 'Fechar busca' : 'Buscar'}
          aria-expanded={search}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-ink-100 transition hover:bg-ink-800 md:hidden"
        >
          {search ? <X className="size-5" aria-hidden="true" /> : <Search className="size-5" aria-hidden="true" />}
        </button>

        {/* carrinho */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}
          className="relative grid size-11 shrink-0 place-items-center rounded-xl text-ink-100 transition hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court md:h-11 md:w-auto md:gap-2 md:px-3"
        >
          <ShoppingBag className="size-6 md:size-5" aria-hidden="true" />
          <span className="hidden font-display text-lg font-bold uppercase tracking-wide md:inline">Carrinho</span>
          {count > 0 && (
            <span
              className={`absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-court px-1 text-[11px] font-extrabold text-ink-950 ring-2 ring-ink-950 md:static md:ml-0.5 md:ring-0 ${
                bump ? 'animate-bounce' : ''
              }`}
            >
              {count}
            </span>
          )}
        </button>
      </div>

      {/* busca mobile expandida */}
      {search && (
        <form onSubmit={submitSearch} role="search" className="container-x border-t border-ink-800 py-2 md:hidden">
          <label className="relative block">
            <span className="sr-only">Buscar produto, time ou jogador</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
            <input
              ref={mobileInputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar time, modelo ou jogador"
              className="h-11 w-full rounded-xl border border-ink-700 bg-ink-900 pr-20 pl-9 text-sm text-ink-100 placeholder:text-ink-400 focus:border-court focus:outline-none"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-1.5 h-8 -translate-y-1/2 rounded-lg bg-court px-3 text-xs font-extrabold text-ink-950"
            >
              Buscar
            </button>
          </label>
        </form>
      )}

      {/* menu mobile */}
      <div
        id="mobile-menu"
        hidden={!menu}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-ink-800 bg-ink-950 md:hidden"
      >
        <nav aria-label="Menu" className="container-x py-4">
          <ul className="divide-y divide-ink-800">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="flex h-14 items-center justify-between font-display text-2xl font-bold uppercase tracking-wide"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setMobileTeams((t) => !t)}
                aria-expanded={mobileTeams}
                className="flex h-14 w-full items-center justify-between font-display text-2xl font-bold uppercase tracking-wide"
              >
                Times
                <ChevronDown className={`size-5 transition ${mobileTeams ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {mobileTeams && (
                <div className="grid grid-cols-2 gap-1.5 pb-4">
                  {FRANCHISES.map((t) => (
                    <Link
                      key={t.abbr}
                      to={`/time/${t.abbr}`}
                      style={{ '--team': t.primary } as CSSProperties}
                      className="flex h-11 items-center gap-2 rounded-lg bg-ink-900 px-2 text-sm font-semibold"
                    >
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-md bg-(--team) font-display text-[11px] font-black text-white ring-1 ring-white/10"
                        aria-hidden="true"
                      >
                        {t.abbr}
                      </span>
                      <span className="truncate">{t.short}</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          <a
            href={waLink('Olá, Bulhões Sports! Quero tirar uma dúvida sobre as regatas NBA.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whats mt-6 w-full"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Falar no WhatsApp
          </a>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">
            <Truck className="size-3.5 text-court" aria-hidden="true" />
            Enviamos para todo o Brasil
          </p>
        </nav>
      </div>
    </header>
  )
}
