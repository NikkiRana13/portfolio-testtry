'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
//  PixelGoose — decorative Easter egg
//
//  Mounted once in app/layout.tsx; visible site-wide but non-intrusive.
//  The goose peeks from the bottom edge (rainbow cap first), waddles, retreats.
//  Click the goose while it's visible to get a "boop!" response.
//
//  ┌─ HOW TO CONFIGURE ───────────────────────────────────────────────────────┐
//  │  ENABLED          → false to remove the goose from the site entirely     │
//  │  MIN/MAX_INTERVAL → seconds between appearances (randomised in-range)    │
//  │  FIRST_DELAY      → ms to wait before the very first appearance          │
//  │  VISIBLE_DURATION → ms the goose stays in view before it retreats        │
//  │  PIXEL_SIZE       → px per pixel-art cell (increase = bigger goose)      │
//  │  SPOTS            → entrance positions (all bottom-edge, safe corners)   │
//  │  PIXELS + COLORS  → swap both to replace with another character          │
//  │  BOOP_MESSAGES    → the message(s) that appear on click                  │
//  └──────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════════

const ENABLED          = true
const MIN_INTERVAL     = 20      // seconds
const MAX_INTERVAL     = 40      // seconds
const FIRST_DELAY      = 15_000  // ms
const VISIBLE_DURATION = 4_000   // ms
const PIXEL_SIZE       = 4       // px per grid cell

// Messages shown on click — picked at random each time
const BOOP_MESSAGES = ['boop!', 'honk!', 'hewwo!', '👋', 'hi!!']

const SPOTS = [
  { side: 'left'  as const, offset: 60  },
  { side: 'right' as const, offset: 60  },
  { side: 'left'  as const, offset: 150 },
  { side: 'right' as const, offset: 150 },
]

// ─── Pixel-art grid ────────────────────────────────────────────────────────────
//
//  12 columns × 16 rows. 0 = transparent. String key = colour from COLORS.
//  Row 0 is the TOP of the sprite (hat crown — peeks into view first).
//
//  Colour keys:
//    W = body white      A = wing shadow (ash)    O = orange (beak + feet)
//    E = eye             K = hat brim (dark)
//    R O Y G B V = rainbow stripes (red → violet)
//
//  To replace with another character: swap PIXELS, COLORS, GRID_COLS, GRID_ROWS.
//  To recolour only: edit COLORS values.
// ──────────────────────────────────────────────────────────────────────────────

type CK = 'W' | 'A' | 'O' | 'E' | 'K' | 'R' | 'Y' | 'G' | 'B' | 'V'
const _: 0 = 0

const GRID_COLS = 12
const GRID_ROWS = 16

// prettier-ignore
//                   col:  0    1    2    3    4    5    6    7    8    9   10   11
const PIXELS: (CK | 0)[][] = [
  /* R0  hat crown   ────*/ [_,   _,   _,  'R', 'O', 'Y', 'G', 'B', 'V',  _,   _,   _ ],
  /* R1  hat panel   ────*/ [_,   _,  'R', 'R', 'O', 'Y', 'G', 'B', 'V', 'V',  _,   _ ],
  /* R2  hat brim    ────*/ [_,  'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K',  _ ],
  /* R3  head top        */ [_,   _,   _,   _,  'W', 'W', 'W',  _,   _,   _,   _,   _ ],
  /* R4  head            */ [_,   _,   _,  'W', 'W', 'W', 'W', 'W',  _,   _,   _,   _ ],
  /* R5  head wide       */ [_,   _,  'W', 'W', 'W', 'W', 'W', 'W', 'W',  _,   _,   _ ],
  /* R6  eyes        ────*/ [_,   _,  'W', 'E', 'W', 'W', 'W', 'E', 'W',  _,   _,   _ ],
  /* R7  beak        ────*/ [_,   _,  'W', 'W', 'W', 'O', 'O', 'W', 'W',  _,   _,   _ ],
  /* R8  chin            */ [_,   _,   _,  'W', 'W', 'W', 'W', 'W',  _,   _,   _,   _ ],
  /* R9  neck            */ [_,   _,   _,   _,  'W', 'W', 'W',  _,   _,   _,   _,   _ ],
  /* R10 body top        */ [_,   _,   _,  'W', 'W', 'W', 'W', 'W', 'W',  _,   _,   _ ],
  /* R11 body            */ [_,   _,  'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W',  _,   _ ],
  /* R12 body widest ────*/ [_,  'W', 'W', 'W', 'A', 'W', 'W', 'A', 'W', 'W', 'W',  _ ],
  /* R13 body lower      */ [_,   _,  'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W',  _,   _ ],
  /* R14 legs        ────*/ [_,   _,   _,   _,  'O',  _,   _,   _,  'O',  _,   _,   _ ],
  /* R15 feet        ────*/ [_,   _,   _,  'O', 'O', 'O',  _,  'O', 'O', 'O',  _,   _ ],
]

