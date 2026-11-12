import { useEffect, useRef, useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { useCart } from '../../store/cart'

/** Toast "Adicionado ao carrinho" — dispara sempre que a quantidade de itens aumenta. */
export function CartToast() {
  const open = useCart((s) => s.open)
  const setOpen = useCart((s) => s.setOpen)
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | null>(null)

  // Observa a store (sistema externo): mostra o toast quando a soma de qty cresce
  useEffect(() => {
    const sum = (items: { qty: number }[]) => items.reduce((n, it) => n + it.qty, 0)
    let prev = sum(useCart.getState().items)
    return useCart.subscribe((s) => {
      const next = sum(s.items)
      if (next > prev && !s.open) {
        setVisible(true)
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setVisible(false), 2800)
      }
      prev = next
    })
  }, [])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  // Gaveta aberta esconde o toast
  const shown = visible && !open

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4 transition-all duration-300 motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      }`}
    >
      {shown && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-ink-700 bg-ink-900/95 py-2 pr-2 pl-3 shadow-card backdrop-blur">
          <span className="grid size-8 place-items-center rounded-full bg-whats text-ink-950">
            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="text-sm font-bold">Adicionado ao carrinho</span>
          <button
            type="button"
            onClick={() => {
              setVisible(false)
              setOpen(true)
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-court px-3 text-xs font-extrabold text-ink-950 transition hover:bg-court-deep"
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
            Ver carrinho
          </button>
        </div>
      )}
    </div>
  )
}
