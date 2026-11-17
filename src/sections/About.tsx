import { Gem, Leaf, Plus, Rabbit, Recycle } from 'lucide-react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { crystals } from '../data'
import { Decor, Floaty, Glass, Reveal, SectionHead } from '../lib/ui'

function Counter({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!inView || !el) return
    const fmt = (v: number) => v.toFixed(decimals) + suffix
    if (reduce) {
      el.textContent = fmt(to)
      return
    }
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => (el.textContent = fmt(v)) })
    return () => c.stop()
  }, [inView, to, decimals, suffix, reduce])
  return (
    <span ref={ref} aria-label={to.toFixed(decimals) + suffix}>
      {(0).toFixed(decimals) + suffix}
    </span>
  )
}

const principles = [
  { Icon: Gem, title: 'Natural minerals', text: 'Ethically sourced crystals, micro-milled or slow-infused — never synthetic shimmer.' },
  { Icon: Rabbit, title: 'Cruelty-free', text: 'Tested on willing humans only. Every formula is vegan and certified cruelty-free.' },
  { Icon: Recycle, title: 'Refill & recycle', text: 'Send back your empty glass bottle and we refill or recycle it — and take €5 off.' },
  { Icon: Leaf, title: 'Small batches', text: 'Blended weekly in our coastal studio so nothing sits on a shelf losing its potency.' },
]

const stats = [
  { to: 12, suffix: '', label: 'Mineral actives' },
  { to: 100, suffix: '%', label: 'Vegan & cruelty-free' },
  { to: 48, suffix: 'k', label: 'Bottles refilled' },
  { to: 4.9, suffix: '', decimals: 1, label: 'Average rating' },
]

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Floaty className="top-[6%] left-[-4%] hidden w-44 lg:block" depth={60} rot={-10} dur={12}>
        <Decor src="rose-2" />
      </Floaty>
      <SectionHead eyebrow="Our philosophy" title="Born from stone and sea" />
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <Glass className="lg:col-span-5" inner="p-6 sm:p-9" seed={11} w={440}>
          <p className="eyebrow text-white">Since 2019</p>
          <h3 className="h-display mt-3 text-2xl font-bold">A slower kind of glow</h3>
          <p className="mt-4 text-white">
            LUMÉA began on a windswept beach with a jar of rosehip oil and a pocketful of rose quartz. Our founder, a
            cosmetic chemist, wanted skincare that felt like golden hour — warm, unhurried and honest about what is
            inside.
          </p>
          <p className="mt-3 text-white">
            Today we still blend every batch by hand, pairing clinically studied actives with minerals that have been part
            of beauty rituals for centuries.
          </p>
          <a href="#contact" className="btn btn-light mt-7">
            Meet us in the studio
          </a>
        </Glass>
        <ul className="grid gap-x-5 gap-y-2 sm:grid-cols-2 lg:col-span-7">
          {principles.map(({ Icon, title, text }, i) => (
            <li key={title} className="flex">
              <Glass inner="p-6" seed={i + 31} w={320} delay={i * 0.08} className="flex w-full flex-col">
                <span className="glass-chip grid h-12 w-12 place-items-center rounded-full">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="font-display mt-4 text-base font-medium uppercase">{title}</h3>
                <p className="mt-2 text-white">{text}</p>
              </Glass>
            </li>
          ))}
        </ul>
      </div>
      <Reveal>
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 rounded-[28px] border border-white/60 bg-white/45 px-4 py-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm font-semibold text-ink/85">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-plum sm:text-5xl">
                <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}

export function Ingredients() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="ingredients" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Floaty className="top-[4%] right-[2%] hidden w-16 md:block" depth={120} scroll={0.02} dur={7}>
        <div className="bubble aspect-square w-full" />
      </Floaty>
      <SectionHead
        eyebrow="Ingredients"
        title="The crystal library"
        text="Four minerals sit at the heart of every formula. Hover or tap a stone to see what it brings."
      />
      <ul className="grid grid-cols-1 gap-x-5 gap-y-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {crystals.map((c, i) => {
          const isOpen = open === i
          return (
            <li key={c.name}>
              <Glass className="group" seed={i + 51} w={260} delay={i * 0.08}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-testid="crystal-card"
                  className="relative block h-[340px] w-full cursor-pointer overflow-hidden rounded-t-[28px] p-5 text-left"
                >
                  <span
                    className={`absolute inset-x-5 top-5 bottom-24 flex transition-[transform,opacity] duration-700 group-hover:-translate-y-3 group-hover:scale-90 group-hover:opacity-25 ${isOpen ? '-translate-y-3 scale-90 opacity-25' : ''}`}
                  >
                    <img
                      src={c.img}
                      alt={`Raw ${c.name.toLowerCase()}`}
                      loading="lazy"
                      decoding="async"
                      className="m-auto h-full max-h-56 w-[82%] object-contain drop-shadow-[0_18px_20px_rgba(40,20,60,.5)]"
                    />
                  </span>
                  <span className="absolute inset-x-5 bottom-5 block">
                    <span className="eyebrow block text-white">{c.note}</span>
                    <span className="font-display mt-1 flex items-center justify-between text-lg font-medium uppercase">
                      {c.name}
                      <Plus
                        size={20}
                        aria-hidden="true"
                        className={`transition-transform duration-500 group-hover:rotate-45 ${isOpen ? 'rotate-45' : ''}`}
                      />
                    </span>
                  </span>
                  <span
                    className={`absolute inset-x-5 top-5 block translate-y-3 opacity-0 transition-[transform,opacity] duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${isOpen ? '!translate-y-0 !opacity-100' : ''}`}
                  >
                    <span className="block text-white">{c.text}</span>
                    <span className="mt-3 block space-y-1.5">
                      {c.props.map((p) => (
                        <span key={p} className="glass-chip block rounded-2xl px-3 py-1.5 text-sm">
                          {p}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </Glass>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
