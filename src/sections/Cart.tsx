import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { byId } from '../data'
import { useCart } from '../lib/cart'
import { eur, useDialog } from '../lib/util'

export function Cart() {
  const { open, setOpen, items, total, count, setQty, remove, clear } = useCart()
  const [done, setDone] = useState(false)
  const close = () => {
    setOpen(false)
    setDone(false)
  }
  const ref = useDialog<HTMLDivElement>(open, close)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-ink/50" onClick={close} aria-hidden="true" data-testid="cart-backdrop" />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            data-testid="cart-drawer"
            className="glass-fill absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/40 text-white shadow-[inset_1px_0_0_rgba(255,255,255,.5)] sm:inset-y-3 sm:right-3 sm:rounded-[28px] sm:border"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="h-display text-xl font-bold">
                Your bag <span className="font-sans text-base font-normal normal-case">({count})</span>
              </h2>
              <button
                type="button"
                onClick={close}
                data-autofocus
                aria-label="Close bag"
                className="glass-chip grid h-11 w-11 cursor-pointer place-items-center rounded-full"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {done ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" role="status">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-pearl text-ink">
                  <Check size={30} aria-hidden="true" />
                </span>
                <p className="h-display mt-5 text-xl font-bold">Thank you</p>
                <p className="mt-2 text-white">This is a portfolio demo, so no order was placed — but your glow is on its way in spirit.</p>
                <button type="button" className="btn btn-light mt-6" onClick={close}>
                  Keep exploring
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={40} aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold">Your bag is empty</p>
                <p className="mt-1 text-white">Add a serum or two and they will appear here.</p>
                <a href="#products" className="btn btn-light mt-6" onClick={close}>
                  Browse products
                </a>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-2">
                  {items.map((it) => {
                    const p = byId(it.id)
                    return (
                      <li key={it.id} className="glass-chip flex gap-3 rounded-3xl p-3" data-testid="cart-item">
                        <div className="grid h-20 w-16 shrink-0 place-items-center rounded-2xl bg-white/15">
                          <img src={p.bottle} alt="" loading="lazy" className="max-h-[72px] w-auto object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-sm text-white">
                            {p.volume} · {eur(p.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQty(it.id, it.qty - 1)}
                              aria-label={`Decrease quantity of ${p.name}`}
                              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/50 hover:bg-white/20"
                            >
                              <Minus size={14} aria-hidden="true" />
                            </button>
                            <span className="w-6 text-center font-semibold" data-testid="cart-qty" aria-label={`Quantity ${it.qty}`}>
                              {it.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(it.id, it.qty + 1)}
                              aria-label={`Increase quantity of ${p.name}`}
                              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/50 hover:bg-white/20"
                            >
                              <Plus size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <p className="font-semibold">{eur(p.price * it.qty)}</p>
                          <button
                            type="button"
                            onClick={() => remove(it.id)}
                            aria-label={`Remove ${p.name}`}
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full hover:bg-white/20"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div className="border-t border-white/30 px-6 pt-4 pb-6">
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold">Subtotal</p>
                    <p className="font-display text-2xl font-medium" data-testid="cart-total">
                      {eur(total)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-white">Free shipping across the EU over €60.</p>
                  <button
                    type="button"
                    className="btn btn-light mt-4 w-full"
                    data-testid="checkout"
                    onClick={() => {
                      clear()
                      setDone(true)
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
