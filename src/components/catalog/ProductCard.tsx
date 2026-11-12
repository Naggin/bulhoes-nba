import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { Product } from '../../types'
import { teamOf } from '../../data/teams'
import { brl } from '../../lib/format'
import { catBadge, plural, teamAccent } from './filters'
import { ProductImage } from './ProductImage'

interface Props {
  product: Product
  /** query string a preservar ao abrir o modal */
  search: string
  eager?: boolean
}

export function ProductCard({ product: p, search, eager }: Props) {
  const team = teamOf(p.time)
  const location = useLocation()
  return (
    <Link
      to={{ pathname: `/produto/${p.id}`, search }}
      state={{ from: location.pathname + location.search }}
      style={{ '--team': team.primary, '--team-2': team.secondary } as CSSProperties}
      className="group flex flex-col rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-court focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
      aria-label={`${p.nome}, ${brl(p.preco)}`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-800 shadow-card transition duration-300 group-hover:-translate-y-1 group-hover:border-ink-700 group-hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,.8)] motion-reduce:transition-none">
        <div className="transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none">
          <ProductImage id={p.id} alt={p.nome} abbr={team.abbr} eager={eager} />
        </div>
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-(--team)" />
        <div className="pointer-events-none absolute inset-x-0 top-3 flex items-start justify-between px-3">
          <span className="rounded-md bg-ink-950/85 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-100 backdrop-blur">
            {catBadge(p.cat)}
          </span>
          <span
            className="rounded-md px-2 py-1 font-display text-sm font-black tracking-wide shadow"
            style={{ background: team.primary, color: team.onPrimary }}
          >
            {team.abbr}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-ink-950/90 to-transparent px-3 pb-3 pt-10 text-sm font-bold text-ink-100 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
          Ver detalhes →
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 px-1 pt-3">
        <p className="flex items-center gap-1.5 text-xs text-ink-400">
          <span className="font-semibold" style={{ color: teamAccent(team.primary, team.secondary) }}>
            {team.short}
          </span>
          {p.jogadores > 1 && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Users size={12} aria-hidden /> {plural(p.jogadores, 'jogador', 'jogadores')}
              </span>
            </>
          )}
        </p>
        <h3 className="font-display text-lg font-bold uppercase leading-tight text-ink-100 transition group-hover:text-court">
          {p.nome}
        </h3>
        <p className={`mt-auto pt-1 text-base font-extrabold ${p.preco == null ? 'text-ink-400' : 'text-ink-100'}`}>
          {brl(p.preco)}
        </p>
      </div>
    </Link>
  )
}
