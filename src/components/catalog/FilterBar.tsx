import { useRef, useState } from 'react'
import { ArrowUpDown, Search, X } from 'lucide-react'
import { NBA_CATEGORIES } from '../../lib/config'
import type { Team } from '../../data/teams'
import { SORT_OPTIONS, plural, type SortKey } from './filters'
import type { FilterPatch } from './useCatalogState'

interface Props {
  team: Team | null
  cat: string
  q: string
  sort: SortKey
  /** contagem por categoria dentro do time + busca atuais */
  catCounts: Map<string, number>
  resultCount: number
  hasFilters: boolean
  onChange: (patch: FilterPatch, opts?: { replace?: boolean }) => void
  onClear: () => void
}

export function FilterBar({ team, cat, q, sort, catCounts, resultCount, hasFilters, onChange, onClear }: Props) {
  // busca com debounce; `local.q` espelha o valor na URL para resync quando ela muda por fora
  const [local, setLocal] = useState({ q, value: q })
  const value = local.q === q ? local.value : q
  const timer = useRef(0)

  const commit = (v: string) => {
    window.clearTimeout(timer.current)
    setLocal({ q: v.trim(), value: v })
    onChange({ q: v }, { replace: true })
  }
  const onInput = (v: string) => {
    setLocal({ q, value: v })
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => commit(v), 250)
  }

  const totalInScope = [...catCounts.values()].reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          role="search"
          className="relative flex-1"
          onSubmit={e => { e.preventDefault(); commit(value) }}
        >
          <Search size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={value}
            onChange={e => onInput(e.target.value)}
            placeholder={team ? `Buscar em ${team.short}…` : 'Buscar modelo, time ou referência…'}
            aria-label="Buscar modelo"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-xl border border-ink-700 bg-ink-900 pl-11 pr-11 text-base text-ink-100 placeholder:text-ink-400 transition focus:border-court focus:outline-none focus:ring-2 focus:ring-court/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => commit('')}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
            >
              <X size={18} />
            </button>
          )}
        </form>
        <label className="relative sm:w-56">
          <span className="sr-only">Ordenar por</span>
          <ArrowUpDown size={16} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <select
            value={sort}
            onChange={e => onChange({ sort: e.target.value as SortKey })}
            className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-ink-700 bg-ink-900 pl-10 pr-9 text-sm font-semibold text-ink-100 transition hover:border-ink-400 focus:border-court focus:outline-none focus:ring-2 focus:ring-court/40"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400">▾</span>
        </label>
      </div>

      <div role="group" aria-label="Filtrar por categoria" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
        <button type="button" className="chip shrink-0" aria-pressed={!cat} onClick={() => onChange({ cat: '' })}>
          Todas <span className="text-xs opacity-70">{totalInScope}</span>
        </button>
        {NBA_CATEGORIES.map(c => {
          const n = catCounts.get(c.key) ?? 0
          const active = cat === c.key
          if (n === 0 && !active) return null
          return (
            <button
              key={c.key}
              type="button"
              className="chip shrink-0"
              aria-pressed={active}
              onClick={() => onChange({ cat: active ? '' : c.key })}
            >
              {c.label} <span className="text-xs opacity-70">{n}</span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-ink-800 pb-3">
        <p className="text-sm text-ink-400" aria-live="polite">
          <span className="font-bold text-ink-100">{plural(resultCount, 'modelo', 'modelos')}</span>
          {q && <> para <span className="font-semibold text-ink-100">“{q}”</span></>}
        </p>
        {hasFilters && (
          <button type="button" onClick={onClear} className="inline-flex items-center gap-1 text-sm font-semibold text-court transition hover:underline">
            <X size={14} aria-hidden /> Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
