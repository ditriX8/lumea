import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { buildRoutine, goals, skinTypes } from '../data'
import type { Goal, Skin } from '../data'
import { useCart } from '../lib/cart'
import { Decor, Floaty, Glass, SectionHead } from '../lib/ui'
import { eur } from '../lib/util'

function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="eyebrow text-white">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            data-testid={`choice-${o}`}
            className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors ${
              value === o ? 'border-pearl bg-pearl text-ink' : 'border-white/50 bg-white/10 text-white hover:bg-white/25'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-semibold" id={`bar-${label}`}>
          {label}
        </p>
        <p className="font-display text-lg font-medium" data-testid={`bar-${label}`}>
          {value}%
        </p>
      </div>
      <div
        role="progressbar"
        aria-labelledby={`bar-${label}`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-3 overflow-hidden rounded-full bg-white/20 shadow-[inset_0_1px_2px_rgba(43,36,48,.4)]"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-gradient-to-r from-rose via-pearl to-lavender"
          initial={false}
          animate={{ scaleX: value / 100 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  )
}

export function Routine() {
  const [skin, setSkin] = useState<Skin>('Combination')
  const [goal, setGoal] = useState<Goal>('Glow')
  const [added, setAdded] = useState('')
  const { add, setOpen } = useCart()
  const r = buildRoutine(skin, goal)
  const key = `${skin}-${goal}`
  const total = r.products.reduce((n, p) => n + p.price, 0)

  return (
    <section id="rituals" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Floaty className="top-10 right-[-2%] hidden w-40 lg:block" depth={60} rot={12} dur={11}>
        <Decor src="quartz-1" />
      </Floaty>
      <Floaty className="top-[38%] left-[-3%] hidden w-20 lg:block" depth={110} scroll={0.03} dur={8}>
        <div className="bubble aspect-square w-full" />
      </Floaty>
      <SectionHead
        eyebrow="My routine"
        title="Find your ritual"
        text="Tell us about your skin and what you want more of. We will balance the minerals for you."
      />
      <Glass className="curved" inner="px-5 pt-14 pb-8 sm:px-10 md:px-14 md:pt-24 md:pb-12" seed={4} w={1100}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <Choice label="1 · Skin type" options={skinTypes} value={skin} onChange={setSkin} />
            <Choice label="2 · Your goal" options={goals} value={goal} onChange={setGoal} />
            <p className="text-white">
              Balanced for <strong>{skin.toLowerCase()}</strong> skin with a focus on <strong>{goal.toLowerCase()}</strong>. Scores show how
              the suggested set shifts each dimension after four weeks of daily use.
            </p>
          </div>
          <div className="space-y-6" aria-live="polite">
            <Bar label="Hydration" value={r.hydration} />
            <Bar label="Glow" value={r.glow} />
            <Bar label="Radiance" value={r.radiance} />
          </div>
        </div>

        <div className="mt-10 border-t border-white/30 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-white">Your set</p>
              <p className="font-display mt-1 text-xl font-medium uppercase">Three steps · {eur(total)}</p>
            </div>
            <button
              type="button"
              className="btn btn-light"
              data-testid="add-set"
              onClick={() => {
                r.products.forEach((p) => add(p.id))
                setAdded(key)
                setOpen(true)
              }}
            >
              {added === key ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              {added === key ? 'Set added' : 'Add set to bag'}
            </button>
          </div>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3" data-testid="routine-set">
            {r.products.map((p, i) => (
              <motion.li
                key={`${key}-${p.id}`}
                className="glass-chip flex items-center gap-3 rounded-3xl p-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="grid h-20 w-16 shrink-0 place-items-center rounded-2xl bg-white/15">
                  <img src={p.bottle} alt="" loading="lazy" className="max-h-[72px] w-auto object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase">Step {i + 1}</p>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-white">{eur(p.price)}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Glass>
    </section>
  )
}
