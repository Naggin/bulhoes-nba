import { useState } from 'react'
import { imgUrl } from '../../lib/config'

interface Props {
  id: string
  alt: string
  /** sigla exibida no fallback quando a foto não carrega */
  abbr: string
  eager?: boolean
  className?: string
}

/** Foto 3:4 com skeleton enquanto carrega e fallback com a sigla do time. */
export function ProductImage({ id, alt, abbr, eager, className = '' }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  return (
    <div className={`relative aspect-3/4 w-full overflow-hidden bg-ink-800 ${className}`}>
      {state === 'loading' && (
        <div aria-hidden className="absolute inset-0 animate-pulse bg-linear-to-br from-ink-800 via-ink-700 to-ink-800" />
      )}
      {state === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-ink-400">
          <span className="font-display text-5xl font-black uppercase text-ink-700">{abbr}</span>
          <span className="text-xs">Foto indisponível</span>
        </div>
      ) : (
        <img
          src={imgUrl(id)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`h-full w-full object-cover transition-opacity duration-500 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
