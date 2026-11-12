import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  eyebrow: string
  title: string
  description?: string
  to?: string
  linkLabel?: string
  id?: string
}

/** Cabeçalho padrão das seções da Home: chapéu dourado, título condensado e link opcional. */
export function SectionHeader({ eyebrow, title, description, to, linkLabel = 'Ver tudo', id }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.25em] text-court">{eyebrow}</p>
        <h2 id={id} className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-base text-ink-400">{description}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-2 self-start font-semibold text-ink-100 transition hover:text-court focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-court sm:self-auto"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
