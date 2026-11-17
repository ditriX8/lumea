import { Suspense, lazy } from 'react'
import { CartProvider } from './lib/ui'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'

const Sections = lazy(() => import('./sections/Rest').then((m) => ({ default: m.Sections })))
const Outro = lazy(() => import('./sections/Rest').then((m) => ({ default: m.Outro })))

export default function App() {
  return (
    <CartProvider>
        <a
          href="#products"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to products
        </a>
        {/* fixed sunset sky */}
        <div aria-hidden="true" className="fixed inset-0 -z-10">
          <picture>
            <source media="(max-width: 767px)" srcSet="/img/sky-m.webp" />
            <img src="/img/sky.webp" alt="" fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-lavender/25 via-rose/10 to-[#f6cdb6]/45" />
        </div>
        <div aria-hidden="true" className="grain" />
        <Header />
        <main>
          <Hero />
          <Suspense fallback={<div className="min-h-screen" />}>
            <Sections />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Outro />
        </Suspense>
    </CartProvider>
  )
}
