'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
//  PixelWorm — decorative Easter egg
//
//  Mounted once in app/layout.tsx; visible site-wide but non-intrusive.
//  The worm peeks from the bottom edge, wiggles, and retreats. It appears
//  only after a long delay and then on a randomised interval.
//
//  ┌─ HOW TO CONFIGURE ───────────────────────────────────────────────────────┐
//  │  ENABLED          → false to remove the worm from the site entirely      │
//  │  MIN/MAX_INTERVAL → seconds between appearances (randomised in-range)    │
//  │  FIRST_DELAY      → ms to wait before the very first appearance          │
//  │  VISIBLE_DURATION → ms the worm stays in view before it retreats         │
//  │  PIXEL_SIZE       → px per pixel-art cell (increase = bigger worm)       │
//  │  SPOTS            → entrance positions (all bottom-edge)                 │
//  │  PIXELS + COLORS  → swap both to replace with another character entirely  │
//  └──────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════════

const ENABLED          = true    // ← set false to disable the worm entirely
const MIN_INTERVAL     = 20      // seconds (minimum time between appearances)
const MAX_INTERVAL     = 40      // seconds (maximum time between appearances)
const FIRST_DELAY      = 15_000  // ms — wait this long on page load before first peek
const VISIBLE_DURATION = 4_000   // ms the worm stays fully visible
const PIXEL_SIZE       = 5       // px per grid cell — increase for a larger worm

// Entrance spots: worm always rises from the bottom edge of the viewport.
// 'side' = 'left' | 'right'; 'offset' = px from that side.
// All positions are chosen to stay clear of nav, cards, and text.
// ↓ To replace with a different character in a different position, edit these.
const SPOTS = [
  { side: 'left'  as const, offset: 60  },
  { side: 'right' as const, offset: 60  },
  { side: 'left'  as const, offset: 150 },
  { side: 'right' as const, offset: 150 },
]

// ─── Pixel-art grid ────────────────────────────────────────────────────────────
//
//  10 columns × 13 rows. 0 = transparent. String key = colour from COLORS.
//  Row 0 is the worm's HEAD (it rises into view first from the bottom).
//
//  To replace with another character (e.g. a pixelated goose):
//    1. Design a new grid in a tool like Piskel or graph paper
//    2. Replace PIXELS with the new grid
//    3. Replace COLORS with the new palette
//    4. Update GRID_COLS / GRID_ROWS to match
//    5. Optionally rename the component and update the comment above
//
//  To replace pixel colours only (e.g. recolour for a seasonal theme):
//    → Edit COLORS below; the pixel layout stays the same.
// ──────────────────────────────────────────────────────────────────────────────

type CK = 'B' | 'M' | 'D' | 'E'
const _: 0 = 0

const GRID_COLS = 10
const GRID_ROWS = 13

