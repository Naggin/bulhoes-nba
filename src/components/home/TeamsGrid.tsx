import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { byTeam } from '../../data/products'
import { FRANCHISES, type Team } from '../../data/teams'
import { SectionHeader } from './SectionHeader'

type Filter = 'Todos' | 'Leste' | 'Oeste'
const FILTERS: Filter[] = ['Todos', 'Leste', 'Oeste']

function TeamCard({ team }: { team: Team }) {
  const count = byTeam(team.name).length
  return (
    <Link
      to={`/time/${team.abbr}`}
      style={{ '--team': team.primary, '--team-2': team.secondary } as CSSProperties}
      className="group relative isolate flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-card border border-white/10 bg-ink-800 p-3 shadow-card transition duration-300 motion-safe:hover:-translate-y-1 hover:border-(--team-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court sm:p-4"
      aria-label={`${team.name}: ${count} modelos`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--team)_0%,color-mix(in_srgb,var(--team)_55%,#07090f)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 -z-10 size-28 rounded-full bg-(--team-2) opacity-30 blur-2xl transition duration-300 group-hover:opacity-60"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-3 -right-1 -z-10 select-none font-display text-[5.5rem] font-black leading-none text-white/10 transition duration-300 group-hover:text-white/20 sm:text-[6.5rem]"
      >
        {team.abbr}
      </span>
      <span className="font-display text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
        {team.abbr}
      </span>
      <div className="text-white">
        <p className="truncate font-display text-lg font-bold uppercase leading-tight">{team.short}</p>
        <p className="text-xs font-medium text-white/70">{count} modelos</p>
      </div>
    </Link>
  )
}

export function TeamsGrid() {
  const [filter, setFilter] = useState<Filter>('Todos')
  const teams = filter === 'Todos' ? FRANCHISES : FRANCHISES.filter(t => t.conference === filter)

  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="teams-title">
      <SectionHeader
        id="teams-title"
        eyebrow="30 franquias"
        title="Escolha o seu time"
        description="Todas as franquias da liga, com os modelos da temporada, City Edition e retrô de cada uma."
        to="/catalogo"
        linkLabel="Ver catálogo"
      />
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por conferência">
        {FILTERS.map(f => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'Todos' ? 'Todos os times' : `Conferência ${f}`}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {teams.map(t => (
          <TeamCard key={t.abbr} team={t} />
        ))}
      </div>
    </section>
  )
}
