'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
//  PixelGoose — decorative Easter egg
//
//  Mounted once in app/layout.tsx; visible site-wide but non-intrusive.
//  The goose peeks from the bottom edge (bow + face first), waddles, retreats.
//  It appears only after a delay and then on a randomised interval.
//
//  ┌─ HOW TO CONFIGURE ───────────────────────────────────────────────────────┐
//  │  ENABLED          → false to remove the goose from the site entirely     │
//  │  MIN/MAX_INTERVAL → seconds between appearances (randomised in-range)    │
//  │  FIRST_DELAY      → ms to wait before the very first appearance          │
//  │  VISIBLE_DURATION → ms the goose stays in view before it retreats        │
//  │  PIXEL_SIZE       → px per pixel-art cell (increase = bigger goose)      │
//  │  SPOTS            → entrance positions (all bottom-edge, safe corners)   │
//  │  PIXELS + COLORS  → swap both to replace with another character          │
//  └──────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════════

const ENABLED          = true    // ← set false to disable
const MIN_INTERVAL     = 20      // seconds (minimum time between appearances)
const MAX_INTERVAL     = 40      // seconds (maximum time between appearances)
const FIRST_DELAY      = 15_000  // ms — how long to wait on page load
const VISIBLE_DURATION = 4_000   // ms the goose stays fully visible
const PIXEL_SIZE       = 4       // px per grid cell — increase for a larger goose

// Entrance spots: goose always rises from the bottom edge of the viewport.
// 'side' = 'left' | 'right'; 'offset' = px inset from that edge.
// All positions stay well clear of nav, cards, and text.
const SPOTS = [
  { side: 'left'  as const, offset: 60  },
  { side: 'right' as const, offset: 60  },
  { side: 'left'  as const, offset: 150 },
  { side: 'right' as const, offset: 150 },
]

// ─── Pixel-art grid ────────────────────────────────────────────────────────────
//
//  12 columns × 16 rows. 0 = transparent. String key = colour from COLORS.
//  Row 0 is the TOP of the sprite (bow loop tips — peeks into view first).
//
//  To replace with another character:
//    1. Replace PIXELS with the new grid
//    2. Replace COLORS with the new palette
//    3. Update GRID_COLS / GRID_ROWS to match
//    To just recolour: edit COLORS values only.
// ──────────────────────────────────────────────────────────────────────────────

type CK = 'W' | 'G' | 'O' | 'E' | 'P'
const _: 0 = 0

const GRID_COLS = 12
const GRID_ROWS = 16

// prettier-ignore
//                   col:  0    1    2    3    4    5    6    7    8    9   10   11
const PIXELS: (CK | 0)[][] = [
  /* R0  bow loop tops   */ [_,  'P', 'P', 'P',  _,   _,   _,  'P', 'P', 'P',  _,   _ ],
  /* R1  bow pinch       */ [_,   _,  'P',  _,   _,   _,   _,   _,  'P',  _,   _,   _ ],
  /* R2  bow ribbon      */ [_,   _,   _,  'P', 'P', 'P', 'P', 'P',  _,   _,   _,   _ ],
  /* R3  head top        */ [_,   _,   _,   _,  'W', 'W', 'W',  _,   _,   _,   _,   _ ],
  /* R4  head            */ [_,   _,   _,  'W', 'W', 'W', 'W', 'W',  _,   _,   _,   _ ],
  /* R5  head wide       */ [_,   _,  'W', 'W', 'W', 'W', 'W', 'W', 'W',  _,   _,   _ ],
  /* R6  eyes ──────────*/ [_,   _,  'W', 'E', 'W', 'W', 'W', 'E', 'W',  _,   _,   _ ],
  /* R7  beak ──────────*/ [_,   _,  'W', 'W', 'W', 'O', 'O', 'W', 'W',  _,   _,   _ ],
  /* R8  chin            */ [_,   _,   _,  'W', 'W', 'W', 'W', 'W',  _,   _,   _,   _ ],
  /* R9  neck            */ [_,   _,   _,   _,  'W', 'W', 'W',  _,   _,   _,   _,   _ ],
  /* R10 body top        */ [_,   _,   _,  'W', 'W', 'W', 'W', 'W', 'W',  _,   _,   _ ],
  /* R11 body            */ [_,   _,  'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W',  _,   _ ],
  /* R12 body widest  ──*/ [_,  'W', 'W', 'W', 'G', 'W', 'W', 'G', 'W', 'W', 'W',  _ ],
  /* R13 body lower      */ [_,   _,  'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W',  _,   _ ],
  /* R14 legs ──────────*/ [_,   _,   _,   _,  'O',  _,   _,   _,  'O',  _,   _,   _ ],
  /* R15 feet ──────────*/ [_,   _,   _,  'O', 'O', 'O',  _,  'O', 'O', 'O',  _,   _ ],
]

