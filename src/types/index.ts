/** Um produto do catálogo (formato original do produtos.json da Bulhões Sports). */
export interface Product {
  /** Ref. única, ex.: "NBA-LAL-01". Também é o nome da foto: `${IMG_BASE}/${id}.jpg` */
  id: string
  nome: string
  /** Categoria dentro da liga. NBA: temporada | especiais | retro | allstar | infantil | camisetas | shorts | agasalhos */
  cat: string
  /** Grade de tamanhos: adulto | infantil | feminino | infantil-kit */
  tipo: string
  /** Preço em BRL. null = sob consulta */
  preco: number | null
  /** Quantidade de jogadores disponíveis para personalização desse modelo */
  jogadores: number
  liga: 'nba' | 'nfl' | 'nhl' | 'mlb' | 'sel' | 'ret' | 'eur' | 'bra'
  /** Nome do time, ex.: "Los Angeles Lakers" */
  time: string
  pais?: string
  /** Variações com preço próprio (ex.: manga curta/longa). Raro na NBA. */
  mangas?: Record<string, number | null>
}

export interface CartItem {
  id: string
  size: string
  qty: number
  /** Personalização "JOGADOR 23" (opcional) */
  custom?: string
  manga?: string
}

export type NbaCategory =
  | 'temporada' | 'especiais' | 'retro' | 'allstar' | 'infantil' | 'camisetas' | 'shorts' | 'agasalhos'
