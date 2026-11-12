/**
 * Carrinho — zustand + persist (localStorage, chave `bs-nba-cart`, só `items`).
 * A assinatura de `CartState` é contrato entre lanes: não mudar nomes.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'
import { byId } from '../data/products'
import { brl } from '../lib/format'

export interface CartState {
  items: CartItem[]
  /** Adiciona 1 unidade; se já existir item igual (id+size+custom), incrementa qty. */
  add: (item: Omit<CartItem, 'qty'>) => void
  remove: (index: number) => void
  setQty: (index: number, qty: number) => void
  clear: () => void
  /** gaveta do carrinho aberta? */
  open: boolean
  setOpen: (open: boolean) => void
}

const normCustom = (c?: string) => (c ?? '').trim().toUpperCase()

const sameItem = (a: Omit<CartItem, 'qty'>, b: Omit<CartItem, 'qty'>) =>
  a.id === b.id && a.size === b.size && normCustom(a.custom) === normCustom(b.custom) && (a.manga ?? '') === (b.manga ?? '')

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const custom = normCustom(item.custom) || undefined
          const next: Omit<CartItem, 'qty'> = { ...item, custom }
          const idx = s.items.findIndex((it) => sameItem(it, next))
          if (idx >= 0) {
            return { items: s.items.map((it, k) => (k === idx ? { ...it, qty: it.qty + 1 } : it)) }
          }
          return { items: [...s.items, { ...next, qty: 1 }] }
        }),
      remove: (i) => set((s) => ({ items: s.items.filter((_, k) => k !== i) })),
      setQty: (i, qty) =>
        set((s) => ({
          items:
            qty < 1
              ? s.items.filter((_, k) => k !== i)
              : s.items.map((it, k) => (k === i ? { ...it, qty: Math.min(99, Math.floor(qty)) } : it)),
        })),
      clear: () => set({ items: [] }),
      open: false,
      setOpen: (open) => set({ open }),
    }),
    {
      name: 'bs-nba-cart',
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

/** Total de unidades no carrinho (soma de qty). */
export const useCartCount = () => useCart((s) => s.items.reduce((n, it) => n + it.qty, 0))

/** Preço unitário de um item (considera variação de manga quando houver). */
export const itemPrice = (it: Pick<CartItem, 'id' | 'manga'>): number | null => {
  const p = byId(it.id)
  if (!p) return null
  if (it.manga && p.mangas && it.manga in p.mangas) return p.mangas[it.manga]
  return p.preco
}

/**
 * Totais do carrinho: `total` em BRL (só itens com preço) e `openCount`
 * = quantidade de unidades "sob consulta" (preço null).
 */
export const cartTotals = (items: CartItem[]) => {
  let total = 0
  let openCount = 0
  for (const it of items) {
    const price = itemPrice(it)
    if (price == null) openCount += it.qty
    else total += price * it.qty
  }
  return { total, openCount, totalLabel: brl(total) }
}

export interface OrderContact {
  nome?: string
  cidade?: string
}

/** Mensagem do pedido para o WhatsApp, no padrão do site atual. */
export const orderMessage = (items: CartItem[], contact: OrderContact = {}): string => {
  const lines = items.map((it, i) => {
    const p = byId(it.id)
    const price = itemPrice(it)
    const nome = p?.nome ?? it.id
    const block = [
      `${i + 1}) ${nome} (Ref. ${it.id})`,
      `   Tamanho: ${it.size} · Qtd: ${it.qty}`,
    ]
    if (it.manga) block.push(`   Manga: ${it.manga}`)
    if (it.custom) block.push(`   Personalização: ${it.custom}`)
    block.push(`   Valor: ${price == null ? 'Sob consulta' : brl(price * it.qty)}`)
    return block.join('\n')
  })

  const { total, openCount } = cartTotals(items)
  const totalLine = openCount
    ? `Total: ${brl(total)} + ${openCount} ${openCount === 1 ? 'item' : 'itens'} sob consulta`
    : `Total: ${brl(total)}`

  const out = ['Olá, Bulhões Sports! Quero fazer este pedido:', '', lines.join('\n\n'), '', totalLine]
  const nome = contact.nome?.trim()
  const cidade = contact.cidade?.trim()
  if (nome) out.push(`Nome: ${nome}`)
  if (cidade) out.push(`Cidade: ${cidade}`)
  return out.join('\n')
}
