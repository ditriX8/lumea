// Dev helper: download Unsplash thumbnails and build numbered contact sheets.
// usage: node scripts/sheet.mjs <outDir> <json-file>
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const [outDir, jsonFile] = process.argv.slice(2)
const groups = JSON.parse(await readFile(jsonFile, 'utf8'))
await mkdir(outDir, { recursive: true })
const T = 200
const COLS = 7

for (const [name, ids] of Object.entries(groups)) {
  const tiles = await Promise.all(
    ids.map(async (id, i) => {
      try {
        const r = await fetch(`https://images.unsplash.com/${id}?w=${T}&h=${T}&fit=crop&q=60&fm=jpg`)
        if (!r.ok) throw new Error(String(r.status))
        const buf = Buffer.from(await r.arrayBuffer())
        const label = Buffer.from(
          `<svg width="${T}" height="${T}"><rect width="34" height="24" fill="black"/><text x="5" y="18" font-size="16" font-family="Arial" fill="white">${i}</text></svg>`,
        )
        return await sharp(buf).resize(T, T).composite([{ input: label }]).jpeg().toBuffer()
      } catch {
        return await sharp({ create: { width: T, height: T, channels: 3, background: '#400' } }).jpeg().toBuffer()
      }
    }),
  )
  const rows = Math.ceil(tiles.length / COLS)
  await sharp({ create: { width: COLS * T, height: rows * T, channels: 3, background: '#fff' } })
    .composite(tiles.map((input, i) => ({ input, left: (i % COLS) * T, top: Math.floor(i / COLS) * T })))
    .jpeg({ quality: 70 })
    .toFile(path.join(outDir, `${name}.jpg`))
  console.log(name, ids.length)
}