// prettier-ignore
//                 col: 0    1    2    3    4    5    6    7    8    9
const PIXELS: (CK | 0)[][] = [
  /* row 0  head cap  */ [_,   _,  'B', 'B', 'B', 'B', 'B', 'B',  _,   _ ],
  /* row 1            */ [_,  'D', 'M', 'M', 'M', 'M', 'M', 'M', 'D',  _ ],
  /* row 2  eyes ─────*/ ['D','M', 'E', 'M', 'M', 'M', 'M', 'E', 'M', 'D'],
  /* row 3            */ ['D','M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'D'],
  /* row 4  smile ────*/ ['D','M', 'M', 'D', 'M', 'M', 'D', 'M', 'M', 'D'],
  /* row 5  smile ────*/ ['D','M', 'M', 'M', 'D', 'D', 'M', 'M', 'M', 'D'],
  /* row 6  chin      */ [_,  'D', 'M', 'M', 'M', 'M', 'M', 'M', 'D',  _ ],
  /* row 7  neck      */ [_,   _,  'D', 'M', 'M', 'M', 'M', 'D',  _,   _ ],
  /* row 8  body      */ [_,  'D', 'M', 'M', 'M', 'M', 'M', 'M', 'D',  _ ],
  /* row 9  body      */ [_,  'D', 'M', 'M', 'M', 'M', 'M', 'M', 'D',  _ ],
  /* row 10 taper     */ [_,   _,  'D', 'M', 'M', 'M', 'M', 'D',  _,   _ ],
  /* row 11 tail      */ [_,   _,   _,  'D', 'M', 'M', 'D',  _,   _,   _ ],
  /* row 12 tail tip  */ [_,   _,   _,   _,  'D', 'D',  _,   _,   _,   _ ],
]

// ↓ Colour palette — edit values here to recolour the worm
const COLORS: Record<CK, string> = {
  B: '#fce7f3',  // head highlight (pink-100, matches site --fg)
  M: '#f9a8d4',  // body main (pink-300)
  D: '#B3446C',  // outline / dark accent (matches site --muted)
  E: '#1a0810',  // eye colour (near-black with pink tint)
}

// ─── Derived constants (do not edit) ──────────────────────────────────────────
const W = GRID_COLS * PIXEL_SIZE  // sprite width in px
const H = GRID_ROWS * PIXEL_SIZE  // sprite height in px

// ─── SVG sprite ───────────────────────────────────────────────────────────────

function WormSVG({ wiggle }: { wiggle: boolean }) {
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        // Wiggle animation runs while the worm is fully visible.
        // The keyframe is injected by the parent component's <style> tag.
        animation: wiggle ? 'px-worm-wiggle 1.4s ease-in-out infinite' : 'none',
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
              // crispEdges suppresses anti-aliasing → hard pixel edges
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

// translateY values for each phase (relative to container height H).
// The container sits at bottom: 0, so translateY(100%) = fully off-screen below.
// Adjust peeking/visible values to show more or less of the worm.
const TRANSLATE: Record<Phase, string> = {
  hidden:     '110%',   // well off-screen — avoids any edge flash
  peeking:    '52%',    // just the face visible (~6 rows, rows 0-5)
  visible:    '0%',     // fully in view (tail at viewport bottom edge)
  retreating: '110%',   // same as hidden — exits below the fold
}

// CSS transition for each phase transition
const TRANSITION: Record<Phase, string> = {
  hidden:     'none',                             // instant reset — no visible flash
  peeking:    'transform 0.55s ease-out',         // springs in
  visible:    'transform 0.4s ease-out',          // quick settle
  retreating: 'transform 0.7s cubic-bezier(0.4,0,1,1)', // smooth ease-in exit
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PixelWorm() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase]     = useState<Phase>('hidden')
  const [spot, setSpot]       = useState(SPOTS[0])
  const timers                = useRef<ReturnType<typeof setTimeout>[]>([])

  // Stable helper — adds a timeout id to the cleanup list
  const after = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }, [])

  // Client-only mount guard — avoids SSR/hydration mismatch
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !ENABLED) return

    // ── Bail-out conditions ───────────────────────────────────────────────────
    // Prefers-reduced-motion: skip entirely (static site, no fallback needed)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Small screens: worm is hidden via CSS too, but skip timer overhead here
    if (window.innerWidth < 480) return

    // ── Sequence functions ────────────────────────────────────────────────────

    function scheduleNext() {
      const ms =
        (MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)) * 1_000
      after(run, ms)
    }

    function run() {
      // Pick a random entrance spot each time to avoid feeling repetitive
      setSpot(SPOTS[Math.floor(Math.random() * SPOTS.length)])

      // 1. Peek (just the face)
      setPhase('peeking')

      // 2. Rise fully into view
      after(() => setPhase('visible'), 550)

      // 3. Retreat after visibility window
      after(() => setPhase('retreating'), 550 + VISIBLE_DURATION)

      // 4. Reset and schedule next after retreat animation completes
      after(() => {
        setPhase('hidden')
        scheduleNext()
      }, 550 + VISIBLE_DURATION + 800)
    }

    // First appearance — give the page time to settle before the worm intrudes
    after(run, FIRST_DELAY)

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [mounted, after])

  // Don't render anything server-side or before hydration
  if (!mounted || !ENABLED) return null

  return (
    <>
      {/*
        Self-contained keyframe — keeps this component a single file.
        If you prefer, move this to global.css and remove the <style> tag.
        Prefixed 'px-worm-' to avoid collision with any other keyframe names.
      */}
      <style>{`
        @keyframes px-worm-wiggle {
          0%,  100% { transform: rotate(0deg); }
          15%        { transform: rotate(-6deg) translateX(-1px); }
          35%        { transform: rotate(6deg)  translateX(1px); }
          55%        { transform: rotate(-3deg); }
          75%        { transform: rotate(3deg); }
        }
        /* Hide on very small viewports regardless of JS state */
        @media (max-width: 479px) { .px-worm-root { display: none !important; } }
      `}</style>

      <div
        className="px-worm-root"
        aria-hidden="true"
        style={{
          // ── Positioning ─────────────────────────────────────────────────────
          position:      'fixed',
          bottom:        0,
          // Position from whichever side the spot is on
          left:  spot.side === 'left'  ? spot.offset : undefined,
          right: spot.side === 'right' ? spot.offset : undefined,
          // ── Layering ────────────────────────────────────────────────────────
          zIndex:        9999,       // above page content, below no modal in this app
          pointerEvents: 'none',     // NEVER intercepts clicks
          userSelect:    'none',
          // ── Animation ───────────────────────────────────────────────────────
          transform:     `translateY(${TRANSLATE[phase]})`,
          transition:    TRANSITION[phase],
          willChange:    'transform',
          // ── Visual polish ───────────────────────────────────────────────────
          // Subtle glow that ties the worm to the site's pink accent colour.
          // Remove the filter line if you prefer a flat, no-shadow look.
          filter:        'drop-shadow(0 2px 8px rgba(179,68,108,0.4))',
        }}
      >
        <WormSVG wiggle={phase === 'visible'} />
      </div>
    </>
  )
}
