/** Formata preço em BRL; null vira "Sob consulta". */
export const brl = (v: number | null | undefined): string =>
  v == null ? 'Sob consulta' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Remove acentos e baixa caixa, para busca e slugs. */
export const norm = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export const slug = (s: string): string =>
  norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
