// Scenario checks against the production preview. usage: node scripts/e2e.mjs [url]
import { chromium, devices } from 'playwright-core'

const url = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ channel: 'chrome' })
let failed = 0
const check = (name, ok, extra = '') => {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}
const watch = (page, errors) => {
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
}
const top = (page, sel) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), sel)

/* ───────── desktop ───────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  watch(page, errors)
  await page.goto(url, { waitUntil: 'networkidle' })

  const blur = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.glass-bg'))
    return cs.backdropFilter || cs.webkitBackdropFilter
  })
  check('glass backdrop-filter survives the production build', /blur\(/.test(blur), blur)

  await page.click('header nav a[href="#products"]')
  await page.waitForTimeout(1200)
  const t = await top(page, '#products')
  check('anchor scroll lands below the header', t >= 60 && t <= 140, `section top ${t}px`)

  await page.click('[data-testid=filter-serums]')
  check('filter: serums → 3 cards', (await page.locator('[data-testid=product-card]').count()) === 3)
  await page.click('[data-testid=filter-oils]')
  check('filter: oils → 2 cards', (await page.locator('[data-testid=product-card]').count()) === 2)
  await page.click('[data-testid=filter-all]')
  check('filter: all → 8 cards', (await page.locator('[data-testid=product-card]').count()) === 8)

  const modal = page.locator('[data-testid=product-modal]')
  const first = page.locator('[data-testid=product-card] button').first()
  await first.click()
  await modal.waitFor()
  check('modal opens with product title', (await modal.locator('#modal-title').innerText()).toLowerCase().includes('rose glow'))
  await page.keyboard.press('Escape')
  await modal.waitFor({ state: 'detached' })
  check('modal closes on Esc', true)
  await first.click()
  await modal.waitFor()
  await page.mouse.click(10, 450)
  await modal.waitFor({ state: 'detached' })
  check('modal closes on backdrop click', true)
  await first.click()
  await page.click('[data-testid=add-to-bag]')
  check('add to bag → counter 1', (await page.locator('[data-testid=cart-count]').innerText()) === '1')
  await page.keyboard.press('Escape')
  await modal.waitFor({ state: 'detached' })

  const drawer = page.locator('[data-testid=cart-drawer]')
  await page.click('[data-testid=cart-button]')
  await drawer.waitFor()
  await drawer.locator('button[aria-label^="Increase"]').click()
  check('cart: quantity 2', (await drawer.locator('[data-testid=cart-qty]').innerText()) === '2')
  check('cart: total €96', (await drawer.locator('[data-testid=cart-total]').innerText()).replace(/\s/g, '') === '€96')
  await drawer.locator('button[aria-label^="Decrease"]').click()
  check('cart: total €48 after decrease', (await drawer.locator('[data-testid=cart-total]').innerText()).replace(/\s/g, '') === '€48')
  await page.keyboard.press('Escape')
  await drawer.waitFor({ state: 'detached' })
  check('cart closes on Esc', true)
  await page.reload({ waitUntil: 'networkidle' })
  check('cart persists after reload', (await page.locator('[data-testid=cart-count]').innerText()) === '1')

  await page.locator('#rituals').scrollIntoViewIfNeeded()
  await page.click('[data-testid=choice-Dry]')
  await page.click('[data-testid=choice-Hydration]')
  check('routine: hydration bar 96%', (await page.locator('[data-testid=bar-Hydration]').innerText()) === '96%')
  await page.click('[data-testid=choice-Oily]')
  await page.click('[data-testid=choice-Anti-age]')
  check('routine: radiance bar 93%', (await page.locator('[data-testid=bar-Radiance]').innerText()) === '93%')
  let allThree = true
  for (const s of ['Dry', 'Oily', 'Combination', 'Sensitive'])
    for (const g of ['Hydration', 'Glow', 'Anti-age']) {
      await page.click(`[data-testid=choice-${s}]`)
      await page.click(`[data-testid=choice-${g}]`)
      if ((await page.locator('[data-testid=routine-set] li').count()) !== 3) allThree = false
    }
  check('routine: every combination recommends 3 products', allThree)
  await page.click('[data-testid=add-set]')
  await drawer.waitFor()
  check('routine: set added to bag (4 items)', (await page.locator('[data-testid=cart-count]').innerText()) === '4')
  await drawer.locator('[data-testid=checkout]').click()
  check('checkout shows demo confirmation', await drawer.getByText('Thank you').isVisible())
  await page.keyboard.press('Escape')
  await drawer.waitFor({ state: 'detached' })

  await page.locator('#ingredients').scrollIntoViewIfNeeded()
  await page.locator('[data-testid=crystal-card]').first().scrollIntoViewIfNeeded()
  await page.locator('[data-testid=crystal-card]').first().click()
  check('ingredient card expands', (await page.locator('[data-testid=crystal-card]').first().getAttribute('aria-expanded')) === 'true')

  await page.locator('#reviews').scrollIntoViewIfNeeded()
  await page.locator('[data-testid=reviews-next]').scrollIntoViewIfNeeded()
  const x0 = await page.locator('[data-testid=reviews-track]').evaluate((e) => e.getBoundingClientRect().left)
  await page.click('[data-testid=reviews-next]')
  await page.waitForTimeout(900)
  const x1 = await page.locator('[data-testid=reviews-track]').evaluate((e) => e.getBoundingClientRect().left)
  check('reviews slider moves', x1 < x0 - 100, `${Math.round(x0)} → ${Math.round(x1)}`)

  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.locator('[data-testid=booking-form]').scrollIntoViewIfNeeded()
  await page.click('[data-testid=booking-submit]')
  check('form: empty submit shows 4 errors', (await page.locator('[data-testid^=error-bk]').count()) === 4)
  await page.fill('#bk-name', 'Anna Test')
  await page.fill('#bk-email', 'not-an-email')
  await page.fill('#bk-date', '2031-05-20')
  await page.selectOption('#bk-skin', 'Dry')
  await page.click('[data-testid=booking-submit]')
  check('form: invalid email is rejected', (await page.locator('[data-testid^=error-bk]').count()) === 1)
  await page.fill('#bk-email', 'anna@example.com')
  await page.click('[data-testid=booking-submit]')
  await page.locator('[data-testid=booking-success]').waitFor()
  check('form: success screen greets by name', (await page.locator('[data-testid=booking-success]').innerText()).includes('ANNA') || (await page.locator('[data-testid=booking-success]').innerText()).includes('Anna'))
  check('form: booking saved to localStorage', await page.evaluate(() => JSON.parse(localStorage.getItem('lumea:bookings')).length === 1))

  await page.fill('#nl-email', 'nope')
  await page.click('[data-testid=newsletter] button')
  check('newsletter: invalid email error', await page.locator('#nl-error').isVisible())
  await page.fill('#nl-email', 'anna@example.com')
  await page.click('[data-testid=newsletter] button')
  check('newsletter: success state', await page.locator('[data-testid=newsletter-done]').isVisible())

  await page.click('[data-testid=to-top]')
  await page.waitForTimeout(1500)
  check('back to top', (await page.evaluate(() => window.scrollY)) < 5)
  check('desktop: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '))
  await ctx.close()
}

/* ───────── widths ───────── */
for (const w of [360, 768, 1024, 1440, 1920]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(300)
  const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  check(`no horizontal overflow at ${w}px`, o <= 0, `overflow ${o}px`)
  await ctx.close()
}

/* ───────── mobile ───────── */
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  const errors = []
  watch(page, errors)
  await page.goto(url, { waitUntil: 'networkidle' })
  const menu = page.locator('#mobile-menu')
  await page.tap('[data-testid=menu-button]')
  await menu.waitFor()
  check('mobile menu opens full-screen', (await menu.boundingBox()).height >= page.viewportSize().height - 1)
  await page.keyboard.press('Escape')
  await menu.waitFor({ state: 'detached' })
  check('mobile menu closes on Esc', true)
  await page.tap('[data-testid=menu-button]')
  await menu.locator('a[href="#rituals"]').tap()
  await menu.waitFor({ state: 'detached' })
  await page.waitForTimeout(1500)
  const t = await top(page, '#rituals')
  check('mobile menu link closes menu and scrolls', t >= 40 && t <= 140, `section top ${t}px`)
  check('mobile: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '))
  await ctx.close()
}

await browser.close()
console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
