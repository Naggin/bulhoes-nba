import type { Product } from '../../types'
import { NBA_CATEGORIES } from '../../lib/config'
import { norm } from '../../lib/format'
import { teamOf } from '../../data/teams'

export type SortKey = 'relevancia' | 'preco-asc' | 'preco-desc' | 'az'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevancia', label: 'Relevância' },
  { key: 'preco-asc', label: 'Menor preço' },
  { key: 'preco-desc', label: 'Maior preço' },
  { key: 'az', label: 'Nome A-Z' },
]

export const isSortKey = (v: string | null): v is SortKey =>
  SORT_OPTIONS.some(o => o.key === v)

/** Rótulo curto da categoria para badges nos cards. */
const BADGE: Record<string, string> = {
  temporada: 'Temporada',
  especiais: 'City Edition',
  retro: 'Retrô',
  allstar: 'All-Star',
  infantil: 'Infantil',
  camisetas: 'Camiseta',
  shorts: 'Shorts',
  agasalhos: 'Agasalho',
}
export const catBadge = (cat: string) => BADGE[cat] ?? cat

export const catLabel = (cat: string) =>
  NBA_CATEGORIES.find(c => c.key === cat)?.label ?? catBadge(cat)

export const PAGE_SIZE = 48

/** Texto de busca pré-normalizado por produto (nome + ref + time + sigla + categoria). */
const haystack = new Map<string, string>()
export const searchText = (p: Product) => {
  let h = haystack.get(p.id)
  if (!h) {
    const t = teamOf(p.time)
    h = norm(`${p.nome} ${p.id} ${p.time} ${t.abbr} ${t.short} ${catLabel(p.cat)}`)
    haystack.set(p.id, h)
  }
  return h
}

export const matchesQuery = (p: Product, q: string) => {
  if (!q) return true
  const terms = norm(q).split(/\s+/).filter(Boolean)
  const h = searchText(p)
  return terms.every(t => h.includes(t))
}

const byName = (a: Product, b: Product) => a.nome.localeCompare(b.nome, 'pt-BR')

export const sortProducts = (list: Product[], sort: SortKey, q: string): Product[] => {
  const arr = [...list]
  switch (sort) {
    case 'preco-asc':
      return arr.sort((a, b) => {
        if (a.preco == null && b.preco == null) return byName(a, b)
        if (a.preco == null) return 1
        if (b.preco == null) return -1
        return a.preco - b.preco || byName(a, b)
      })
    case 'preco-desc':
      return arr.sort((a, b) => {
        // "Sob consulta" sempre no fim
        if (a.preco == null && b.preco == null) return byName(a, b)
        if (a.preco == null) return 1
        if (b.preco == null) return -1
        return b.preco - a.preco || byName(a, b)
      })
    case 'az':
      return arr.sort(byName)
    default: {
      if (!q) return arr
      // relevância: quem tem o termo no nome sobe
      const nq = norm(q)
      const score = (p: Product) => (norm(p.nome).includes(nq) ? 0 : 1)
      return arr.sort((a, b) => score(a) - score(b))
    }
  }
}

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** Cor "viva" do time para texto sobre fundo escuro (evita secundária preta/branca). */
export const teamAccent = (primary: string, secondary: string) =>
  secondary.toLowerCase() === '#000000' || secondary.toLowerCase() === '#ffffff' ? primary : secondary

/** Cor de texto (preto/branco) legível sobre um hex sólido. */
export const onColor = (hex: string): '#111111' | '#ffffff' => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.6 ? '#111111' : '#ffffff'
}
