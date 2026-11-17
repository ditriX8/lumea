import { MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useInViewOnce } from '../lib/util'
import { About, Ingredients } from './About'
import { Cart } from './Cart'
import { Contact, Footer } from './Contact'
import { Products } from './Products'
import { Reviews } from './Reviews'
import { Routine } from './Routine'

/**
 * Mounts a section only when it comes within ~900px of the viewport. Until then a
 * placeholder with the same id keeps anchors and page height roughly in place.
 */
function Near({ id, h, force, children }: { id: string; h: number; force: boolean; children: ReactNode }) {
  const [ref, seen] = useInViewOnce<HTMLElement>(force, '900px 0px')
  if (force || seen) return children
  return <section id={id} ref={ref} aria-hidden="true" style={{ minHeight: h }} />
}

/** Everything below the first screen — one separate chunk, loaded right after the hero paints. */
export function Sections() {
  const [all, setAll] = useState(() => window.location.hash.length > 1)

  // deep link on load
  useEffect(() => {
    if (window.location.hash.length > 1) document.querySelector(window.location.hash)?.scrollIntoView()
  }, [])

  // anchor navigation: mount everything first so the target position is final
  useEffect(() => {
    if (all) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      const hash = a?.getAttribute('href')
      if (!hash || hash === '#home' || e.defaultPrevented) return
      e.preventDefault()
      flushSync(() => setAll(true))
      document.querySelector(hash)?.scrollIntoView()
      window.history.pushState(null, '', hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [all])

  return (
    <MotionConfig reducedMotion="user">
      <Products />
      <Near id="rituals" h={900} force={all}>
        <Routine />
      </Near>
      <Near id="about" h={900} force={all}>
        <About />
      </Near>
      <Near id="ingredients" h={700} force={all}>
        <Ingredients />
      </Near>
      <Near id="reviews" h={650} force={all}>
        <Reviews />
      </Near>
      <Near id="contact" h={850} force={all}>
        <Contact />
      </Near>
    </MotionConfig>
  )
}

export function Outro() {
  return (
    <MotionConfig reducedMotion="user">
      <Footer />
      <Cart />
    </MotionConfig>
  )
}
