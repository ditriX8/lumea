import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/* ───── Parallax engine: one rAF loop, transform-only, no library ───── */
type Layer = { el: HTMLElement; depth: number; scroll: number }
const layers = new Set<Layer>()
let tx = 0
let ty = 0
let cx = 0
let cy = 0
let raf = 0
let started = false

function frame() {
  cx += (tx - cx) * 0.07
  cy += (ty - cy) * 0.07
  const sy = window.scrollY
  for (const l of layers) {
    const x = (cx * l.depth).toFixed(2)
    const y = (cy * l.depth - sy * l.scroll).toFixed(2)
    l.el.style.transform = `perspective(700px) translate3d(${x}px,${y}px,0) rotateX(${(cy * -10).toFixed(2)}deg) rotateY(${(cx * 14).toFixed(2)}deg)`
  }
  raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0008 ? requestAnimationFrame(frame) : 0
}
const kick = () => {
  if (!raf) raf = requestAnimationFrame(frame)
}

function start() {
  if (started) return
  started = true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('scroll', kick, { passive: true })
  if (window.matchMedia('(pointer: fine)').matches)
    window.addEventListener(
      'pointermove',
      (e) => {
        tx = e.clientX / window.innerWidth - 0.5
        ty = e.clientY / window.innerHeight - 0.5
        kick()
      },
      { passive: true },
    )
}

/** Registers an element as a parallax layer (pointer + scroll). */
export function useParallax(depth: number, scroll: number) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    start()
    const layer = { el, depth, scroll }
    layers.add(layer)
    kick()
    return () => {
      layers.delete(layer)
    }
  }, [depth, scroll])
  return ref
}

/** True once the element has scrolled into view (stays true). */
export function useInViewOnce<T extends HTMLElement>(skip = false, rootMargin = '0px 0px -40px 0px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(skip)
  useEffect(() => {
    const el = ref.current
    if (skip || !el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [skip, rootMargin])
  return [ref, seen]
}

export const eur = (n: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n)

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const DRIP_H = 72

/**
 * Open SVG path for the melting bottom edge of a glass panel: rounded corners
 * plus a seeded set of drips. Starts at (w,0), ends at (0,0); append "Z" to fill.
 */
export function dripPath(w: number, seed: number, r = 26) {
  const rnd = mulberry32(seed * 7919 + 13)
  const base = 16
  const n = Math.max(2, Math.round(w / 105))
  const slot = (w - 2 * r - 40) / n
  const f = (v: number) => v.toFixed(1)
  let d = `M${w},0 Q${w},${base} ${w - r},${base}`
  for (let i = n - 1; i >= 0; i--) {
    const hw = 5.5 + rnd() * 5.5
    const s = hw + 9
    const cx = r + 20 + slot * i + slot * (0.25 + rnd() * 0.5)
    const minL = base + s + hw + 2
    const len = minL + rnd() * rnd() * (DRIP_H - 2 - minL)
    d +=
      ` L${f(cx + hw + s)},${base}` +
      ` C${f(cx + hw + s * 0.35)},${base} ${f(cx + hw)},${f(base + s * 0.35)} ${f(cx + hw)},${f(base + s)}` +
      ` L${f(cx + hw)},${f(len - hw)}` +
      ` A${f(hw)},${f(hw)} 0 0 1 ${f(cx - hw)},${f(len - hw)}` +
      ` L${f(cx - hw)},${f(base + s)}` +
      ` C${f(cx - hw)},${f(base + s * 0.35)} ${f(cx - hw - s * 0.35)},${base} ${f(cx - hw - s)},${base}`
  }
  d += ` L${r},${base} Q0,${base} 0,0`
  return d
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

/** Modal behaviour: Esc to close, focus trap, scroll lock, focus restore. */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void): RefObject<T | null> {
  const ref = useRef<T>(null)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
      } else if (e.key === 'Tab' && el) {
        const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null)
        if (!items.length) return
        const a = items[0]
        const z = items[items.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prev?.focus?.({ preventScroll: true })
    }
  }, [open])
  return ref
}
