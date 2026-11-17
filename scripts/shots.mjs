// Screenshots of the production preview. usage: node scripts/shots.mjs [url]
import { chromium, devices } from 'playwright-core'

const url = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ channel: 'chrome' })

async function shoot(name, ctxOpts) {
  const ctx = await browser.newContext(ctxOpts)
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `screenshots/${name}-hero.png` })
  const height = () => page.evaluate(() => document.documentElement.scrollHeight)
  let h = await height()
  const vh = page.viewportSize().height
  let i = 0
  for (let y = 0; y < h; y += Math.round(vh * 0.85)) {
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
    await page.waitForTimeout(900)
    if (i > 0) await page.screenshot({ path: `screenshots/${name}-${String(i).padStart(2, '0')}.png` })
    i++
    h = await height()
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(name, 'height', h, 'h-overflow', overflow, 'errors', errors.length, errors.slice(0, 5))
  await ctx.close()
}

await shoot('desktop', { viewport: { width: 1440, height: 900 } })
await shoot('mobile', { ...devices['iPhone 13'] })
await browser.close()
