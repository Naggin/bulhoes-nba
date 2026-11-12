import { Benefits } from '../components/home/Benefits'
import { Categories } from '../components/home/Categories'
import { Featured } from '../components/home/Featured'
import { Hero } from '../components/home/Hero'
import { HowItWorks } from '../components/home/HowItWorks'
import { StatsBar } from '../components/home/StatsBar'
import { TeamsGrid } from '../components/home/TeamsGrid'

/** Landing page: hero → números → times → categorias → destaques → como funciona → garantias + CTA. */
export function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <TeamsGrid />
      <Categories />
      <Featured />
      <HowItWorks />
      <Benefits />
    </main>
  )
}