// ↓ Colour palette — edit values here to recolour the goose
const COLORS: Record<CK, string> = {
  W: '#f8fafc',  // body (near-white)
  G: '#94a3b8',  // wing detail (slate-400 gray)
  O: '#f97316',  // beak + feet (orange-500)
  E: '#0f172a',  // eyes (slate-950, near-black)
  P: '#f472b6',  // bow (pink-400 — bright & playful)
}

// ─── Derived constants ─────────────────────────────────────────────────────────
const W = GRID_COLS * PIXEL_SIZE   // sprite width in px
const H = GRID_ROWS * PIXEL_SIZE   // sprite height in px

// ─── SVG sprite ───────────────────────────────────────────────────────────────

function GooseSVG({ wiggle }: { wiggle: boolean }) {
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        // Gentle waddle while visible. Keyframe injected via sibling <style>.
        animation: wiggle ? 'px-goose-waddle 1.6s ease-in-out infinite' : 'none',
      }}
      aria-hidden="true"
      focusable="false"
    >
      {PIXELS.flatMap((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * PIXEL_SIZE}
              y={r * PIXEL_SIZE}
              width={PIXEL_SIZE}
              height={PIXEL_SIZE}
              fill={COLORS[cell]}
              shapeRendering="crispEdges"
            />
          ) : null,
        ),
      )}
    </svg>
  )
}

// ─── Animation phases ─────────────────────────────────────────────────────────

type Phase = 'hidden' | 'peeking' | 'visible' | 'retreating'

// translateY is relative to sprite height H.
// Container is fixed at bottom: 0, so 100% = fully below the viewport.
// At 'peeking' (~52%), ~8 rows are visible: bow + face + beak — enough to be charming.
const TRANSLATE: Record<Phase, string> = {
  hidden:     '110%',  // well off-screen — no edge flash on initial render
  peeking:    '52%',   // bow loops + full face visible
  visible:    '0%',    // feet rest at viewport bottom edge
  retreating: '110%',
}

const TRANSITION: Record<Phase, string> = {
  hidden:     'none',
  peeking:    'transform 0.55s ease-out',
  visible:    'transform 0.4s ease-out',
  retreating: 'transform 0.75s cubic-bezier(0.4,0,1,1)',
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PixelGoose() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase]     = useState<Phase>('hidden')
  const [spot, setSpot]       = useState(SPOTS[0])
  const timers                = useRef<ReturnType<typeof setTimeout>[]>([])

  const after = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !ENABLED) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 480) return

    function scheduleNext() {
      const ms =
        (MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)) * 1_000
      after(run, ms)
    }

    function run() {
      setSpot(SPOTS[Math.floor(Math.random() * SPOTS.length)])

      setPhase('peeking')
      after(() => setPhase('visible'),    550)
      after(() => setPhase('retreating'), 550 + VISIBLE_DURATION)
      after(() => { setPhase('hidden'); scheduleNext() }, 550 + VISIBLE_DURATION + 850)
    }

    after(run, FIRST_DELAY)

    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [mounted, after])

  if (!mounted || !ENABLED) return null

  return (
    <>
      <style>{`
        @keyframes px-goose-waddle {
          0%,  100% { transform: rotate(0deg) translateX(0); }
          25%        { transform: rotate(-5deg) translateX(-1px); }
          75%        { transform: rotate(5deg)  translateX(1px); }
        }
        /* Hide on narrow viewports — goose is decorative only */
        @media (max-width: 479px) { .px-goose-root { display: none !important; } }
      `}</style>

      <div
        className="px-goose-root"
        aria-hidden="true"
        style={{
          position:      'fixed',
          bottom:        0,
          left:  spot.side === 'left'  ? spot.offset : undefined,
          right: spot.side === 'right' ? spot.offset : undefined,
          zIndex:        9999,
          pointerEvents: 'none',
          userSelect:    'none',
          transform:     `translateY(${TRANSLATE[phase]})`,
          transition:    TRANSITION[phase],
          willChange:    'transform',
          // Soft pink glow ties the bow to the site's accent colour
          filter:        'drop-shadow(0 2px 8px rgba(244,114,182,0.35))',
        }}
      >
        <GooseSVG wiggle={phase === 'visible'} />
      </div>
    </>
  )
}
