/** Número do WhatsApp da loja (formato internacional, sem +). */
export const WHATSAPP = '5571999452732'

/**
 * Fotos dos produtos: por padrão hospedadas no catálogo atual.
 * Em builds de demonstração (VITE_IMG_BASE=./img) ficam embutidas junto com o site.
 */
export const IMG_BASE = import.meta.env.VITE_IMG_BASE ?? 'https://bulhoes-sports.pages.dev/img'
export const imgUrl = (id: string) => `${IMG_BASE}/${id}.jpg`

/** Tabela de medidas NBA (PNG). */
export const SIZE_CHART_NBA = import.meta.env.VITE_IMG_BASE
  ? `${import.meta.env.VITE_IMG_BASE}/tabela-medidas-nba.png`
  : 'https://bulhoes-sports.pages.dev/medidas/tabela-medidas-nba.png'

/** Grades de tamanho por `Product.tipo`. */
export const SIZES: Record<string, string[]> = {
  'infantil-kit': ['16 (2-3 anos)', '18 (3-4 anos)', '20 (4-5 anos)', '22 (5-6 anos)', '24 (6-7 anos)', '26 (8-9 anos)', '28 (10-11 anos)'],
  infantil: ['4', '6', '8', '10', '12', '14', '16'],
  feminino: ['P', 'M', 'G', 'GG'],
  default: ['P', 'M', 'G', 'GG', 'XGG', '3XG'],
}
export const sizesFor = (tipo: string) => SIZES[tipo] ?? SIZES.default

/** Categorias NBA na ordem de exibição. */
export const NBA_CATEGORIES: { key: string; label: string }[] = [
  { key: 'temporada', label: 'Temporada' },
  { key: 'especiais', label: 'City & Especiais' },
  { key: 'retro', label: 'Retrô' },
  { key: 'allstar', label: 'All-Star & Seleções' },
  { key: 'infantil', label: 'Infantil' },
  { key: 'camisetas', label: 'Camisetas' },
  { key: 'shorts', label: 'Shorts' },
  { key: 'agasalhos', label: 'Agasalhos' },
]

/** Monta link wa.me com mensagem pré-preenchida. */
export const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
