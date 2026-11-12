import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  src: string
  alt: string
  title: string
  onClose: () => void
}

/** Imagem em tela cheia (tabela de medidas). Fecha com Esc ou clique fora. */
export function Lightbox({ src, alt, title, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      prev?.focus()
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fechar tabela de medidas"
        className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-ink-800 text-ink-100 transition hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-court"
      >
        <X size={22} />
      </button>
      <figure className="max-h-full max-w-5xl" onClick={e => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[85dvh] w-auto rounded-xl bg-white object-contain shadow-2xl" />
        <figcaption className="mt-3 text-center text-sm text-ink-400">{title}</figcaption>
      </figure>
    </div>
  )
}
