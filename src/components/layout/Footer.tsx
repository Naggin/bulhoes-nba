import { Link } from 'react-router-dom'
import { MessageCircle, Clock, Truck, Shirt, ShieldCheck, Globe } from 'lucide-react'
import { NBA_CATEGORIES, waLink, WHATSAPP } from '../../lib/config'

const fmtPhone = (n: string) => {
  // 5571999452732 → (71) 99945-2732
  const d = n.replace(/^55/, '')
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const YEAR = new Date().getFullYear()

const colTitle = 'font-display text-lg font-black uppercase tracking-wider text-ink-100'
const link = 'text-sm text-ink-400 transition hover:text-court'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-800 bg-ink-900/40">
      {/* faixa de garantias */}
      <div className="border-b border-ink-800">
        <ul className="container-x grid grid-cols-1 divide-y divide-ink-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { Icon: Truck, title: 'Enviamos para todo o Brasil', text: 'Envio rastreado para qualquer cidade.' },
            { Icon: Shirt, title: 'Personalização', text: 'Nome e número do seu jogador na regata.' },
            { Icon: ShieldCheck, title: 'Atendimento direto', text: 'Você fecha o pedido com a loja no WhatsApp.' },
          ].map(({ Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3 py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-court/15 text-court">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-bold uppercase leading-tight tracking-wide">{title}</p>
                <p className="text-xs text-ink-400">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* institucional */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-court font-display text-xl font-black text-ink-950">B</span>
            <span className="font-display text-2xl font-black uppercase leading-none tracking-wide">
              Bulhões <span className="text-court">Sports</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
            Regatas NBA dos 30 times: temporada, City Edition, retrô, All-Star e infantil. Escolha o modelo, personalize com
            seu jogador e feche o pedido direto com a gente pelo WhatsApp.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            <li>
              <a
                href={waLink('Olá, Bulhões Sports! Quero tirar uma dúvida sobre as regatas NBA.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whats h-10 px-4 py-0 text-sm"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://bulhoes-sports.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost h-10 px-4 py-0 text-sm"
              >
                <Globe className="size-4" aria-hidden="true" />
                Catálogo atual
              </a>
            </li>
          </ul>
        </div>

        {/* categorias */}
        <nav aria-label="Categorias">
          <h3 className={colTitle}>Categorias</h3>
          <ul className="mt-4 space-y-2.5">
            {NBA_CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link to={`/catalogo?cat=${c.key}`} className={link}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* loja */}
        <nav aria-label="Loja">
          <h3 className={colTitle}>Loja</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/" className={link}>
                Início
              </Link>
            </li>
            <li>
              <Link to="/catalogo" className={link}>
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link to="/#times" className={link}>
                Times da NBA
              </Link>
            </li>
            <li>
              <Link to="/#como-funciona" className={link}>
                Como funciona
              </Link>
            </li>
            <li>
              <Link to="/catalogo?cat=infantil" className={link}>
                Linha infantil
              </Link>
            </li>
          </ul>
        </nav>

        {/* atendimento */}
        <div>
          <h3 className={colTitle}>Atendimento</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-400">
            <li className="flex items-start gap-2.5">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-whats" aria-hidden="true" />
              <a
                href={waLink('Olá, Bulhões Sports!')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink-100 transition hover:text-court"
              >
                {fmtPhone(WHATSAPP)}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-court" aria-hidden="true" />
              <span>
                Segunda a sexta, 9h às 18h
                <br />
                Sábado, 9h às 13h
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-court" aria-hidden="true" />
              <span>Enviamos para todo o Brasil</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Bulhões Sports. Todos os direitos reservados.</p>
          <p className="text-ink-400/70">
            Protótipo de demonstração · NBA e os nomes dos times são marcas de seus respectivos donos.
          </p>
        </div>
      </div>
    </footer>
  )
}
