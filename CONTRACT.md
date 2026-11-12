# Bulhões Sports · Regatas NBA — contrato entre lanes

Protótipo de catálogo/loja NBA para a Bulhões Sports (parceria). Objetivo: um site **profissional, bonito e rápido**, muito acima do catálogo atual (https://bulhoes-sports.pages.dev/), para mostrar nossa capacidade de desenvolvimento. Pedido fecha pelo **WhatsApp** (não há checkout com pagamento).

## Stack (já instalada e buildando)
- Vite 8 + React 19 + TypeScript 5.9 · Tailwind v4 (`@tailwindcss/vite`) · react-router-dom 7 · zustand 5 · lucide-react
- `npm run dev` · `npm run build` (tsc + vite) · `npm run lint` (oxlint)
- Fontes já carregadas no `index.html`: **Barlow Condensed** (`font-display`, títulos, caixa alta) e **Manrope** (`font-sans`, texto).

## Dados (prontos, não editar)
- `src/data/nba.json` + `src/data/products.ts` → `PRODUCTS: Product[]` (335 itens NBA), `byId`, `byTeam`, `byCategory`
- `src/data/teams.ts` → `TEAMS` (30 franquias + All-Star + Seleção EUA + Seleção França), `teamOf(nome)`, `teamByAbbr('LAL')`, `FRANCHISES`. Cada time tem `primary`, `secondary`, `abbr`, `short`, `city`, `conference`.
- `src/types/index.ts` → `Product`, `CartItem`
- `src/lib/config.ts` → `imgUrl(id)` (foto do produto, hospedada no site atual), `sizesFor(tipo)`, `NBA_CATEGORIES`, `waLink(msg)`, `WHATSAPP`, `SIZE_CHART_NBA`
- `src/lib/format.ts` → `brl(preco)` (null → "Sob consulta"), `norm`, `slug`
- Categorias (`Product.cat`): temporada (90) · retro (88) · especiais/City Edition (75) · camisetas (30) · infantil (24) · shorts (15) · allstar (8) · agasalhos (5). Preços: R$ 197 (temporada/City), R$ 229 (retrô), R$ 179 (infantil), `null` = sob consulta (camisetas/shorts/agasalhos).
- `Product.jogadores` = quantos jogadores diferentes o modelo tem disponível para personalização (mostrar como "disponível com N jogadores").

## Design system (`src/index.css`) — usar, não reinventar
- Tema escuro "arena": `bg-ink-950` fundo, `bg-ink-900` superfícies, `bg-ink-800` cards, `border-ink-700`, `text-ink-400` secundário, `text-ink-100` principal.
- Acento global da marca: `court` (dourado #f7b733) · `whats` (verde WhatsApp) · `nba-blue` / `nba-red`.
- Cor do time: setar `style={{ '--team': team.primary, '--team-2': team.secondary }}` no elemento e usar `bg-(--team)`, `text-(--team-2)`, gradientes etc.
- Utilitários: `.container-x`, `.btn-primary`, `.btn-whats`, `.btn-ghost`, `.chip` (com `aria-pressed`).
- Referência de qualidade: NBA Store / Nike / Fanatics. Mobile-first, imagens grandes, tipografia condensada forte, micro-interações (hover, transições), estados vazios e de carregamento bem feitos. Copy em pt-BR, sem "lorem ipsum".

## Rotas (`src/App.tsx`)
- `/` → `Home` (`src/pages/Home.tsx`)
- `/catalogo` → `Catalog` com filtros via query string: `?time=LAL&cat=retro&q=lebron`
- `/time/:abbr` → `Catalog` pré-filtrado pelo time (sigla)
- `/produto/:id` → `Catalog` com o modal do produto aberto (ex.: `/produto/NBA-LAL-01`)

## Lanes — propriedade EXCLUSIVA de arquivos (nunca editar arquivo de outra lane)
| Lane | Dono de | Entrega |
|---|---|---|
| **home** | `src/pages/Home.tsx`, `src/components/home/**` | Landing: hero impactante, grade dos 30 times com cores (link `/time/:abbr`), categorias (link `/catalogo?cat=`), destaques/lançamentos (cards reutilizando visual simples, link `/produto/:id`), "como funciona" (escolhe → personaliza → pede no WhatsApp), prova social/garantias (envio Brasil, personalização), CTA WhatsApp. |
| **catalogo** | `src/pages/Catalog.tsx`, `src/components/catalog/**` | Grade de produtos com filtros (time, categoria, busca, ordenação por preço/nome), contagem, sincronizada com a URL; cards com foto, time (sigla/cor), nome, preço; modal/drawer do produto: foto grande, tamanhos (`sizesFor`), campo "Jogador e número" (ex.: JAMES 23), tabela de medidas (`SIZE_CHART_NBA`), botão **Adicionar ao carrinho** (`useCart.add`) e **Pedir no WhatsApp** (`waLink`), produtos relacionados do mesmo time. Rota `/produto/:id` abre o modal. |
| **carrinho** | `src/store/cart.ts`, `src/components/cart/**`, `src/components/layout/**`, `src/App.tsx` | Store real (zustand + `persist` em localStorage, mesclar item igual id+size+custom), `CartDrawer` (lista, qty ±, remover, subtotal, itens "sob consulta", nome/cidade opcionais, botão **Enviar pedido no WhatsApp** com mensagem formatada), `Header` (logo, link catálogo, busca que leva a `/catalogo?q=`, botão carrinho com contador que abre o drawer), `Footer`, botão flutuante do carrinho no mobile. Em `App.tsx`: envolver rotas com Header/Footer e montar o `CartDrawer`. |

### Contratos entre lanes (não mudar assinaturas)
- `useCart()` de `src/store/cart.ts`: `{ items, add({id,size,custom?}), remove(i), setQty(i,qty), clear(), open, setOpen(bool) }`
- `Header` e `Footer` exportados com esses nomes de `src/components/layout/Header.tsx` / `Footer.tsx` (home e catalogo **não** renderizam Header/Footer — o `App.tsx` já envolve).
- Páginas (`Home`, `Catalog`) são export nomeado e renderizam só o `<main>`.
- Mensagem WhatsApp de item único (lane catalogo) e de pedido (lane carrinho) seguem o padrão do site atual: "Olá, Bulhões Sports! Quero este modelo: …", com nome, Ref., tamanho, personalização e valor.

## Regras
- Antes de entregar: `npm run build` e `npm run lint` passando. Não fazer commits.
- Não instalar dependências novas sem necessidade real (lucide-react já cobre ícones).
- Acessibilidade básica: `aria-pressed` nos chips, foco visível, modal fecha com Esc, `alt` nas imagens.
