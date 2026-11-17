import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { categories, products } from '../data'
import type { Category, Product } from '../data'
import { useCart } from '../lib/cart'
import { Glass, SectionHead } from '../lib/ui'
import { eur, useDialog } from '../lib/util'

function Card({ p, i, onOpen }: { p: Product; i: number; onOpen: (p: Product) => void }) {
  return (
    <li className="flex" data-testid="product-card">
      <Glass className="group flex w-full flex-col" inner="flex flex-1 flex-col p-3 sm:p-4" seed={i + 21} w={230} delay={(i % 4) * 0.07}>
        <div className="relative h-36 sm:h-52">
          <img
            src={p.crystal}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute right-0 bottom-0 max-h-[52%] w-[48%] rotate-6 object-contain object-bottom drop-shadow-[0_10px_12px_rgba(40,20,60,.45)] transition-transform duration-700 group-hover:translate-x-1 group-hover:rotate-12"
          />
          <img
            src={p.bottle}
            alt={`${p.name} bottle`}
            loading="lazy"
            decoding="async"
            className="absolute bottom-0 left-[42%] h-full max-w-[70%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_14px_16px_rgba(40,20,60,.5)] transition-transform duration-700 group-hover:-translate-y-2"
          />
        </div>
        <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-white uppercase">{p.category}</p>
        <h3 className="font-display mt-1 text-[13px] leading-snug font-medium uppercase sm:text-[15px]">
          <button
            type="button"
            onClick={() => onOpen(p)}
            className="cursor-pointer text-left uppercase after:absolute after:inset-0 after:rounded-[28px]"
          >
            {p.name}
          </button>
        </h3>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-lg font-semibold">
            {eur(p.price)} <span className="text-xs font-normal text-white">/ {p.volume}</span>
          </p>
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pearl text-ink transition-transform duration-500 group-hover:rotate-45"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Glass>
    </li>
  )
}

function Modal({ p, onClose }: { p: Product; onClose: () => void }) {
  const { add, setOpen } = useCart()
  const [added, setAdded] = useState(false)
  const ref = useDialog<HTMLDivElement>(true, onClose)
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-ink/55" onClick={onClose} data-testid="modal-backdrop" aria-hidden="true" />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        data-testid="product-modal"
        className="glass-fill relative grid max-h-[calc(100svh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/45 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.75),0_40px_80px_-30px_rgba(43,36,48,.8)] md:grid-cols-[5fr_6fr]"
        initial={{ y: 30, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close product details"
          className="glass-chip absolute top-3 right-3 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <div className="relative flex min-h-56 items-end justify-center bg-white/10 px-6 pt-8 md:min-h-[440px]">
          <img
            src={p.crystal}
            alt={`Raw ${p.crystalName}`}
            className="absolute right-[8%] bottom-4 max-h-[36%] w-[38%] rotate-6 object-contain object-bottom drop-shadow-[0_12px_14px_rgba(40,20,60,.5)]"
          />
          <img
            src={p.bottle}
            alt={`${p.name} bottle`}
            className="relative max-h-52 w-auto object-contain drop-shadow-[0_18px_20px_rgba(40,20,60,.55)] md:max-h-[360px]"
          />
        </div>
        <div className="p-6 sm:p-8">
          <p className="eyebrow text-white">
            {p.category} · {p.volume}
          </p>
          <h3 id="modal-title" className="h-display mt-2 pr-10 text-2xl font-bold sm:text-3xl">
            {p.name}
          </h3>
          <p className="mt-1 font-semibold">{p.tagline}</p>
          <p className="mt-4 text-white">{p.description}</p>
          <h4 className="eyebrow mt-6 text-white">Key ingredients</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.ingredients.map((x) => (
              <li key={x} className="glass-chip rounded-full px-3 py-1 text-sm">
                {x}
              </li>
            ))}
          </ul>
          <h4 className="eyebrow mt-6 text-white">How to use</h4>
          <p className="mt-2 text-white">{p.ritual}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <p className="font-display text-2xl font-medium">{eur(p.price)}</p>
            <button
              type="button"
              className="btn btn-light"
              data-testid="add-to-bag"
              onClick={() => {
                add(p.id)
                setAdded(true)
              }}
            >
              {added ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
              {added ? 'Added — add another' : 'Add to bag'}
            </button>
            {added && (
              <button
                type="button"
                className="cursor-pointer font-semibold underline underline-offset-4"
                onClick={() => {
                  onClose()
                  setOpen(true)
                }}
              >
                View bag
              </button>
            )}
          </div>
          <p className="sr-only" role="status">
            {added ? `${p.name} added to bag` : ''}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Products() {
  const [filter, setFilter] = useState<'all' | Category>('all')
  const [active, setActive] = useState<Product | null>(null)
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <section id="products" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHead
        eyebrow="The collection"
        title="Liquid crystals"
        text="Eight small-batch formulas, each built around one mineral and bottled in refillable glass."
      />
      <div role="group" aria-label="Filter products by category" className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
            data-testid={`filter-${c.id}`}
            className={`min-h-11 cursor-pointer rounded-full border px-5 text-sm font-semibold transition-colors ${
              filter === c.id ? 'border-ink bg-ink text-white' : 'border-ink/30 bg-white/45 text-ink hover:bg-white/80'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5 md:grid-cols-4">
        {list.map((p, i) => (
          <Card key={`${filter}-${p.id}`} p={p} i={i} onOpen={setActive} />
        ))}
      </ul>
      <AnimatePresence>{active && <Modal key={active.id} p={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  )
}