// ↓ Colour palette — edit values to recolour
const COLORS: Record<CK, string> = {
  W: '#f8fafc',  // body (near-white)
  A: '#94a3b8',  // wing detail (ash/slate)
  O: '#f97316',  // beak + feet, and rainbow orange stripe
  E: '#0f172a',  // eyes (near-black)
  K: '#374151',  // hat brim (dark gray)
  R: '#ef4444',  // rainbow red
  Y: '#eab308',  // rainbow yellow
  G: '#22c55e',  // rainbow green
  B: '#3b82f6',  // rainbow blue
  V: '#a855f7',  // rainbow violet
}

// ─── Derived constants ─────────────────────────────────────────────────────────
const W = GRID_COLS * PIXEL_SIZE
const H = GRID_ROWS * PIXEL_SIZE

// ─── SVG sprite ───────────────────────────────────────────────────────────────

function GooseSVG({
  wiggle,
  onClick,
  clickable,
}: {
  wiggle: boolean
  onClick: () => void
  clickable: boolean
}) {
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      onClick={clickable ? onClick : undefined}
      style={{
        display: 'block',
        imageRendering: 'pixelated',
        animation: wiggle ? 'px-goose-waddle 1.6s ease-in-out infinite' : 'none',
        // Allow clicks on the goose when visible; blocked at container level otherwise
        pointerEvents: clickable ? 'auto' : 'none',
        cursor: clickable ? 'pointer' : 'default',
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

// At 'peeking' (~52%), ~8 rows visible: rainbow hat + face with eyes & beak.
const TRANSLATE: Record<Phase, string> = {
  hidden:     '110%',
  peeking:    '52%',
  visible:    '0%',
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
  const [mounted, setMounted]   = useState(false)
  const [phase, setPhase]       = useState<Phase>('hidden')
  const [spot, setSpot]         = useState(SPOTS[0])
  const [boop, setBoop]         = useState<string | null>(null)
  const timers                  = useRef<ReturnType<typeof setTimeout>[]>([])

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
      setBoop(null)

      setPhase('peeking')
      after(() => setPhase('visible'),    550)
      after(() => setPhase('retreating'), 550 + VISIBLE_DURATION)
      after(() => { setPhase('hidden'); scheduleNext() }, 550 + VISIBLE_DURATION + 850)
    }

    after(run, FIRST_DELAY)

    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [mounted, after])

  function handleBoop() {
    if (phase !== 'visible' && phase !== 'peeking') return
    const msg = BOOP_MESSAGES[Math.floor(Math.random() * BOOP_MESSAGES.length)]
    setBoop(msg)
    // Clear boop message after 1.5 s
    setTimeout(() => setBoop(null), 1_500)
  }

  if (!mounted || !ENABLED) return null

  const clickable = phase === 'visible' || phase === 'peeking'

  return (
    <>
      <style>{`
        @keyframes px-goose-waddle {
          0%,  100% { transform: rotate(0deg) translateX(0); }
          25%        { transform: rotate(-5deg) translateX(-1px); }
          75%        { transform: rotate(5deg)  translateX(1px); }
        }
        @keyframes px-boop-pop {
          0%   { opacity: 0; transform: translateY(4px) scale(0.8); }
          20%  { opacity: 1; transform: translateY(0)   scale(1.05); }
          80%  { opacity: 1; transform: translateY(0)   scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.9); }
        }
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
          pointerEvents: 'none', // container never blocks — clicks handled on SVG directly
          userSelect:    'none',
          transform:     `translateY(${TRANSLATE[phase]})`,
          transition:    TRANSITION[phase],
          willChange:    'transform',
          filter:        'drop-shadow(0 2px 8px rgba(59,130,246,0.3))',
        }}
      >
        {/* "boop!" speech bubble */}
        {boop && (
          <div
            style={{
              position:    'absolute',
              bottom:      '100%',
              left:        '50%',
              transform:   'translateX(-50%)',
              marginBottom: 6,
              whiteSpace:  'nowrap',
              background:  'rgba(10,8,9,0.85)',
              border:      '1px solid rgba(179,68,108,0.5)',
              borderRadius: 6,
              padding:     '3px 8px',
              fontSize:    13,
              fontFamily:  'monospace',
              fontWeight:  700,
              color:       '#fce7f3',
              pointerEvents: 'none',
              animation:   'px-boop-pop 1.5s ease-in-out forwards',
            }}
          >
            {boop}
          </div>
        )}

        <GooseSVG
          wiggle={phase === 'visible'}
          onClick={handleBoop}
          clickable={clickable}
        />
      </div>
    </>
  )
}
