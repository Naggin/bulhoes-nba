import type { CSSProperties } from 'react'
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { byId } from '../../data/products'
import { teamOf } from '../../data/teams'
import { imgUrl, waLink } from '../../lib/config'

/** Fotos reais que compõem o mosaico do hero (ordem = profundidade, a última fica na frente). */
const HERO_IDS = ['NBA-BOS-03', 'NBA-GSW-01', 'NBA-CHI-01', 'NBA-LAL-01']

const POSES = [
  'left-0 top-10 w-[46%] -rotate-6 sm:top-16',
  'right-0 top-0 w-[46%] rotate-6',
  'left-[8%] bottom-0 w-[48%] rotate-3',
  'right-[6%] bottom-6 w-[50%] -rotate-3 sm:bottom-10',
]

const WA_MSG = 'Olá, Bulhões Sports! Quero ver as regatas NBA disponíveis.'

export function Hero() {
  const shirts = HERO_IDS.map(byId).filter(p => p != null)

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* fundo: gradiente azul/vermelho NBA + textura de quadra */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_15%_10%,rgba(29,66,138,.55),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(200,16,46,.45),transparent_60%),linear-gradient(180deg,#0d111a_0%,#07090f_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/2 -z-10 hidden -translate-y-1/2 select-none font-display text-[22rem] font-black uppercase leading-none text-white/[0.025] lg:block"
      >
        NBA
      </div>

      <div className="container-x grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-court/40 bg-court/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-court">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Coleção NBA 2025/26
          </p>
          <h1
            id="hero-title"
            className="font-display text-[3.4rem] font-black uppercase leading-[0.88] tracking-tight sm:text-7xl lg:text-[6.5rem]"
          >
            Vista a camisa
            <br />
            do seu <span className="text-court">time.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-400 sm:text-xl">
            Regatas de todas as 30 franquias da NBA: temporada, City Edition, retrô e infantil. Personalize com o nome e o
            número do seu jogador e receba em qualquer lugar do Brasil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/catalogo" className="btn-primary group text-base">
              Ver catálogo completo
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a href={waLink(WA_MSG)} target="_blank" rel="noopener noreferrer" className="btn-whats text-base">
              <MessageCircle className="size-5" aria-hidden="true" />
              Pedir no WhatsApp
            </a>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-400">
            <div>
              <dt className="sr-only">Preço</dt>
              <dd>
                A partir de <strong className="font-display text-xl font-bold text-ink-100">R$ 179</strong>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Tamanhos</dt>
              <dd>
                Tamanhos <strong className="font-display text-xl font-bold text-ink-100">P ao 3XG</strong>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Personalização</dt>
              <dd>
                Nome e número <strong className="font-display text-xl font-bold text-ink-100">inclusos</strong>
              </dd>
            </div>
          </dl>
        </div>

        {/* mosaico de regatas */}
        <div className="relative mx-auto aspect-[4/4.4] w-full max-w-md lg:max-w-none" aria-label="Regatas em destaque">
          <div
            aria-hidden="true"
            className="absolute inset-[12%] -z-10 rounded-full bg-court/20 blur-3xl"
          />
          {shirts.map((p, i) => {
            const team = teamOf(p.time)
            return (
              <Link
                key={p.id}
                to={`/produto/${p.id}`}
                style={{ '--team': team.primary, '--team-2': team.secondary } as CSSProperties}
                className={`group absolute ${POSES[i]} overflow-hidden rounded-card border border-white/10 bg-ink-800 shadow-card transition duration-300 motion-safe:hover:-translate-y-2 motion-safe:hover:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-court`}
                aria-label={p.nome}
              >
                <img
                  src={imgUrl(p.id)}
                  alt={p.nome}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-md bg-(--team) px-2 py-0.5 font-display text-sm font-bold uppercase tracking-wider text-white shadow">
                  {team.abbr}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
