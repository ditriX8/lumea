import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { reviews } from '../data'
import { Glass, SectionHead } from '../lib/ui'

function usePerView() {
  const get = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
  const [n, setN] = useState(get)
  useEffect(() => {
    const on = () => setN(get())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return n
}

export function Reviews() {
  const per = usePerView()
  const max = reviews.length - per
  const [raw, setIndex] = useState(0)
  const index = Math.min(raw, max)
  const go = (d: number) => setIndex(Math.max(0, Math.min(max, index + d)))

  return (
    <section id="reviews" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24" aria-roledescription="carousel" aria-label="Customer reviews">
      <SectionHead eyebrow="Reviews" title="Loved out loud" text="Rated 4.9 out of 5 by more than 2,300 glowing customers." />
      <div className="overflow-hidden px-1 pt-2 pb-2">
        <motion.ul
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) go(1)
            else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
          }}
          animate={{ x: `${(-index * 100) / per}%` }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          data-testid="reviews-track"
        >
          {reviews.map((r, i) => (
            <li
              key={r.name}
              className="shrink-0 px-2 sm:px-3"
              style={{ width: `${100 / per}%` }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${reviews.length}`}
              aria-hidden={i < index || i >= index + per}
            >
              <Glass inner="flex min-h-[270px] flex-col p-6 sm:p-7" seed={i + 71} w={340}>
                <Quote size={28} aria-hidden="true" className="opacity-80" />
                <p className="sr-only">Rated 5 out of 5</p>
                <div className="mt-3 flex gap-1" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-white">“{r.text}”</blockquote>
                <p className="mt-5 font-semibold">
                  {r.name} <span className="font-normal">· {r.place}</span>
                </p>
                <p className="text-sm text-white">on {r.product}</p>
              </Glass>
            </li>
          ))}
        </motion.ul>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous reviews"
          data-testid="reviews-prev"
          className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-ink text-white transition-opacity disabled:cursor-default disabled:opacity-40"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="min-w-16 text-center font-semibold text-ink" aria-live="polite">
          {index + 1} / {max + 1}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === max}
          aria-label="Next reviews"
          data-testid="reviews-next"
          className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-ink text-white transition-opacity disabled:cursor-default disabled:opacity-40"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
