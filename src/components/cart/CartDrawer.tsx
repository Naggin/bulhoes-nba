import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { useCart, cartTotals, itemPrice, orderMessage } from '../../store/cart'
import { byId } from '../../data/products'
import { teamOf } from '../../data/teams'
import { imgUrl, waLink } from '../../lib/config'
import { brl } from '../../lib/format'
import type { CartItem } from '../../types'

const CONTACT_KEY = 'bs-nba-contact'

function loadContact(): { nome: string; cidade: string } {
  try {
    const raw = localStorage.getItem(CONTACT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<{ nome: string; cidade: string }>
      return { nome: parsed.nome ?? '', cidade: parsed.cidade ?? '' }
    }
  } catch {
    /* localStorage indisponível — segue sem persistir */
  }
  return { nome: '', cidade: '' }
}

function saveContact(c: { nome: string; cidade: string }) {
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(c))
  } catch {
    /* ignora */
  }
}

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [contact, setContact] = useState(loadContact)
  const [confirmClear, setConfirmClear] = useState(false)
  const [mounted, setMounted] = useState(open)

  const { total, openCount } = cartTotals(items)
  const count = items.reduce((n, it) => n + it.qty, 0)
  const hasPriced = total > 0

  // Ao abrir: monta na hora e zera a confirmação de esvaziar (ajuste durante o render)
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    setConfirmClear(false)
    if (open) setMounted(true)
  }

  // Ao fechar: mantém montado até o fim da animação de saída
  useEffect(() => {
    if (open) return
    const t = window.setTimeout(() => setMounted(false), 260)
    return () => window.clearTimeout(t)
  }, [open])

  // Esc, foco inicial e trava de scroll do body
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevActive = document.activeElement as HTMLElement | null
    const focusT = window.setTimeout(() => closeRef.current?.focus(), 40)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(focusT)
      document.body.style.overflow = prevOverflow
      prevActive?.focus?.()
    }
  }, [open, setOpen])

  // Reset da confirmação de esvaziar
  useEffect(() => {
    if (!confirmClear) return
    const t = window.setTimeout(() => setConfirmClear(false), 3500)
    return () => window.clearTimeout(t)
  }, [confirmClear])

  const updateContact = (patch: Partial<typeof contact>) => {
    setContact((c) => {
      const next = { ...c, ...patch }
      saveContact(next)
      return next
    })
  }

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clear()
    setConfirmClear(false)
  }

  if (!mounted) return null

  const message = orderMessage(items, contact)

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* overlay */}
      <button
        type="button"
        aria-label="Fechar carrinho"
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* painel: bottom sheet no mobile, gaveta à direita no desktop */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={[
          'absolute flex flex-col bg-ink-900 text-ink-100 shadow-2xl',
          'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl border-t border-ink-700',
          'sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[440px] sm:max-h-none sm:rounded-none sm:border-t-0 sm:border-l',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full',
        ].join(' ')}
      >
        {/* alça do bottom sheet */}
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-ink-700 sm:hidden" aria-hidden="true" />

        {/* cabeçalho */}
        <header className="flex items-center justify-between gap-3 border-b border-ink-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-court/15 text-court">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="cart-title" className="font-display text-2xl font-black uppercase leading-none tracking-wide">
                Seu carrinho
              </h2>
              <p className="mt-1 text-xs font-semibold text-ink-400">
                {count === 0 ? 'Nenhum item ainda' : `${count} ${count === 1 ? 'item' : 'itens'}`}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar carrinho"
            className="grid size-11 place-items-center rounded-xl text-ink-400 transition hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <EmptyState onClose={() => setOpen(false)} />
        ) : (
          <>
            {/* lista */}
            <ul className="flex-1 divide-y divide-ink-800 overflow-y-auto overscroll-contain px-5">
              {items.map((it, i) => (
                <CartLine
                  key={`${it.id}-${it.size}-${it.custom ?? ''}-${it.manga ?? ''}`}
                  item={it}
                  onQty={(q) => setQty(i, q)}
                  onRemove={() => remove(i)}
                  onClose={() => setOpen(false)}
                />
              ))}
            </ul>

            {/* rodapé */}
            <div className="border-t border-ink-800 bg-ink-900 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              {openCount > 0 && (
                <p className="mb-3 flex items-start gap-2 rounded-xl border border-court/30 bg-court/10 px-3 py-2 text-xs font-semibold text-court">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    {openCount} {openCount === 1 ? 'item com preço' : 'itens com preço'} sob consulta. Confirmamos o valor
                    pelo WhatsApp.
                  </span>
                </p>
              )}

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-ink-400">Subtotal</span>
                <span className="font-display text-3xl font-black tracking-wide">
                  {hasPriced ? brl(total) : openCount > 0 ? 'Sob consulta' : brl(0)}
                  {hasPriced && openCount > 0 && <span className="ml-1 text-sm font-bold text-ink-400">+ consulta</span>}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="sr-only">Seu nome (opcional)</span>
                  <input
                    type="text"
                    name="nome"
                    autoComplete="name"
                    placeholder="Seu nome (opcional)"
                    value={contact.nome}
                    onChange={(e) => updateContact({ nome: e.target.value })}
                    className="h-11 w-full rounded-xl border border-ink-700 bg-ink-950 px-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-court focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Sua cidade (opcional)</span>
                  <input
                    type="text"
                    name="cidade"
                    autoComplete="address-level2"
                    placeholder="Cidade / UF (opcional)"
                    value={contact.cidade}
                    onChange={(e) => updateContact({ cidade: e.target.value })}
                    className="h-11 w-full rounded-xl border border-ink-700 bg-ink-950 px-3 text-sm text-ink-100 placeholder:text-ink-400 focus:border-court focus:outline-none"
                  />
                </label>
              </div>

              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whats mt-3 w-full text-base"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Enviar pedido no WhatsApp
              </a>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] text-ink-400">Sem pagamento online: você fecha com a loja no WhatsApp.</p>
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label={confirmClear ? 'Confirmar: esvaziar carrinho' : 'Esvaziar carrinho'}
                  className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court ${
                    confirmClear ? 'bg-nba-red text-white' : 'text-ink-400 hover:bg-ink-800 hover:text-ink-100'
                  }`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  {confirmClear ? 'Confirmar?' : 'Esvaziar'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CartLine({
  item,
  onQty,
  onRemove,
  onClose,
}: {
  item: CartItem
  onQty: (q: number) => void
  onRemove: () => void
  onClose: () => void
}) {
  const p = byId(item.id)
  const team = teamOf(p?.time ?? '')
  const price = itemPrice(item)
  const style = { '--team': team.primary, '--team-2': team.secondary } as CSSProperties

  return (
    <li className="flex gap-3 py-4" style={style}>
      <Link
        to={`/produto/${item.id}`}
        onClick={onClose}
        className="relative block size-24 shrink-0 overflow-hidden rounded-xl bg-ink-800 ring-1 ring-ink-700"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-(--team)" aria-hidden="true" />
        <img
          src={imgUrl(item.id)}
          alt={p?.nome ?? item.id}
          loading="lazy"
          className="size-full object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
              <span className="text-(--team-2) brightness-125">{team.abbr}</span> · Ref. {item.id}
            </p>
            <Link to={`/produto/${item.id}`} onClick={onClose} className="line-clamp-2 text-sm font-bold leading-snug hover:text-court">
              {p?.nome ?? item.id}
            </Link>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${p?.nome ?? item.id} do carrinho`}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-nba-red focus-visible:outline-2 focus-visible:outline-court"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-400">
          <span>
            Tam. <b className="text-ink-100">{item.size}</b>
          </span>
          {item.manga && (
            <span>
              Manga <b className="text-ink-100">{item.manga}</b>
            </span>
          )}
          {item.custom && (
            <span>
              Personalização <b className="font-display text-sm uppercase tracking-wide text-court">{item.custom}</b>
            </span>
          )}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex items-center rounded-lg border border-ink-700 bg-ink-950" role="group" aria-label="Quantidade">
            <button
              type="button"
              onClick={() => onQty(item.qty - 1)}
              aria-label={item.qty === 1 ? 'Remover item' : 'Diminuir quantidade'}
              className="grid size-9 place-items-center text-ink-400 transition hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-court"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => onQty(item.qty + 1)}
              aria-label="Aumentar quantidade"
              className="grid size-9 place-items-center text-ink-400 transition hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-court"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <span className="font-display text-xl font-black tracking-wide">
            {price == null ? <span className="text-sm font-bold text-court">Sob consulta</span> : brl(price * item.qty)}
          </span>
        </div>
      </div>
    </li>
  )
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-14 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-ink-800 text-ink-400">
        <ShoppingBag className="size-9" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-3xl font-black uppercase tracking-wide">Carrinho vazio</h3>
      <p className="mt-2 max-w-xs text-sm text-ink-400">
        Escolha a regata do seu time, personalize com o jogador e o número, e feche o pedido pelo WhatsApp.
      </p>
      <Link to="/catalogo" onClick={onClose} className="btn-primary mt-6">
        Ver o catálogo
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  )
}
