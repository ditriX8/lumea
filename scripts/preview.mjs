// Dev helper: contact sheet of the cut-out webp files on a pastel background.
// usage: node scripts/preview.mjs <outFile>
import sharp from 'sharp'
import { readdir } from 'node:fs/promises'

const out = process.argv[2]
const files = (await readdir('public/img')).filter((f) => f.endsWith('.webp')).sort()
const T = 260
const COLS = 6
const tiles = await Promise.all(
  files.map(async (f, i) => {
    const img = await sharp('public/img/' + f).resize(T - 30, T - 50, { fit: 'inside' }).png().toBuffer()
    const label = Buffer.from(
      `<svg width="${T}" height="24"><text x="6" y="17" font-size="14" font-family="Arial" fill="#333">${f.replace('.webp', '')}</text></svg>`,
    )
    return {
      left: (i % COLS) * T,
      top: Math.floor(i / COLS) * T,
      input: await sharp({ create: { width: T, height: T, channels: 4, background: i % 2 ? '#f3d9e6' : '#d9d3f3' } })
        .composite([{ input: img, gravity: 'center' }, { input: label, top: 0, left: 0 }])
        .png()
        .toBuffer(),
    }
  }),
)
await sharp({ create: { width: COLS * T, height: Math.ceil(files.length / COLS) * T, channels: 3, background: '#fff' } })
  .composite(tiles)
  .jpeg({ quality: 80 })
  .toFile(out)
console.log(files.length, 'files')
