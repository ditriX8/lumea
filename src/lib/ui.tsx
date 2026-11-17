import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { byId } from '../data'
import { CartContext } from './cart'
import type { CartItem } from './cart'
import { DRIP_H, dripPath, useInViewOnce, useParallax } from './util'

type GlassProps = {
  children: ReactNode
  className?: string
  inner?: string
  drips?: boolean
  seed?: number
  /** approximate rendered width in px — keeps drips from stretching */
  w?: number
  delay?: number
  /** skip the scroll-reveal (above-the-fold content, keeps LCP fast) */
  instant?: boolean
}

/**
 * Frosted "melting" glass panel. The reveal moves the wrapper (transform) and fades the
 * leaf layers (opacity), so backdrop-filter is never inside a fading ancestor.
 */
export function Glass({ children, className = '', inner = '', drips = true, seed = 1, w = 400, delay = 0, instant = false }: GlassProps) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>(instant)
  const d = useMemo(() => dripPath(w, seed), [w, seed])
  const mask = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${DRIP_H}' preserveAspectRatio='none'><path d='${d}Z'/></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [d, w])
  const cls = ['glass', drips ? 'has-drips' : '', instant ? '' : 'reveal', seen ? 'is-in' : '', className].join(' ')
  return (
    <div ref={ref} className={cls} style={delay ? ({ '--d': `${delay}s` } as CSSProperties) : undefined}>
      <div aria-hidden="true" className="glass-shadow glass-layer" />
      <div aria-hidden="true" className="glass-bg glass-fill glass-layer" />
      {drips && (
        <div aria-hidden="true" className="glass-dripwrap">
          <div className="glass-drips glass-fill glass-layer" style={{ maskImage: mask, WebkitMaskImage: mask }} />
          <svg className="glass-dripstroke glass-layer" viewBox={`0 0 ${w} ${DRIP_H}`} preserveAspectRatio="none">
            <path d={d} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}
      <div className={`glass-layer relative ${inner}`}>{children}</div>
    </div>
  )
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal-up ${seen ? 'is-in' : ''} ${className}`}
      style={delay ? ({ '--d': `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}

type FloatyProps = {
  className?: string
  /** parallax strength in px for a full pointer sweep */
  depth?: number
  /** scroll parallax factor */
  scroll?: number
  rot?: number
  dur?: number
  delay?: number
  children: ReactNode
}

/** Decorative layer: idle float (CSS keyframes) + pointer and scroll parallax (shared rAF loop). */
export function Floaty({ className = '', depth = 30, scroll = 0.06, rot = 0, dur = 9, delay = 0, children }: FloatyProps) {
  const ref = useParallax(depth, scroll)
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute will-change-transform ${className}`}>
      <div className="floaty" style={{ '--rot': `${rot}deg`, '--dur': `${dur}s`, '--delay': `${delay}s` } as CSSProperties}>
        {children}
      </div>
    </div>
  )
}

export function Decor({ src, className = '', eager = false }: { src: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={`/img/${src}.webp`}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={`block h-auto w-full select-none drop-shadow-[0_18px_22px_rgba(74,44,96,0.35)] ${className}`}
    />
  )
}

export function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      <p className="eyebrow text-plum">{eyebrow}</p>
      <h2 className="h-display mt-3 text-[1.7rem] font-bold text-ink sm:text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base text-ink/85 md:text-lg">{text}</p>}
    </Reveal>
  )
}

const KEY = 'lumea:cart'
function load(): CartItem[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    if (!Array.isArray(v)) return []
    return v.filter((i): i is CartItem => !!i && typeof i.id === 'string' && typeof i.qty === 'number' && !!byId(i.id))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable */
    }
  }, [items])
  const api = useMemo(
    () => ({
      items,
      open,
      setOpen,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * byId(i.id).price, 0),
      add: (id: string, qty = 1) =>
        setItems((list) =>
          list.some((i) => i.id === id)
            ? list.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
            : [...list, { id, qty }],
        ),
      setQty: (id: string, qty: number) =>
        setItems((list) => (qty < 1 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)))),
      remove: (id: string) => setItems((list) => list.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    }),
    [items, open],
  )
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}
