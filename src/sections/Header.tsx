import { Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { nav } from '../data'
import { useCart } from '../lib/cart'
import { useDialog } from '../lib/util'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#home" className={`inline-flex items-center gap-2 ${className}`} aria-label="LUMÉA — home">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 20 9 12 22 4 9Z" fill="currentColor" fillOpacity=".25" />
        <path d="M12 2 20 9 12 22 4 9ZM4 9h16M12 2 9 9l3 13 3-13Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <span className="font-display text-lg font-bold tracking-[0.14em]">LUMÉA</span>
    </a>
  )
}

export function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const ref = useDialog<HTMLDivElement>(menu, () => setMenu(false))

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="glass-fill mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-white/40 pr-2 pl-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_14px_40px_-18px_rgba(74,44,96,.7)] sm:pl-7">
        <Logo />
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/20">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="glass-chip relative grid h-12 w-12 cursor-pointer place-items-center rounded-full transition-transform hover:scale-105"
            aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
            data-testid="cart-button"
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {count > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-pearl px-1 text-[11px] font-bold text-ink"
                data-testid="cart-count"
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenu(true)}
            className="glass-chip grid h-12 w-12 cursor-pointer place-items-center rounded-full lg:hidden"
            aria-label="Open menu"
            aria-expanded={menu}
            data-testid="menu-button"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {menu && (
          <div
            id="mobile-menu"
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="glass-fill menu-in fixed inset-0 z-50 flex flex-col px-6 pt-5 pb-10 text-white lg:hidden"
          >
            <div className="flex h-14 items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="glass-chip grid h-12 w-12 cursor-pointer place-items-center rounded-full"
                aria-label="Close menu"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 items-center">
              <ul className="w-full space-y-1">
                {nav.map((n, i) => (
                  <li key={n.href} className="menu-item" style={{ animationDelay: `${0.06 * i + 0.08}s` }}>
                    <a
                      href={n.href}
                      onClick={() => setMenu(false)}
                      className="h-display block border-b border-white/25 py-4 text-2xl font-bold"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="eyebrow text-white">Glow, powered by nature</p>
          </div>
      )}
    </header>
  )
}
