export type Category = 'serums' | 'elixirs' | 'oils'

export type Product = {
  id: string
  name: string
  category: Category
  price: number
  volume: string
  bottle: string
  crystal: string
  crystalName: string
  tagline: string
  description: string
  ingredients: string[]
  ritual: string
}

const img = (n: string) => `/img/${n}.webp`

export const products: Product[] = [
  {
    id: 'rose-glow',
    name: 'Rose Glow Serum',
    category: 'serums',
    price: 48,
    volume: '30 ml',
    bottle: img('bottle-pink'),
    crystal: img('rose-1'),
    crystalName: 'rose quartz',
    tagline: 'Dewy, rosy, lit-from-within',
    description:
      'A silky daily serum with micro-milled rose quartz and damask rose water. It melts in within seconds and leaves a soft, rosy sheen that lasts all day.',
    ingredients: ['Rose quartz powder', 'Damask rose water', 'Niacinamide 5%', 'Squalane', 'Vitamin E'],
    ritual: 'Press 3–4 drops into clean skin, morning and evening.',
  },
  {
    id: 'amethyst-elixir',
    name: 'Amethyst Elixir',
    category: 'elixirs',
    price: 62,
    volume: '30 ml',
    bottle: img('bottle-black'),
    crystal: img('amethyst-1'),
    crystalName: 'amethyst',
    tagline: 'Overnight calm for tired skin',
    description:
      'Our evening elixir pairs amethyst extract with bakuchiol and lavender to smooth, soften and quiet the skin while you sleep.',
    ingredients: ['Amethyst extract', 'Bakuchiol 1%', 'Lavender hydrosol', 'Peptide complex', 'Jojoba oil'],
    ritual: 'Massage 4 drops over face and neck as the last step of your evening ritual.',
  },
  {
    id: 'crystal-essence',
    name: 'Crystal Essence',
    category: 'elixirs',
    price: 54,
    volume: '50 ml',
    bottle: img('bottle-gold'),
    crystal: img('quartz-1'),
    crystalName: 'clear quartz',
    tagline: 'A glass of water for your skin',
    description:
      'A weightless first-step essence infused with clear quartz and three weights of hyaluronic acid. Preps skin so everything after it works harder.',
    ingredients: ['Clear quartz water', 'Hyaluronic acid', 'Aloe vera juice', 'Panthenol', 'White tea extract'],
    ritual: 'Pat a few drops onto damp skin after cleansing, before serum.',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour Oil',
    category: 'oils',
    price: 52,
    volume: '30 ml',
    bottle: img('bottle-oil'),
    crystal: img('rose-3'),
    crystalName: 'rose quartz',
    tagline: 'Sunset glow, bottled',
    description:
      'A featherlight blend of rosehip, sea buckthorn and marula oils that seals in moisture and leaves a warm, golden finish — never greasy.',
    ingredients: ['Rosehip oil', 'Sea buckthorn oil', 'Marula oil', 'Rose quartz powder', 'Vitamin C ester'],
    ritual: 'Warm 2–3 drops between palms and press over moisturiser.',
  },
  {
    id: 'quartz-dew',
    name: 'Quartz Dew Serum',
    category: 'serums',
    price: 44,
    volume: '30 ml',
    bottle: img('bottle-clear'),
    crystal: img('rose-2'),
    crystalName: 'rose quartz',
    tagline: 'Deep hydration, zero weight',
    description:
      'A water-light hydrating serum with quartz-filtered spring water, polyglutamic acid and oat ceramides. Plumps and comforts thirsty skin.',
    ingredients: ['Quartz-filtered water', 'Polyglutamic acid', 'Oat ceramides', 'Glycerin', 'Centella asiatica'],
    ritual: 'Apply 3 drops to damp skin and follow with moisturiser.',
  },
  {
    id: 'midnight-quartz',
    name: 'Midnight Quartz Oil',
    category: 'oils',
    price: 58,
    volume: '30 ml',
    bottle: img('bottle-amber'),
    crystal: img('amethyst-2'),
    crystalName: 'amethyst',
    tagline: 'Rich repair while you dream',
    description:
      'A restorative night oil with evening primrose, blue tansy and amethyst-charged botanicals. Wake up to skin that feels rested and velvety.',
    ingredients: ['Evening primrose oil', 'Blue tansy', 'Amethyst extract', 'Plant retinol', 'Chamomile'],
    ritual: 'Smooth 3 drops over skin as the final evening step.',
  },
  {
    id: 'pearl-veil',
    name: 'Pearl Veil Serum',
    category: 'serums',
    price: 56,
    volume: '30 ml',
    bottle: img('bottle-gold'),
    crystal: img('pearl'),
    crystalName: 'pearl',
    tagline: 'Soft-focus radiance',
    description:
      'Hydrolysed pearl and rice ferment blur and brighten for a soft-focus, porcelain finish. Beautiful alone, even better under make-up.',
    ingredients: ['Hydrolysed pearl', 'Rice ferment', 'Alpha-arbutin', 'Liquorice root', 'Hyaluronic acid'],
    ritual: 'Use 3 drops in the morning before SPF.',
  },
  {
    id: 'lavender-dusk',
    name: 'Lavender Dusk Elixir',
    category: 'elixirs',
    price: 58,
    volume: '30 ml',
    bottle: img('bottle-pink'),
    crystal: img('amethyst-2'),
    crystalName: 'amethyst',
    tagline: 'Your evening exhale',
    description:
      'A calming bi-phase elixir of lavender, oat and amethyst minerals that soothes redness and softens the day away. Shake to wake.',
    ingredients: ['Lavender flower water', 'Colloidal oat', 'Amethyst extract', 'Bisabolol', 'Sweet almond oil'],
    ritual: 'Shake, then press 4 drops into skin after cleansing.',
  },
]

