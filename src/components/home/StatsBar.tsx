import { Shirt, Trophy, UserPen, Truck } from 'lucide-react'
import { PRODUCTS } from '../../data/products'
import { FRANCHISES } from '../../data/teams'

const playerOptions = PRODUCTS.reduce((acc, p) => acc + p.jogadores, 0)

const STATS = [
  { icon: Shirt, value: String(PRODUCTS.length), label: 'modelos em catálogo' },
  { icon: Trophy, value: String(FRANCHISES.length), label: 'franquias da NBA' },
  { icon: UserPen, value: `${playerOptions}+`, label: 'opções de jogador para personalizar' },
  { icon: Truck, value: 'Brasil', label: 'envio para todo o país' },
]

/** Faixa de números calculados a partir do catálogo real. */
export function StatsBar() {
  return (
    <section aria-label="Números da loja" className="border-y border-ink-700 bg-ink-900">
      <dl className="container-x grid grid-cols-2 divide-ink-700 sm:grid-cols-4 sm:divide-x">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-4 py-6 sm:justify-center sm:px-4">
            <Icon className="size-8 shrink-0 text-court" aria-hidden="true" />
            <div>
              <dd className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">{value}</dd>
              <dt className="mt-1 text-xs font-medium text-ink-400 sm:text-sm">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
