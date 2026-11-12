import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PRODUCTS, byId } from '../data/products'
import { CatalogHeader } from '../components/catalog/CatalogHeader'
import { TeamPicker } from '../components/catalog/TeamPicker'
import { FilterBar } from '../components/catalog/FilterBar'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { ProductModal } from '../components/catalog/ProductModal'
import { matchesQuery, sortProducts } from '../components/catalog/filters'
import { useCatalogState } from '../components/catalog/useCatalogState'

/**
 * Catálogo de regatas NBA. Atende /catalogo, /time/:abbr e /produto/:id
 * (este último abre o modal por cima da grade, mantendo os filtros da query string).
 */
export function Catalog() {
  const { id } = useParams()
  const { team, cat, q, sort, productSearch, update, clear, hasFilters } = useCatalogState()

  // facetas: contagem de times considera categoria + busca; contagem de categorias considera time + busca
  const teamCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of PRODUCTS) {
      if ((!cat || p.cat === cat) && matchesQuery(p, q)) m.set(p.time, (m.get(p.time) ?? 0) + 1)
    }
    return m
  }, [cat, q])

  const scope = useMemo(
    () => PRODUCTS.filter(p => (!team || p.time === team.name) && matchesQuery(p, q)),
    [team, q],
  )

  const catCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of scope) m.set(p.cat, (m.get(p.cat) ?? 0) + 1)
    return m
  }, [scope])

  const items = useMemo(
    () => sortProducts(scope.filter(p => !cat || p.cat === cat), sort, q),
    [scope, cat, sort, q],
  )

  const totalAll = useMemo(() => [...teamCounts.values()].reduce((a, b) => a + b, 0), [teamCounts])
  const filterKey = `${team?.abbr ?? ''}|${cat}|${q}|${sort}`

  return (
    <main>
      <CatalogHeader team={team} count={items.length} total={PRODUCTS.length} />

      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <TeamPicker
          selected={team}
          counts={teamCounts}
          totalAll={totalAll}
          onSelect={abbr => update({ team: abbr })}
        />
        <section aria-label="Produtos" className="min-w-0 space-y-6">
          <FilterBar
            team={team}
            cat={cat}
            q={q}
            sort={sort}
            catCounts={catCounts}
            resultCount={items.length}
            hasFilters={hasFilters}
            onChange={update}
            onClear={clear}
          />
          <ProductGrid items={items} filterKey={filterKey} search={productSearch} onClear={clear} />
        </section>
      </div>

      {id && <ProductModal key={id} id={id} product={byId(id)} search={productSearch} />}
    </main>
  )
}