export const categories: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'serums', label: 'Serums' },
  { id: 'elixirs', label: 'Elixirs' },
  { id: 'oils', label: 'Oils' },
]

export const byId = (id: string) => products.find((p) => p.id === id)!

/* ───── Routine builder ───── */
export const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive'] as const
export const goals = ['Hydration', 'Glow', 'Anti-age'] as const
export type Skin = (typeof skinTypes)[number]
export type Goal = (typeof goals)[number]

const base: Record<Goal, [number, number, number]> = {
  Hydration: [88, 60, 56],
  Glow: [62, 92, 74],
  'Anti-age': [70, 68, 90],
}
const mod: Record<Skin, [number, number, number]> = {
  Dry: [8, -4, 0],
  Oily: [-10, 4, 3],
  Combination: [-3, 2, 2],
  Sensitive: [2, -6, -4],
}
const core: Record<Goal, string[]> = {
  Hydration: ['crystal-essence', 'quartz-dew'],
  Glow: ['rose-glow', 'pearl-veil'],
  'Anti-age': ['amethyst-elixir', 'midnight-quartz'],
}
const finisher: Record<Skin, string[]> = {
  Dry: ['golden-hour', 'midnight-quartz', 'quartz-dew'],
  Oily: ['crystal-essence', 'quartz-dew', 'pearl-veil'],
  Combination: ['pearl-veil', 'rose-glow', 'crystal-essence'],
  Sensitive: ['lavender-dusk', 'quartz-dew', 'pearl-veil'],
}

export function buildRoutine(skin: Skin, goal: Goal) {
  const b = base[goal]
  const m = mod[skin]
  const [hydration, glow, radiance] = b.map((v, i) => Math.max(20, Math.min(100, v + m[i])))
  const ids = [...core[goal]]
  const extra = finisher[skin].find((id) => !ids.includes(id))
  if (extra) ids.push(extra)
  return { hydration, glow, radiance, products: ids.map(byId) }
}

/* ───── Content ───── */
export const crystals = [
  {
    name: 'Rose Quartz',
    img: img('rose-3'),
    note: 'The stone of softness',
    text: 'Micro-milled into an ultra-fine mineral powder that diffuses light for an instant rosy sheen.',
    props: ['Soft-focus glow', 'Silica-rich', 'Found in: Rose Glow, Golden Hour'],
  },
  {
    name: 'Amethyst',
    img: img('amethyst-1'),
    note: 'The stone of calm',
    text: 'Steeped for 28 days in botanical oils — our evening formulas are built around this slow infusion.',
    props: ['Evening rituals', 'Soothing blends', 'Found in: Amethyst Elixir, Lavender Dusk'],
  },
  {
    name: 'Clear Quartz',
    img: img('quartz-1'),
    note: 'The stone of clarity',
    text: 'We filter mountain spring water over raw quartz points before it becomes the base of our essences.',
    props: ['Mineral-rich water', 'Weightless hydration', 'Found in: Crystal Essence, Quartz Dew'],
  },
  {
    name: 'Pearl',
    img: img('pearl'),
    note: 'The gem of radiance',
    text: 'Hydrolysed freshwater pearl delivers amino acids and a porcelain, lit-from-within finish.',
    props: ['Amino acids', 'Brightening', 'Found in: Pearl Veil'],
  },
]

export const reviews = [
  {
    name: 'Elise M.',
    place: 'Lyon',
    product: 'Rose Glow Serum',
    text: 'I have stopped wearing foundation on weekends. My skin just looks awake — soft, even and a little bit pink in the best way.',
  },
  {
    name: 'Hanna K.',
    place: 'Copenhagen',
    product: 'Amethyst Elixir',
    text: 'The evening ritual is the calmest five minutes of my day. Two weeks in and the dry patches on my cheeks are simply gone.',
  },
  {
    name: 'Sofia R.',
    place: 'Lisbon',
    product: 'Crystal Essence',
    text: 'Feels like nothing, does everything. It layers under SPF without pilling and the bottle is too pretty to hide in a cabinet.',
  },
  {
    name: 'Marta D.',
    place: 'Milan',
    product: 'Golden Hour Oil',
    text: 'Finally an oil that does not sit on top of my skin. Three drops and I look like I just came back from holiday.',
  },
  {
    name: 'Ines B.',
    place: 'Amsterdam',
    product: 'Pearl Veil Serum',
    text: 'The routine builder suggested this for my combination skin and it was spot on. Sent my empty bottle back for a refill already.',
  },
]

export const nav = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#products', label: 'Products' },
  { href: '#rituals', label: 'Rituals' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
]
