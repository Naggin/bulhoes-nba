import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Check, MessageCircle, Ruler, ShoppingBag, Users, X } from 'lucide-react'
import type { Product } from '../../types'
import { PRODUCTS } from '../../data/products'
import { teamOf } from '../../data/teams'
import { SIZE_CHART_NBA, sizesFor, waLink } from '../../lib/config'
import { brl } from '../../lib/format'
import { useCart } from '../../store/cart'
import { catLabel, plural, teamAccent } from './filters'
import { ProductImage } from './ProductImage'
import { Lightbox } from './Lightbox'

interface Props {
  /** undefined → referência inexistente */
  product: Product | undefined
  id: string
  /** query string com os filtros ativos (volta pra grade preservando) */
  search: string
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

const whatsMessage = (p: Product, size: string, custom: string) =>
  [
    'Olá, Bulhões Sports! Quero este modelo:',
    `${p.nome} (Ref. ${p.id})`,
    `Tamanho: ${size}`,
    `Personalização: ${custom || 'sem personalização'}`,
    `Valor: ${brl(p.preco)}`,
  ].join('\n')

export function ProductModal({ product, id, search }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [size, setSize] = useState('')
  const [custom, setCustom] = useState('')
  const [chart, setChart] = useState(false)
  const [added, setAdded] = useState(false)
  const add = useCart(s => s.add)
  const setOpen = useCart(s => s.setOpen)

  const from = (location.state as { from?: string } | null)?.from
  const close = () => {
    if (from) navigate(-1)
    else navigate({ pathname: '/catalogo', search }, { replace: true })
  }

  // foco, Esc e trava de scroll do fundo
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      prev?.focus()
    }
  }, [])

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') { close(); return }
    if (e.key !== 'Tab' || !panelRef.current) return
    const els = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (els.length === 0) return
    const first = els[0], last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }

  const team = product ? teamOf(product.time) : null
  const related = useMemo(() => {
    if (!product) return []
    const same = PRODUCTS.filter(p => p.time === product.time && p.id !== product.id)
    return [...same.filter(p => p.cat === product.cat), ...same.filter(p => p.cat !== product.cat)].slice(0, 6)
  }, [product])

  const cleanCustom = custom.trim().toUpperCase().replace(/\s+/g, ' ')

  const onAdd = () => {
    if (!product || !size) return
    add({ id: product.id, size, custom: cleanCustom || undefined })
    setAdded(true)
    window.setTimeout(() => setOpen(true), 350)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/80 backdrop-blur-sm md:items-center md:p-6"
      onMouseDown={e => { if (e.target === e.currentTarget) close() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="produto-titulo"
        onKeyDown={onKeyDown}
        style={team ? ({ '--team': team.primary, '--team-2': team.secondary } as CSSProperties) : undefined}
        className="relative flex h-dvh w-full flex-col overflow-y-auto bg-ink-900 shadow-2xl md:h-auto md:max-h-[92dvh] md:max-w-5xl md:rounded-3xl md:border md:border-ink-700 motion-safe:animate-[modal-in_.25s_ease-out]"
      >
        <style>{`@keyframes modal-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fechar e voltar ao catálogo"
          className="absolute right-3 top-3 z-20 flex size-11 items-center justify-center rounded-full bg-ink-950/70 text-ink-100 backdrop-blur transition hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-court"
        >
          <X size={22} />
        </button>

        {!product || !team ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
            <p className="font-display text-4xl font-bold uppercase">Modelo não encontrado</p>
            <p className="text-ink-400">A referência <span className="font-mono text-ink-100">{id}</span> não existe no catálogo.</p>
            <Link to={{ pathname: '/catalogo', search }} replace className="btn-primary mt-4">Ver catálogo</Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
              {/* foto */}
              <div className="relative md:sticky md:top-0 md:self-start">
                <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-1.5 bg-(--team)" />
                <ProductImage id={product.id} alt={product.nome} abbr={team.abbr} eager className="md:rounded-tl-3xl md:rounded-bl-3xl" />
                <span
                  className="absolute left-4 top-4 rounded-lg px-2.5 py-1 font-display text-lg font-black tracking-wide shadow"
                  style={{ background: team.primary, color: team.onPrimary }}
                >
                  {team.abbr}
                </span>
              </div>

              {/* detalhes */}
              <div className="flex flex-col px-5 pb-28 pt-5 sm:px-7 md:pb-7 md:pt-7">
                <p className="mb-1 flex flex-wrap items-center gap-x-2 text-xs font-bold uppercase tracking-[.16em]">
                  <Link to={`/time/${team.abbr}`} style={{ color: teamAccent(team.primary, team.secondary) }} className="hover:underline">
                    {team.name}
                  </Link>
                  <span aria-hidden className="text-ink-700">•</span>
                  <span className="text-ink-400">{catLabel(product.cat)}</span>
                </p>
                <h2 id="produto-titulo" className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">
                  {product.nome}
                </h2>
                <p className="mt-2 text-xs text-ink-400">Ref. <span className="font-mono text-ink-100">{product.id}</span></p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className={`font-display text-4xl font-black ${product.preco == null ? 'text-ink-400' : 'text-court'}`}>{brl(product.preco)}</p>
                  {product.preco == null
                    ? <p className="text-xs text-ink-400">Valor confirmado no WhatsApp</p>
                    : <p className="text-xs text-ink-400">à vista · envio para todo o Brasil</p>}
                </div>

                {product.jogadores > 1 && (
                  <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-ink-800 px-2.5 py-1.5 text-xs font-semibold text-ink-100">
                    <Users size={14} aria-hidden className="text-court" />
                    Disponível com {plural(product.jogadores, 'jogador', 'jogadores')} diferentes
                  </p>
                )}

                {/* tamanho */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold">
                      Tamanho{size && <span className="ml-1.5 font-semibold text-ink-400">· {size}</span>}
                    </p>
                    <button type="button" onClick={() => setChart(true)} className="inline-flex items-center gap-1 text-sm font-semibold text-court hover:underline">
                      <Ruler size={14} aria-hidden /> Tabela de medidas
                    </button>
                  </div>
                  <div role="group" aria-label="Escolha o tamanho" className="flex flex-wrap gap-2">
                    {sizesFor(product.tipo).map(s => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={size === s}
                        onClick={() => setSize(s)}
                        className="chip min-h-11 min-w-12 justify-center px-3"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* personalização */}
                <div className="mt-5">
                  <label htmlFor="custom" className="mb-2 block text-sm font-bold">
                    Jogador e número <span className="font-normal text-ink-400">(opcional)</span>
                  </label>
                  <input
                    id="custom"
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    placeholder="Ex.: JAMES 23"
                    maxLength={24}
                    autoComplete="off"
                    className="h-12 w-full rounded-xl border border-ink-700 bg-ink-950 px-4 font-display text-xl font-bold uppercase tracking-wider text-ink-100 placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-400 focus:border-court focus:outline-none focus:ring-2 focus:ring-court/40"
                  />
                  <p className="mt-1.5 text-xs text-ink-400">Nome e número aplicados em bordado/termo colante. Deixe em branco para sem personalização.</p>
                </div>

                {/* ações */}
                <div className="fixed inset-x-0 bottom-0 z-10 border-t border-ink-800 bg-ink-900/95 px-5 py-3 backdrop-blur md:static md:mt-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
                  {!size && <p id="size-hint" className="mb-2 text-xs font-semibold text-court">Escolha um tamanho para continuar</p>}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={onAdd}
                      disabled={!size}
                      aria-describedby={size ? undefined : 'size-hint'}
                      className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {added ? <Check size={18} aria-hidden /> : <ShoppingBag size={18} aria-hidden />}
                      <span className="sm:hidden">{added ? 'Adicionado!' : 'Carrinho'}</span>
                      <span className="hidden sm:inline">{added ? 'Adicionado!' : 'Adicionar ao carrinho'}</span>
                    </button>
                    {size ? (
                      <a
                        href={waLink(whatsMessage(product, size, cleanCustom))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whats"
                      >
                        <MessageCircle size={18} aria-hidden /> <span className="sm:hidden">WhatsApp</span><span className="hidden sm:inline">Pedir no WhatsApp</span>
                      </a>
                    ) : (
                      <button type="button" disabled aria-describedby="size-hint" className="btn-whats cursor-not-allowed opacity-40">
                        <MessageCircle size={18} aria-hidden /> <span className="sm:hidden">WhatsApp</span><span className="hidden sm:inline">Pedir no WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* relacionados */}
            {related.length > 0 && (
              <section className="border-t border-ink-800 px-5 py-6 sm:px-7" aria-labelledby="mais-do-time">
                <div className="mb-3 flex items-end justify-between">
                  <h3 id="mais-do-time" className="font-display text-2xl font-bold uppercase">
                    Mais do <span style={{ color: teamAccent(team.primary, team.secondary) }}>{team.short}</span>
                  </h3>
                  <Link to={`/time/${team.abbr}`} className="text-sm font-semibold text-court hover:underline">Ver todos</Link>
                </div>
                <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-7 sm:px-7 [&::-webkit-scrollbar]:hidden">
                  {related.map(r => (
                    <li key={r.id} className="w-36 shrink-0 sm:w-40">
                      <Link
                        to={{ pathname: `/produto/${r.id}`, search }}
                        replace
                        state={location.state}
                        onClick={() => panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-court"
                      >
                        <ProductImage id={r.id} alt={r.nome} abbr={team.abbr} className="rounded-xl transition group-hover:brightness-110" />
                        <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-ink-100 group-hover:text-court">{r.nome}</p>
                        <p className="text-xs font-bold text-ink-400">{brl(r.preco)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>

      {chart && (
        <Lightbox
          src={SIZE_CHART_NBA}
          alt="Tabela de medidas das regatas NBA, com largura e comprimento por tamanho"
          title="Tabela de medidas · Regatas NBA"
          onClose={() => setChart(false)}
        />
      )}
    </div>
  )
}
