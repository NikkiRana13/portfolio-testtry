// ═══════════════════════════════════════════════════════════════════════════════
//  Build-a-Bouquet — flower configuration
//
//  HOW TO:
//    Add a flower    → append an entry to FLOWERS
//    Change position → edit pos / mobilePos (viewport %, e.g. { top:'30%', right:'2%' })
//    Change page     → edit `page` + `matchMode` ('exact' | 'startsWith')
//    Bouquet layout  → edit bouquet { x, y, rotate } (0-100% within the flower area)
//    Artwork         → see sprites.tsx — each `type` has its own pixel grid + colors
//    Total count     → TOTAL_FLOWERS updates automatically
//    Hints on/off    → flip HINTS_ENABLED
// ═══════════════════════════════════════════════════════════════════════════════

export type FlowerType =
  | 'tulip' | 'daisy' | 'sunflower' | 'lavender' | 'rose'
  | 'cornflower' | 'poppy' | 'sprig' | 'cosmos' | 'violet'

export type FlowerDef = {
  id:         string
  name:       string       // displayed in tooltip & bouquet
  type:       FlowerType
  page:       string       // route to show this flower on
  matchMode:  'exact' | 'startsWith'
  // Viewport-relative position (fixed overlay). Use % for responsiveness.
  pos:        { top?: string; bottom?: string; left?: string; right?: string }
  // Override position on screens < 640px. Flower peeks from edge (e.g. right: '-6px').
  mobilePos?: { top?: string; bottom?: string; left?: string; right?: string }
  // Where this flower sits inside the bouquet arrangement (0–100 of the flower area).
  bouquet:    { x: number; y: number; rotate: number }
}

// ─── Flower definitions ────────────────────────────────────────────────────────
// Positioned to sit at page edges, well clear of nav (top ~60px) and
// the bouquet button (bottom-right corner).

export const FLOWERS: FlowerDef[] = [

  // ── HOME (/): two flowers ────────────────────────────────────────────────────
  {
    id: 'tulip-home',
    name: 'Pink Tulip',
    type: 'tulip',
    page: '/', matchMode: 'exact',
    pos:       { top: '28%', right: '2%' },
    mobilePos: { top: '26%', right: '-6px' },
    bouquet: { x: 50, y: 4, rotate: -4 },
  },
  {
    id: 'daisy-home',
    name: 'White Daisy',
    type: 'daisy',
    page: '/', matchMode: 'exact',
    pos:       { bottom: '22%', left: '2%' },
    mobilePos: { bottom: '22%', left: '-6px' },
    bouquet: { x: 28, y: 16, rotate: -18 },
  },

  // ── PORTFOLIO (/portfolio) ───────────────────────────────────────────────────
  {
    id: 'sunflower-portfolio',
    name: 'Sunflower',
    type: 'sunflower',
    page: '/portfolio', matchMode: 'exact',
    pos:       { top: '32%', right: '2%' },
    mobilePos: { top: '30%', right: '-6px' },
    bouquet: { x: 67, y: 9, rotate: 11 },
  },
  {
    id: 'lavender-portfolio',
    name: 'Purple Lavender',
    type: 'lavender',
    page: '/portfolio', matchMode: 'exact',
    pos:       { bottom: '25%', right: '2%' },
    mobilePos: { bottom: '25%', right: '-6px' },
    bouquet: { x: 14, y: 28, rotate: -32 },
  },

  // ── PROJECT PAGES (/projects/*): appear on any project detail page ───────────
  {
    id: 'rose-project',
    name: 'Red Rose',
    type: 'rose',
    page: '/projects', matchMode: 'startsWith',
    pos:       { top: '40%', left: '2%' },
    mobilePos: { top: '40%', left: '-6px' },
    bouquet: { x: 46, y: 21, rotate: 4 },
  },
  {
    id: 'cornflower-project',
    name: 'Blue Cornflower',
    type: 'cornflower',
    page: '/projects', matchMode: 'startsWith',
    pos:       { bottom: '30%', right: '2%' },
    mobilePos: { bottom: '30%', right: '-6px' },
    bouquet: { x: 78, y: 19, rotate: 22 },
  },

  // ── BLOG (/blog + /blog/*) ───────────────────────────────────────────────────
  {
    id: 'cosmos-blog',
    name: 'Pink Cosmos',
    type: 'cosmos',
    page: '/blog', matchMode: 'startsWith',
    pos:       { top: '30%', right: '2%' },
    mobilePos: { top: '30%', right: '-6px' },
    bouquet: { x: 34, y: 7, rotate: -11 },
  },
  {
    id: 'poppy-blog',
    name: 'Orange Poppy',
    type: 'poppy',
    page: '/blog', matchMode: 'startsWith',
    pos:       { bottom: '22%', left: '2%' },
    mobilePos: { bottom: '22%', left: '-6px' },
    bouquet: { x: 8, y: 38, rotate: -42 },
  },

  // ── GAMES (/games + /games/*) ────────────────────────────────────────────────
  {
    id: 'sprig-games',
    name: 'Green Sprig',
    type: 'sprig',
    page: '/games', matchMode: 'startsWith',
    pos:       { top: '35%', left: '2%' },
    mobilePos: { top: '35%', left: '-6px' },
    bouquet: { x: 87, y: 31, rotate: 28 },
  },
  {
    id: 'violet-games',
    name: 'Purple Violet',
    type: 'violet',
    page: '/games', matchMode: 'startsWith',
    pos:       { bottom: '28%', left: '2%' },
    mobilePos: { bottom: '28%', left: '-6px' },
    bouquet: { x: 61, y: 26, rotate: 15 },
  },
]

// ─── Global settings ──────────────────────────────────────────────────────────

export const TOTAL_FLOWERS    = FLOWERS.length
export const HINTS_ENABLED    = true   // show page hints in the bouquet panel
export const LS_KEY           = 'bouquet-v1'
export const COMPLETION_MESSAGE =
  'A bouquet for making it all the way through. 🌸'

// Human-readable page labels used in hints
export const PAGE_LABELS: Record<string, string> = {
  '/':          'the Home page',
  '/portfolio': 'the Portfolio',
  '/projects':  'a Project page',
  '/blog':      'the Blog',
  '/games':     'the Games section',
}
