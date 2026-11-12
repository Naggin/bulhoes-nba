import { MessageCircle, PenLine, Search } from 'lucide-react'
import { SectionHeader } from './SectionHeader'

const STEPS = [
  {
    icon: Search,
    title: 'Escolha o modelo',
    text: 'Navegue por time ou categoria e encontre a regata certa entre mais de 300 opções.',
  },
  {
    icon: PenLine,
    title: 'Personalize',
    text: 'Informe o tamanho e o nome e número do jogador. Ex.: JAMES 23. A personalização já está inclusa.',
  },
  {
    icon: MessageCircle,
    title: 'Peça no WhatsApp',
    text: 'O pedido chega pronto na nossa conversa. Confirmamos o prazo, o frete e o pagamento com você.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-ink-900 py-16 sm:py-24" aria-labelledby="how-title">
      <div className="container-x">
        <SectionHeader
          id="how-title"
          eyebrow="Como funciona"
          title="Três passos até a quadra"
          description="Sem cadastro, sem checkout complicado: você escolhe e fecha direto com a gente."
        />
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="relative overflow-hidden rounded-card border border-ink-700 bg-ink-800 p-6 transition duration-300 hover:border-court/60"
            >
              <span
                aria-hidden="true"
                className="absolute -right-2 -top-4 select-none font-display text-8xl font-black leading-none text-white/5"
              >
                0{i + 1}
              </span>
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-court/15 text-court">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-court">Passo {i + 1}</p>
              <h3 className="mt-1 font-display text-2xl font-black uppercase leading-none">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
