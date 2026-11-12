import type { Product } from '../types'
import raw from './nba.json'

/** Catálogo NBA completo (335 itens), já tipado. Fonte: produtos.json da Bulhões Sports. */
export const PRODUCTS = raw as Product[]

export const byId = (id: string) => PRODUCTS.find(p => p.id === id)
export const byTeam = (team: string) => PRODUCTS.filter(p => p.time === team)
export const byCategory = (cat: string) => PRODUCTS.filter(p => p.cat === cat)
