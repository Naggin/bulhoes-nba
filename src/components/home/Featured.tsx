import { useRef, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { byId } from '../../data/products'
import { teamOf } from '../../data/teams'
import { imgUrl } from '../../lib/config'
import { brl } from '../../lib/format'
import type { Product } from '../../types'
import { SectionHeader } from './SectionHeader'

/** City Edition 2025/26 + retrôs icônicos, na ordem de exibição. */
const FEATURED_IDS = [
  'NBA-LAL-09',
  'NBA-GSW-06',
  'NBA-CHI-05',
  'NBA-BOS-05',
  'NBA-OKC-05',
  'NBA-CHI-09',
  'NBA-LAL-23',
  'NBA-MIA-06',
  'NBA-PHI-05',
  'NBA-DAL-05',
]

const badgeFor = (p: Product) => (p.cat === 'retro' ? 'Retrô' : /City Edition/i.test(p.nome) ? 'City Edition' : 'Lançamento')

function ProductCard({ product: p }: { product: Product }) {
  const team = teamOf(p.time)
  return (
    <Link
      to={`/produto/${p.id}`}
      style={{ '--team': team.primary, '--team-2': team.secondary } as CSSProperties}
      className="group flex w-[72vw] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-white/10 bg-ink-800 shadow-card transition duration-300 motion-safe:hover:-translate-y-1 hover:border-(--team-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court sm:w-64 lg:w-72"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
        <img
          src={imgUrl(p.id)}
          alt={p.nome}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-(--team) px-2 py-0.5 font-display text-sm font-bold uppercase tracking-wider text-white shadow">
          {team.abbr}
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-ink-950/80 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-court backdrop-blur">
          {badgeFor(p)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{team.short}</p>
        <h3 className="line-clamp-2 font-semibold leading-snug">{p.nome}</h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="font-display text-2xl font-black">{brl(p.preco)}</p>
          {p.jogadores > 1 && (
            <p className="flex items-center gap-1 text-xs text-ink-400">
              <Users className="size-3.5" aria-hidden="true" />
              {p.jogadores} jogadores
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function Featured() {
  const products = FEATURED_IDS.map(byId).filter(p => p != null)
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section className="py-16 sm:py-24" aria-labelledby="featured-title">
      <div className="container-x">
        <SectionHeader
          id="featured-title"
          eyebrow="Destaques"
          title="Lançamentos e clássicos"
          description="As City Edition desta temporada e os retrôs mais pedidos da loja."
          to="/catalogo?cat=especiais"
          linkLabel="Ver City Edition"
        />
      </div>
      <div className="relative">
        <div
          ref={track}
          className="container-x flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
          <div aria-hidden="true" className="w-px shrink-0" />
        </div>
        <div className="container-x mt-2 hidden justify-end gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} className="btn-ghost size-11 p-0" aria-label="Rolar para trás">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scroll(1)} className="btn-ghost size-11 p-0" aria-label="Rolar para frente">
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
