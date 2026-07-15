'use client'
import { FlowerType } from 'app/content/flowers'

// ─── Shared grid renderer ────────────────────────────────────────────────────
// 7 cols × 10 rows, CELL px per cell → 21×30 px sprite canvas

const CELL = 3
const COLS = 7
const ROWS = 10
const _ = 0 as const

type CK = string
type Grid = (CK | 0)[][]

function PixelGrid({ grid, colors }: { grid: Grid; colors: Record<string, string> }) {
  return (
    <>
      {grid.flatMap((row, r) =>
        row.map((cell, c) =>
          cell !== 0 ? (
            <rect
              key={`${r}-${c}`}
              x={c * CELL}
              y={r * CELL}
              width={CELL}
              height={CELL}
              fill={colors[cell as string]}
              shapeRendering="crispEdges"
            />
          ) : null
        )
      )}
    </>
  )
}

// ─── Sprite data (7×10 grids) ────────────────────────────────────────────────

const SPRITES: Record<FlowerType, { grid: Grid; colors: Record<string, string> }> = {

  // ── Pink Tulip ───────────────────────────────────────────────────────────────
  tulip: {
    grid: [
      [_,_,'P','P','P',_,_],
      [_,'P','P','C','P','P',_],
      ['P','P','C','C','C','P','P'],
      ['P','P','C','C','C','P','P'],
      [_,'P','P','C','P','P',_],
      [_,_,'P','P','P',_,_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { P: '#f9a8d4', C: '#fce7f3', S: '#16a34a', L: '#15803d' },
  },

  // ── White Daisy ──────────────────────────────────────────────────────────────
  daisy: {
    grid: [
      [_,'W',_,_,_,'W',_],
      ['W','W',_,_,_,'W','W'],
      [_,_,'W','Y','W',_,_],
      [_,'W','Y','Y','Y','W',_],
      [_,_,'W','Y','W',_,_],
      ['W','W',_,_,_,'W','W'],
      [_,'W',_,_,_,'W',_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S','L',_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { W: '#f8fafc', Y: '#eab308', S: '#16a34a', L: '#15803d' },
  },

  // ── Sunflower ────────────────────────────────────────────────────────────────
  sunflower: {
    grid: [
      [_,'Y',_,'Y',_,'Y',_],
      ['Y',_,'Y','Y','Y',_,'Y'],
      [_,'Y','Y','B','Y','Y',_],
      ['Y','Y','B','B','B','Y','Y'],
      [_,'Y','Y','B','Y','Y',_],
      ['Y',_,'Y','Y','Y',_,'Y'],
      [_,'Y',_,'Y',_,'Y',_],
      [_,_,_,'S',_,_,_],
      [_,'L',_,'S',_,'L',_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { Y: '#fbbf24', B: '#78350f', S: '#16a34a', L: '#15803d' },
  },

  // ── Purple Lavender ──────────────────────────────────────────────────────────
  lavender: {
    grid: [
      [_,'P',_,'P',_,'P',_],
      [_,'P','P','P','P','P',_],
      ['P','P','P','P','P','P',_],
      [_,'P','P','P','P','P',_],
      [_,_,'P','P','P',_,_],
      [_,_,_,'S',_,_,_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,_,'S',_,_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { P: '#c084fc', S: '#65a30d', L: '#4d7c0f' },
  },

  // ── Red Rose ─────────────────────────────────────────────────────────────────
  rose: {
    grid: [
      [_,_,'R','R','R',_,_],
      [_,'R','R','D','R','R',_],
      ['R','R','D','D','D','R','R'],
      ['R','D','D','R','D','D','R'],
      ['R','R','D','D','D','R','R'],
      [_,'R','R','R','R','R',_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { R: '#f87171', D: '#b91c1c', S: '#16a34a', L: '#15803d' },
  },

  // ── Blue Cornflower ──────────────────────────────────────────────────────────
  cornflower: {
    grid: [
      [_,_,'B','B','B',_,_],
      [_,'B','B','B','B','B',_],
      ['B','B','B','W','B','B','B'],
      ['B','B','W','W','W','B','B'],
      ['B','B','B','W','B','B','B'],
      [_,'B','B','B','B','B',_],
      [_,_,'B','B','B',_,_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S','L',_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { B: '#60a5fa', W: '#fce7f3', S: '#16a34a', L: '#15803d' },
  },

  // ── Orange Poppy ─────────────────────────────────────────────────────────────
  poppy: {
    grid: [
      [_,'O','O','O','O','O',_],
      ['O','O','O','O','O','O','O'],
      ['O','O','K','K','K','O','O'],
      ['O','O','K','K','K','O','O'],
      ['O','O','K','K','K','O','O'],
      ['O','O','O','O','O','O','O'],
      [_,'O','O','O','O','O',_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { O: '#fb923c', K: '#1c1917', S: '#16a34a', L: '#15803d' },
  },

  // ── Green Sprig ──────────────────────────────────────────────────────────────
  sprig: {
    grid: [
      [_,_,_,'G',_,_,_],
      [_,_,'G','G','G',_,_],
      [_,'G','G','G','G','G',_],
      ['G','G',_,'S',_,'G','G'],
      [_,_,_,'S',_,_,_],
      [_,_,'G','S',_,_,_],
      [_,_,'G','S','G',_,_],
      [_,_,_,'S',_,_,_],
      [_,_,_,'S',_,_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { G: '#4ade80', S: '#15803d' },
  },

  // ── Pink Cosmos ──────────────────────────────────────────────────────────────
  cosmos: {
    grid: [
      ['P',_,_,'P',_,_,'P'],
      [_,'M','M','M','M','M',_],
      [_,'M','Y','Y','Y','M',_],
      ['P','M','Y','Y','Y','M','P'],
      [_,'M','Y','Y','Y','M',_],
      [_,'M','M','M','M','M',_],
      ['P',_,_,'P',_,_,'P'],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S',_,_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { P: '#f472b6', M: '#f9a8d4', Y: '#eab308', S: '#16a34a', L: '#15803d' },
  },

  // ── Purple Violet ────────────────────────────────────────────────────────────
  violet: {
    grid: [
      [_,_,'V','V','V',_,_],
      [_,'V','V','V','V','V',_],
      ['V','V','V','W','V','V','V'],
      ['V','V','W','W','W','V','V'],
      ['V','V','V','W','V','V','V'],
      [_,'V','V','V','V','V',_],
      [_,_,'V','V','V',_,_],
      [_,_,_,'S',_,_,_],
      [_,_,'L','S','L',_,_],
      [_,_,_,'S',_,_,_],
    ],
    colors: { V: '#a78bfa', W: '#fce7f3', S: '#16a34a', L: '#15803d' },
  },
}

// ─── Vase sprite (11×9 grid) — rendered in the bouquet panel ─────────────────
const VASE_GRID: Grid = [
  [_,_,'V','V','V','V','V','V','V',_,_],
  [_,_,'V',_,_,_,_,_,'V',_,_],
  [_,'V','V',_,_,_,_,_,'V','V',_],
  ['V','V',_,_,_,_,_,_,_,'V','V'],
  ['V','V',_,_,_,_,_,_,_,'V','V'],
  [_,'V','V',_,_,_,_,_,'V','V',_],
  [_,_,'V','V','V','V','V','V','V',_,_],
  [_,'B','B','B','B','B','B','B','B','B',_],
  [_,'B','B','B','B','B','B','B','B','B',_],
]
const VASE_COLS = 11
const VASE_ROWS = 9
const VASE_CELL = 4
const VASE_COLORS = { V: '#B3446C', B: '#7f1d3e' }

// ─── Exports ─────────────────────────────────────────────────────────────────

/** Renders one pixel-art flower sprite as an inline SVG. */
export function FlowerSVG({ type, size = 1 }: { type: FlowerType; size?: number }) {
  const s = SPRITES[type]
  const w = COLS * CELL * size
  const h = ROWS * CELL * size
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      aria-hidden="true"
      style={{ imageRendering: 'pixelated' }}
    >
      <PixelGrid grid={s.grid} colors={s.colors} />
    </svg>
  )
}

/** Renders the pixel-art vase for the bouquet panel. */
export function VaseSVG() {
  return (
    <svg
      width={VASE_COLS * VASE_CELL}
      height={VASE_ROWS * VASE_CELL}
      viewBox={`0 0 ${VASE_COLS * VASE_CELL} ${VASE_ROWS * VASE_CELL}`}
      aria-hidden="true"
      style={{ imageRendering: 'pixelated' }}
    >
      {VASE_GRID.flatMap((row, r) =>
        row.map((cell, c) =>
          cell !== 0 ? (
            <rect
              key={`${r}-${c}`}
              x={c * VASE_CELL}
              y={r * VASE_CELL}
              width={VASE_CELL}
              height={VASE_CELL}
              fill={VASE_COLORS[cell as 'V' | 'B']}
              shapeRendering="crispEdges"
            />
          ) : null
        )
      )}
    </svg>
  )
}

/** Width of a flower sprite at scale 1. */
export const SPRITE_W = COLS * CELL
/** Height of a flower sprite at scale 1. */
export const SPRITE_H = ROWS * CELL
