import { ShoppingBag } from 'lucide-react'
import { useCart, useCartCount, cartTotals } from '../../store/cart'
import { brl } from '../../lib/format'

/** Botão flutuante do carrinho — só no mobile, quando há itens e a gaveta está fechada. */
export function CartFab() {
  const count = useCartCount()
  const open = useCart((s) => s.open)
  const setOpen = useCart((s) => s.setOpen)
  const items = useCart((s) => s.items)
  const { total, openCount } = cartTotals(items)
  const show = count > 0 && !open

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={[
        'fixed right-4 z-40 flex h-14 items-center gap-3 rounded-full bg-court pr-5 pl-4 text-ink-950 shadow-[0_12px_30px_-8px_rgba(247,183,51,.6)] sm:hidden',
        'bottom-[max(1rem,env(safe-area-inset-bottom))]',
        'transition-all duration-300 motion-reduce:transition-none active:scale-95',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      ].join(' ')}
    >
      <span className="relative">
        <ShoppingBag className="size-6" aria-hidden="true" />
        <span className="absolute -top-2 -right-2 grid min-w-5 place-items-center rounded-full bg-ink-950 px-1 text-[11px] font-extrabold text-court">
          {count}
        </span>
      </span>
      <span className="font-display text-lg font-black uppercase leading-none tracking-wide">
        {total > 0 ? brl(total) : openCount > 0 ? 'Sob consulta' : 'Carrinho'}
      </span>
    </button>
  )
}
