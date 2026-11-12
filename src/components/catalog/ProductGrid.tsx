import { useState } from 'react'
import { ChevronDown, SearchX } from 'lucide-react'
import type { Product } from '../../types'
import { PAGE_SIZE } from './filters'
import { ProductCard } from './ProductCard'

interface Props {
  items: Product[]
  /** chave que identifica o conjunto de filtros; muda → paginação volta ao início */
  filterKey: string
  search: string
  onClear: () => void
}

export function ProductGrid({ items, filterKey, search, onClear }: Props) {
  const [page, setPage] = useState({ key: filterKey, limit: PAGE_SIZE })
  const limit = page.key === filterKey ? page.limit : PAGE_SIZE
  const visible = items.slice(0, limit)
  const remaining = items.length - visible.length

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-700 px-6 py-20 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-ink-800 text-ink-400">
          <SearchX size={28} aria-hidden />
        </div>
        <h2 className="font-display text-3xl font-bold uppercase">Nenhum modelo encontrado</h2>
        <p className="mt-2 max-w-sm text-sm text-ink-400">
          Tente outro termo, troque a categoria ou veja todos os times. Se não achar o que procura, chama a gente no WhatsApp que buscamos pra você.
        </p>
        <button type="button" onClick={onClear} className="btn-primary mt-6">Limpar filtros</button>
      </div>
    )
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 xl:grid-cols-4 2xl:grid-cols-5">
        {visible.map((p, i) => (
          <li key={p.id} className="min-w-0">
            <ProductCard product={p} search={search} eager={i < 4} />
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm text-ink-400">
            Mostrando <span className="font-bold text-ink-100">{visible.length}</span> de {items.length}
          </p>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-ink-800">
            <div className="h-full bg-court transition-all" style={{ width: `${(visible.length / items.length) * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={() => setPage({ key: filterKey, limit: limit + PAGE_SIZE })}
            className="btn-ghost"
          >
            Ver mais {Math.min(remaining, PAGE_SIZE)} modelos <ChevronDown size={18} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
