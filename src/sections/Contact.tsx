import { ArrowUp, Check, Clock, Mail, MapPin, Music2, Pin, Send } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { nav, skinTypes } from '../data'
import { Decor, Floaty, Glass, SectionHead } from '../lib/ui'
import { Logo } from './Header'

type Form = { name: string; email: string; date: string; skin: string; comment: string }
type Errors = Partial<Record<keyof Form, string>>
const empty: Form = { name: '', email: '', date: '', skin: '', comment: '' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

function validate(f: Form): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Please tell us your name.'
  if (!EMAIL.test(f.email.trim())) e.email = 'Enter a valid email, like you@example.com.'
  if (!f.date) e.date = 'Pick a date for your consultation.'
  else if (f.date < today()) e.date = 'Please choose today or a future date.'
  if (!f.skin) e.skin = 'Choose the option closest to your skin.'
  if (f.comment.length > 500) e.comment = 'Please keep it under 500 characters.'
  return e
}

function Field({ id, label, error, children, optional }: { id: string; label: string; error?: string; children: ReactNode; optional?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label} {optional && <span className="font-normal">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-[#ffe1e7]" data-testid={`error-${id}`}>
          {error}
        </p>
      )}
    </div>
  )
}

function Instagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) return setState('error')
    try {
      localStorage.setItem('lumea:newsletter', email.trim())
    } catch {
      /* storage unavailable */
    }
    setState('done')
  }
  if (state === 'done')
    return (
      <p className="flex items-center gap-2 font-semibold" role="status" data-testid="newsletter-done">
        <Check size={18} aria-hidden="true" /> You are on the list — 10% off is on its way.
      </p>
    )
  return (
    <form onSubmit={submit} noValidate data-testid="newsletter">
      <label htmlFor="nl-email" className="mb-1.5 block text-sm font-semibold">
        Email for the Glow Letter
      </label>
      <div className="flex gap-2">
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="field"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setState('idle')
          }}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? 'nl-error' : undefined}
        />
        <button type="submit" className="btn btn-light shrink-0 !px-4" aria-label="Subscribe">
          <Send size={18} aria-hidden="true" />
        </button>
      </div>
      {state === 'error' && (
        <p id="nl-error" className="mt-1.5 text-sm font-semibold text-[#ffe1e7]">
          Enter a valid email address.
        </p>
      )}
    </form>
  )
}

export function Contact() {
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<Form | null>(null)
  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }
  const aria = (k: keyof Form) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `bk-${k}-error` : undefined })
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    const first = (Object.keys(errs) as (keyof Form)[])[0]
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`#bk-${first}`)?.focus()
      return
    }
    try {
      const all: unknown = JSON.parse(localStorage.getItem('lumea:bookings') ?? '[]')
      localStorage.setItem('lumea:bookings', JSON.stringify([...(Array.isArray(all) ? all : []), { ...form, at: Date.now() }]))
    } catch {
      /* storage unavailable */
    }
    setSent(form)
    setForm(empty)
  }

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <Floaty className="top-[10%] right-[-3%] hidden w-40 lg:block" depth={70} rot={10} dur={11}>
        <Decor src="amethyst-2" />
      </Floaty>
      <SectionHead
        eyebrow="Contact"
        title="Book a consultation"
        text="Twenty unhurried minutes with a LUMÉA skin guide — online or in our studio. Always free."
      />
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <Glass className="lg:col-span-7" inner="p-6 sm:p-9" seed={91} w={640}>
          {sent ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status" data-testid="booking-success">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-pearl text-ink">
                <Check size={30} aria-hidden="true" />
              </span>
              <h3 className="h-display mt-5 text-2xl font-bold">See you soon, {sent.name.trim().split(' ')[0]}</h3>
              <p className="mt-3 max-w-sm text-white">
                Your consultation request for{' '}
                <strong>{new Date(sent.date + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>{' '}
                is saved. We will confirm the time at <strong>{sent.email.trim()}</strong> within one working day.
              </p>
              <button type="button" className="btn btn-ghost mt-7" onClick={() => setSent(null)}>
                Book another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2" data-testid="booking-form">
              <Field id="bk-name" label="Name" error={errors.name}>
                <input id="bk-name" className="field" autoComplete="name" value={form.name} onChange={set('name')} {...aria('name')} />
              </Field>
              <Field id="bk-email" label="Email" error={errors.email}>
                <input id="bk-email" type="email" className="field" autoComplete="email" value={form.email} onChange={set('email')} {...aria('email')} />
              </Field>
              <Field id="bk-date" label="Preferred date" error={errors.date}>
                <input id="bk-date" type="date" min={today()} className="field" value={form.date} onChange={set('date')} {...aria('date')} />
              </Field>
              <Field id="bk-skin" label="Skin type" error={errors.skin}>
                <select id="bk-skin" className="field" value={form.skin} onChange={set('skin')} {...aria('skin')}>
                  <option value="">Select…</option>
                  {skinTypes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                  <option>Not sure</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field id="bk-comment" label="Anything we should know?" error={errors.comment} optional>
                  <textarea id="bk-comment" rows={4} className="field resize-y" value={form.comment} onChange={set('comment')} {...aria('comment')} />
                </Field>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button type="submit" className="btn btn-light" data-testid="booking-submit">
                  Request consultation
                </button>
                <p className="text-sm text-white">We reply within one working day.</p>
              </div>
            </form>
          )}
        </Glass>

        <Glass className="lg:col-span-5" inner="space-y-7 p-6 sm:p-9" seed={93} w={440} delay={0.1}>
          <div>
            <h3 className="font-display text-base font-medium uppercase">The studio</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3">
                <MapPin size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
                <address className="not-italic">14 Rue des Dunes, 13007 Marseille, France</address>
              </li>
              <li className="flex gap-3">
                <Clock size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>Tue – Sat, 10:00 – 19:00</span>
              </li>
              <li className="flex gap-3">
                <Mail size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
                <a href="mailto:hello@lumea.example" className="underline underline-offset-4">
                  hello@lumea.example
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-base font-medium uppercase">Follow the glow</h3>
            <ul className="mt-4 flex gap-3">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/', icon: <Instagram /> },
                { label: 'TikTok', href: 'https://www.tiktok.com/', icon: <Music2 size={20} aria-hidden="true" /> },
                { label: 'Pinterest', href: 'https://www.pinterest.com/', icon: <Pin size={20} aria-hidden="true" /> },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="glass-chip grid h-12 w-12 place-items-center rounded-full transition-transform hover:-translate-y-1"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-base font-medium uppercase">Glow letter</h3>
            <p className="mt-2 mb-4 text-white">Rituals, restocks and 10% off your first order.</p>
            <Newsletter />
          </div>
        </Glass>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative isolate mt-10 overflow-hidden pt-40 pb-8 text-ink">
      <picture>
        <source media="(max-width: 767px)" srcSet="/img/dunes-m.webp" />
        <img
          src="/img/dunes.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="dunes-mask pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-bottom"
        />
      </picture>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <Logo className="text-ink" />
          <p className="mt-2 text-sm font-semibold">Glow, powered by nature</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-1 gap-y-1">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold hover:bg-white/50">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#home" className="btn btn-ink" data-testid="to-top">
          <ArrowUp size={18} aria-hidden="true" /> Back to top
        </a>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-sm font-medium sm:px-6">
        © {YEAR} LUMÉA. A fictional brand created as a portfolio case study. Photography via Unsplash.
      </p>
    </footer>
  )
}
