import { FRANCHISES, TEAMS, type Team } from '../../data/teams'

interface Props {
  selected: Team | null
  /** contagem de modelos por nome de time, já considerando categoria e busca */
  counts: Map<string, number>
  totalAll: number
  onSelect: (abbr: string | null) => void
}

const SPECIALS = Object.values(TEAMS).filter(t => t.conference === 'Especial')
const GROUPS: { label: string; teams: Team[] }[] = [
  { label: 'Conferência Leste', teams: FRANCHISES.filter(t => t.conference === 'Leste') },
  { label: 'Conferência Oeste', teams: FRANCHISES.filter(t => t.conference === 'Oeste') },
  { label: 'All-Star & Seleções', teams: SPECIALS },
]
const ALL = [...FRANCHISES, ...SPECIALS]

/** Seletor de time: chips roláveis no mobile, lista lateral agrupada no desktop. */
export function TeamPicker({ selected, counts, totalAll, onSelect }: Props) {
  const count = (t: Team) => counts.get(t.name) ?? 0

  return (
    <>
      {/* mobile / tablet: chips horizontais */}
      <div className="min-w-0 lg:hidden">
        <div
          role="group"
          aria-label="Filtrar por time"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
        >
          <button type="button" className="chip shrink-0" aria-pressed={!selected} onClick={() => onSelect(null)}>
            Todos <span className="text-xs opacity-70">{totalAll}</span>
          </button>
          {ALL.map(t => {
            const n = count(t)
            const active = selected?.abbr === t.abbr
            if (n === 0 && !active) return null
            return (
              <button
                key={t.abbr}
                type="button"
                className="chip shrink-0"
                aria-pressed={active}
                aria-label={`${t.name}, ${n} modelos`}
                title={t.name}
                onClick={() => onSelect(active ? null : t.abbr)}
              >
                <span aria-hidden className="size-2.5 rounded-full ring-1 ring-white/20" style={{ background: t.primary }} />
                {t.abbr}
                <span className="text-xs opacity-70">{n}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* desktop: lista lateral */}
      <aside className="hidden lg:block" aria-label="Filtrar por time">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 [scrollbar-width:thin]">
          <button
            type="button"
            aria-pressed={!selected}
            onClick={() => onSelect(null)}
            className="mb-3 flex w-full items-center justify-between rounded-xl border border-ink-700 px-3 py-2.5 text-left font-display text-lg font-bold uppercase tracking-wide transition hover:border-ink-400 aria-pressed:border-court aria-pressed:bg-court aria-pressed:text-ink-950"
          >
            Todos os times
            <span className="text-sm font-sans font-semibold opacity-70">{totalAll}</span>
          </button>
          {GROUPS.map(g => (
            <div key={g.label} className="mb-4">
              <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-[.18em] text-ink-400">{g.label}</p>
              <ul className="space-y-0.5">
                {g.teams.map(t => {
                  const n = count(t)
                  const active = selected?.abbr === t.abbr
                  return (
                    <li key={t.abbr}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(active ? null : t.abbr)}
                        className={`group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-court aria-pressed:bg-ink-800 aria-pressed:font-bold ${n === 0 && !active ? 'opacity-45' : ''}`}
                      >
                        <span
                          aria-hidden
                          className="h-5 w-1.5 shrink-0 rounded-full transition group-aria-pressed:w-2.5"
                          style={{ background: active ? t.secondary : t.primary }}
                        />
                        <span className="flex-1 truncate">{t.short}</span>
                        <span className="text-xs text-ink-400">{n}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
