import { BadgeCheck, MessageCircle, Ruler, Truck, UserPen } from 'lucide-react'
import { waLink } from '../../lib/config'

const ITEMS = [
  { icon: Truck, title: 'Envio para todo o Brasil', text: 'Postamos com rastreio para qualquer estado.' },
  { icon: UserPen, title: 'Nome e número inclusos', text: 'Personalize com o jogador que quiser, sem custo extra.' },
  { icon: Ruler, title: 'Tabela de medidas', text: 'Grade do P ao 3XG, infantil do 4 ao 16 e kits para os menores.' },
  { icon: BadgeCheck, title: 'Atendimento humano', text: 'Tira-dúvidas direto no WhatsApp antes e depois do pedido.' },
]

const WA_MSG = 'Olá, Bulhões Sports! Quero fazer um pedido de regata NBA.'

export function Benefits() {
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="benefits-title">
      <h2 id="benefits-title" className="sr-only">
        Garantias e contato
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 rounded-card border border-ink-700 bg-ink-900 p-5">
            <Icon className="size-6 shrink-0 text-court" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-bold uppercase leading-tight">{title}</p>
              <p className="mt-1 text-sm text-ink-400">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative isolate mt-12 overflow-hidden rounded-card border border-whats/30 px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_80%_at_50%_120%,rgba(37,211,102,.28),transparent_65%),linear-gradient(180deg,#161c29,#0d111a)]"
        />
        <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-whats">Pronto para pedir?</p>
        <h3 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
          Fale com a gente
          <br />
          no WhatsApp
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-ink-400">
          Mande o modelo, o tamanho e a personalização. A gente responde rápido e confirma tudo com você.
        </p>
        <a
          href={waLink(WA_MSG)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whats mt-8 text-base sm:text-lg"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  )
}
