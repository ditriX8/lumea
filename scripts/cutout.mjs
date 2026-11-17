// Dev helper: download Unsplash photos, remove background in headless Chrome
// (@imgly/background-removal), trim and save as webp into public/img.
// usage: node scripts/cutout.mjs <rawDir> [name ...]   (vite dev must run on :5199)
import { chromium } from 'playwright-core'
import sharp from 'sharp'
import { mkdir, writeFile, readFile, access } from 'node:fs/promises'
import path from 'node:path'

const ITEMS = {
  'rose-1': 'photo-1611480366736-1c6cee91a017',
  'rose-2': 'photo-1611480367081-03e93cccefd6',
  'rose-3': 'photo-1593259213062-57b0ce5906cf',
  'rose-points': 'photo-1627369457632-5146d262af69',
  'amethyst-1': 'photo-1715584183138-712f47189b73',
  'amethyst-2': 'photo-1626470408813-f0059745d58b',
  'amethyst-3': 'photo-1550007436-ba84ff7bcb54',
  'amethyst-point': 'photo-1636392513208-4406a066b87b',
  'quartz-1': 'photo-1652118845347-ca085010a5e1',
  'quartz-2': 'photo-1652118845236-d6937a3b3c4a',
  'bottle-clear': 'photo-1710410815589-dd83514104d0',
  'bottle-gold': 'photo-1781346325200-61cef7b29d76',
  'bottle-oil': 'photo-1741896135512-084b251887f7',
  'bottle-pink': 'photo-1676839574523-54ad8dbaf5b7',
  'bottle-white': 'photo-1576426863848-c21f53c60b19',
  'bottle-amber': 'photo-1690368892771-566e77c3b352',
  'bottle-black': 'photo-1573575154488-f88a60e170df',
  pearl: 'photo-1611444111920-89dfc4a01f43',
}

const [rawDir, ...only] = process.argv.slice(2)
await mkdir(rawDir, { recursive: true })
await mkdir('public/img', { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
page.on('console', (m) => console.log('[page]', m.text().slice(0, 200)))
await page.goto('http://localhost:5199/scripts/cutout.html')
await page.waitForFunction('window.ready === true', null, { timeout: 60000 })

for (const [name, id] of Object.entries(ITEMS)) {
  if (only.length && !only.includes(name)) continue
  const rawPath = path.join(rawDir, name + '.jpg')
  try {
    await access(rawPath)
  } catch {
    const r = await fetch(`https://images.unsplash.com/${id}?w=1100&q=85&fm=jpg`)
    if (!r.ok) {
      console.log('FAIL download', name, r.status)
      continue
    }
    await writeFile(rawPath, Buffer.from(await r.arrayBuffer()))
  }
  const raw = await readFile(rawPath); console.log('cutting', name, raw.length)
  try {
    const out = await page.evaluate((d) => window.cut(d), 'data:image/jpeg;base64,' + raw.toString('base64'))
    const png = Buffer.from(out.split(',')[1], 'base64')
    const info = await sharp(png)
      .trim({ threshold: 12 })
      .resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(`public/img/${name}.webp`)
    console.log('ok', name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB')
  } catch (e) {
    console.log('FAIL cut', name, String(e).slice(0, 300))
  }
}
await browser.close()
