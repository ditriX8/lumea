import { ArrowRight, CalendarHeart, Droplets, Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Decor, Floaty, Glass } from '../lib/ui'

const pills = [
  { href: '#products', label: 'Serums', sub: 'Crystal-charged actives', Icon: Droplets },
  { href: '#rituals', label: 'Rituals', sub: 'Build your routine', Icon: Sparkles },
  { href: '#contact', label: 'Book a consultation', sub: 'Free 20-minute skin chat', Icon: CalendarHeart },
]

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 pb-40 sm:pt-32 md:pb-56 lg:min-h-[100svh] lg:pt-40">
      {/* dunes */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/img/dunes-m.webp" />
        <img
          src="/img/dunes.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          className="dunes-mask pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[42%] w-full object-cover object-bottom md:h-[48%]"
        />
      </picture>

      {/* floating decor */}
      <Floaty className="top-[13%] left-[3%] hidden w-28 md:block lg:w-36" depth={46} rot={-14} dur={11}>
        <Decor src="amethyst-2" eager />
      </Floaty>
      <Floaty className="top-[58%] right-[-6%] w-36 sm:right-[2%] sm:w-52 lg:top-[52%] lg:right-[4%] lg:w-72" depth={70} scroll={0.12} rot={8} dur={12}>
        <Decor src="rose-3" eager />
      </Floaty>
      <Floaty className="bottom-[9%] left-[4%] w-24 sm:w-36 lg:left-[9%] lg:w-48" depth={56} scroll={0.1} rot={-6} dur={10} delay={-3}>
        <Decor src="amethyst-1" eager />
      </Floaty>
      <Floaty className="top-[16%] right-[5%] hidden w-16 sm:block lg:right-[41%] lg:w-20" depth={90} rot={10} dur={8} delay={-2}>
        <Decor src="pearl" eager />
      </Floaty>
      <Floaty className="bottom-[20%] left-[46%] hidden w-12 lg:block" depth={110} dur={7} delay={-4}>
        <Decor src="pearl" eager />
      </Floaty>
      <Floaty className="top-[9%] left-[30%] w-20 lg:w-28" depth={120} scroll={0.18} dur={9} delay={-1}>
        <div className="bubble aspect-square w-full" />
      </Floaty>
      <Floaty className="top-[66%] left-[34%] hidden w-14 md:block" depth={140} scroll={0.2} dur={7} delay={-5}>
        <div className="bubble aspect-square w-full" />
      </Floaty>
      <Floaty className="top-[24%] right-[16%] hidden w-10 md:block" depth={150} scroll={0.22} dur={6} delay={-2}>
        <div className="bubble aspect-square w-full" />
      </Floaty>
      <Floaty className="top-[44%] left-[1%] hidden w-24 xl:block" depth={100} scroll={0.16} dur={10} delay={-6}>
        <div className="bubble aspect-square w-full" />
      </Floaty>

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
        <Glass className="lg:col-span-7" inner="px-6 pt-9 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-14 lg:pt-16 lg:pb-12" seed={7} w={660} instant>
          <span aria-hidden="true" className="droplet top-full left-[22%]" style={{ '--delay': '0s' } as CSSProperties} />
          <span aria-hidden="true" className="droplet top-full left-[71%]" style={{ '--delay': '2.6s' } as CSSProperties} />
          <p className="eyebrow text-white">Crystal-infused skincare</p>
          <h1 className="h-display mt-4 text-[3.1rem] font-bold sm:text-7xl lg:text-[5.6rem]">Luméa</h1>
          <p className="font-display mt-3 text-base font-medium tracking-wide sm:text-xl">Glow, powered by nature</p>
          <p className="mt-5 max-w-md text-base text-white sm:text-lg">
            Serums, elixirs and oils charged with rose quartz, amethyst and pearl — small-batch, vegan and made to melt
            into skin.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="btn btn-light">
              Discover <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#rituals" className="btn btn-ghost">
              Find my ritual
            </a>
          </div>
        </Glass>

        <ul className="relative grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-5 lg:pl-6">
          {pills.map(({ href, label, sub, Icon }, i) => (
            <li key={href} className={i === 1 ? 'lg:translate-x-10' : ''}>
              <Glass drips={false} instant className="[--glass-r:999px]">
                <a href={href} className="group flex min-h-[76px] items-center gap-4 rounded-full py-3 pr-5 pl-3 lg:min-h-[88px]">
                  <span className="glass-chip grid h-13 w-13 shrink-0 place-items-center rounded-full lg:h-16 lg:w-16">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-sm font-medium uppercase lg:text-base">{label}</span>
                    <span className="block text-sm text-white">{sub}</span>
                  </span>
                  <ArrowRight size={20} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Glass>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
