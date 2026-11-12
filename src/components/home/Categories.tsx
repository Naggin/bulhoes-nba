import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { byCategory } from '../../data/products'
import { imgUrl, NBA_CATEGORIES } from '../../lib/config'
import { SectionHeader } from './SectionHeader'

/** Foto representativa de cada categoria (ids reais do catálogo). */
const COVER: Record<string, string> = {
  temporada: 'NBA-LAL-01',
  especiais: 'NBA-GSW-07',
  retro: 'NBA-CHI-09',
  allstar: 'NBA-ASG-X02',
  infantil: 'NBA-LAL-26',
  camisetas: 'NBA-CHI-X02',
  shorts: 'NBA-LAL-X10',
  agasalhos: 'NBA-CHI-X01',
}

const TAGLINE: Record<string, string> = {
  temporada: 'Os uniformes oficiais de 2025/26',
  especiais: 'City Edition e edições limitadas',
  retro: 'Clássicos dos anos 80, 90 e 2000',
  allstar: 'All-Star Game, EUA e França',
  infantil: 'Do 4 ao 16, para os pequenos torcedores',
  camisetas: 'Casual e retrô para o dia a dia',
  shorts: 'Treino, moletom e City Edition',
  agasalhos: 'Para o frio ou para o aquecimento',
}

export function Categories() {
  const cats = NBA_CATEGORIES.map(c => ({ ...c, count: byCategory(c.key).length })).filter(c => c.count > 0)

  return (
    <section className="bg-ink-900 py-16 sm:py-24" aria-labelledby="cats-title">
      <div className="container-x">
        <SectionHeader
          id="cats-title"
          eyebrow="Coleções"
          title="Navegue por categoria"
          description="Da regata oficial da temporada ao retrô que marcou época."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cats.map((c, i) => {
            const cover = COVER[c.key] ?? byCategory(c.key)[0]?.id
            const big = i < 2
            return (
              <Link
                key={c.key}
                to={`/catalogo?cat=${c.key}`}
                className={`group relative isolate overflow-hidden rounded-card border border-white/10 bg-ink-800 shadow-card transition duration-300 motion-safe:hover:-translate-y-1 hover:border-court/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court ${big ? 'col-span-2 aspect-[16/10] sm:aspect-[2/1] lg:col-span-2' : 'aspect-[4/5] sm:aspect-square'}`}
              >
                {cover && (
                  <img
                    src={imgUrl(cover)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 -z-10 size-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,9,15,.1)_0%,rgba(7,9,15,.35)_50%,rgba(7,9,15,.92)_100%)]"
                />
                <div className="flex h-full flex-col justify-end p-4 sm:p-5">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="font-display text-2xl font-black uppercase leading-none sm:text-3xl">{c.label}</p>
                      <p className="mt-1 text-xs text-ink-400 sm:text-sm">{TAGLINE[c.key]}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold backdrop-blur transition group-hover:bg-court group-hover:text-ink-950">
                      {c.count}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
