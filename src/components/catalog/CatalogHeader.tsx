import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Team } from '../../data/teams'
import { onColor, plural } from './filters'

interface Props {
  team: Team | null
  /** modelos visíveis com os filtros atuais */
  count: number
  /** total do catálogo */
  total: number
}

export function CatalogHeader({ team, count, total }: Props) {
  if (!team) {
    return (
      <section className="relative overflow-hidden border-b border-ink-800 bg-ink-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: 'radial-gradient(60% 120% at 85% 0%, rgba(247,183,51,.18), transparent 60%)' }}
        />
        <div className="container-x relative py-10 sm:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-court">Catálogo oficial · Bulhões Sports</p>
          <h1 className="font-display text-5xl font-black uppercase leading-none sm:text-7xl">
            Regatas <span className="text-court">NBA</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ink-400 sm:text-base">
            {plural(total, 'modelo', 'modelos')} de 30 franquias, retrôs, City Edition e infantil. Personalize com nome e número e peça pelo WhatsApp.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative overflow-hidden border-b border-ink-800"
      style={{ '--team': team.primary, '--team-2': team.secondary } as CSSProperties}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(120deg, ${team.primary} 0%, ${team.primary}cc 35%, #07090f 80%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[11rem] font-black leading-none tracking-tighter text-white/10 sm:text-[16rem]"
      >
        {team.abbr}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-(--team-2)" />
      <div className="container-x relative py-10 sm:py-14">
        <nav aria-label="Navegação" className="mb-3 flex items-center gap-1 text-xs font-semibold text-white/70">
          <Link to="/catalogo" className="transition hover:text-white">Catálogo</Link>
          <ChevronRight size={14} aria-hidden />
          <span className="text-white">{team.short}</span>
        </nav>
        <div className="flex items-end gap-4 sm:gap-6">
          <span
            className="hidden shrink-0 rounded-2xl px-4 py-2 font-display text-5xl font-black leading-none shadow-lg sm:block"
            style={{ background: team.secondary, color: onColor(team.secondary) }}
          >
            {team.abbr}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-5xl font-black uppercase leading-none text-white sm:text-7xl">{team.name}</h1>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              {team.city}{team.conference !== 'Especial' && ` · Conferência ${team.conference}`}
              {team.division && ` · Divisão ${team.division}`} · {plural(count, 'modelo', 'modelos')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
