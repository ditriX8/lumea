// Dev helper: download + optimise background photos, crop the pearl, drop rejected cut-outs.
// usage: node scripts/assets.mjs <rawDir> <previewFile>
import sharp from 'sharp'
import { writeFile, readFile, access, rm } from 'node:fs/promises'
import path from 'node:path'

const [rawDir, previewFile] = process.argv.slice(2)

async function raw(name, id, w = 2200) {
  const p = path.join(rawDir, name + '.jpg')
  try {
    await access(p)
  } catch {
    const r = await fetch(`https://images.unsplash.com/${id}?w=${w}&q=85&fm=jpg`)
    if (!r.ok) throw new Error(name + ' ' + r.status)
    await writeFile(p, Buffer.from(await r.arrayBuffer()))
  }
  return readFile(p)
}

const sky = await raw('sky', 'photo-1460411794035-42aac080490a')
const sand = await raw('sand', 'photo-1488197047962-b48492212cda')

const out = async (buf, w, h, file, q = 70, position = 'centre') => {
  const i = await sharp(buf).resize(w, h, { fit: 'cover', position }).webp({ quality: q }).toFile('public/img/' + file)
  console.log(file, i.width + 'x' + i.height, Math.round(i.size / 1024) + 'KB')
}
await out(sky, 1920, 1200, 'sky.webp', 68)
await out(sky, 800, 1400, 'sky-m.webp', 62)

await out(await sharp(sand).modulate({ brightness: 1.08, saturation: 0.8 }).tint({ r: 255, g: 232, b: 226 }).toBuffer(), 1920, 640, 'dunes.webp', 62, 'bottom')
await out(await sharp(sand).modulate({ brightness: 1.08, saturation: 0.8 }).tint({ r: 255, g: 232, b: 226 }).toBuffer(), 900, 420, 'dunes-m.webp', 60, 'bottom')

// pearl: photo texture of a real pearl, soft-lit over a pearl-white gradient, round mask
try {
  const src = path.join(rawDir, 'pearl-cut.webp')
  try {
    await access(src)
  } catch {
    await writeFile(src, await readFile('public/img/pearl.webp'))
  }
  const S = 176
  const c = S / 2
  const base = Buffer.from(
    `<svg width="${S}" height="${S}"><defs><radialGradient id="g" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#fffdfb"/><stop offset=".45" stop-color="#f6e6e6"/><stop offset=".8" stop-color="#d9bcc9"/><stop offset="1" stop-color="#a98bab"/></radialGradient></defs><circle cx="${c}" cy="${c}" r="${c - 3}" fill="url(#g)"/></svg>`,
  )
  const mask = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${c}" cy="${c}" r="${c - 3}" fill="#fff"/></svg>`)
  const tex = await sharp(src).extract({ left: 172, top: 246, width: S, height: S }).greyscale().normalise().removeAlpha().png().toBuffer()
  const p = await sharp(base)
    .composite([
      { input: tex, blend: 'soft-light' },
      { input: mask, blend: 'dest-in' },
    ])
    .webp({ quality: 88 })
    .toFile('public/img/pearl.webp')
  console.log('pearl', p.width, Math.round(p.size / 1024) + 'KB')
} catch (e) {
  console.log('pearl FAIL', String(e))
}

for (const f of ['amethyst-3', 'amethyst-point', 'bottle-white', 'rose-points', 'quartz-2'])
  await rm(`public/img/${f}.webp`, { force: true })

// preview
const a = await sharp('public/img/sky.webp').resize(900).toBuffer()
const b = a
const c = await sharp('public/img/dunes.webp').resize(900).toBuffer()
const d = await sharp('public/img/pearl.webp').resize(160).toBuffer()
await sharp({ create: { width: 1800, height: 920, channels: 3, background: '#b9a6d9' } })
  .composite([
    { input: a, left: 0, top: 0 },
    { input: b, left: 900, top: 0 },
    { input: c, left: 0, top: 564 },
    { input: d, left: 1000, top: 640 },
  ])
  .jpeg({ quality: 80 })
  .toFile(previewFile)
