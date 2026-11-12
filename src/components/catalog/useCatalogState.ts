import { useCallback, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { teamByAbbr, type Team } from '../../data/teams'
import { isSortKey, type SortKey } from './filters'

export interface FilterPatch {
  /** sigla do time ou null para "todos" */
  team?: string | null
  cat?: string
  q?: string
  sort?: SortKey
}

/**
 * Estado dos filtros vivendo na URL.
 *  /catalogo?time=LAL&cat=retro&q=texto&sort=preco-asc
 *  /time/:abbr?cat=...            (time vem da rota)
 *  /produto/:id?time=LAL&cat=...  (modal por cima; filtros preservados na query)
 */
export function useCatalogState() {
  const { abbr } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const onTeamRoute = Boolean(abbr)
  const teamParam = abbr ?? params.get('time') ?? ''
  const team: Team | null = teamParam ? (teamByAbbr(teamParam) ?? null) : null
  const cat = params.get('cat') ?? ''
  const q = params.get('q') ?? ''
  const sortRaw = params.get('sort')
  const sort: SortKey = isSortKey(sortRaw) ? sortRaw : 'relevancia'

  /** query string para links de produto (garante `time` mesmo vindo de /time/:abbr) */
  const productSearch = useMemo(() => {
    const next = new URLSearchParams(params)
    if (team) next.set('time', team.abbr)
    const s = next.toString()
    return s ? `?${s}` : ''
  }, [params, team])

  const update = useCallback(
    (patch: FilterPatch, opts?: { replace?: boolean }) => {
      const next = new URLSearchParams(params)
      const setOrDel = (k: string, v: string | null | undefined) => (v ? next.set(k, v) : next.delete(k))
      if (patch.cat !== undefined) setOrDel('cat', patch.cat)
      if (patch.q !== undefined) setOrDel('q', patch.q.trim())
      if (patch.sort !== undefined) setOrDel('sort', patch.sort === 'relevancia' ? '' : patch.sort)

      let pathname = onTeamRoute ? `/time/${abbr}` : '/catalogo'
      if (patch.team !== undefined) {
        if (onTeamRoute) {
          pathname = patch.team ? `/time/${patch.team}` : '/catalogo'
          next.delete('time')
        } else {
          setOrDel('time', patch.team)
        }
      } else if (onTeamRoute) {
        next.delete('time')
      }
      const s = next.toString()
      navigate({ pathname, search: s ? `?${s}` : '' }, { replace: opts?.replace })
    },
    [params, abbr, onTeamRoute, navigate],
  )

  const clear = useCallback(() => update({ team: null, cat: '', q: '', sort: 'relevancia' }), [update])

  const hasFilters = Boolean(team || cat || q || sort !== 'relevancia')

  return { team, cat, q, sort, productSearch, update, clear, hasFilters }
}

export type CatalogState = ReturnType<typeof useCatalogState>
