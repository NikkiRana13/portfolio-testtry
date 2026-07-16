// Decorative ASCII plant layer — fixed behind all content, pointer-events none.
// All positions are intentionally toward edges so content is never obscured.

type Plant = {
  art: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  size?: number
  opacity?: number
  rotate?: number
}

const TALL_PINE = `\
      *
     ***
    *****
   *******
  *********
 ***********
      |
      |
      |`

const MED_PINE = `\
    *
   ***
  *****
 *******
*********
    |
    |`

const SMALL_PINE = `\
  *
 ***
*****
  |
  |`

const SPROUT = `\
  *
 ***
  |
  |`

const BAMBOO = `\
 ||
=||=
 ||
 ||
=||=
 ||
 ||
=||=
 ||`

const GRASS = `\
 /|/|\\
/ | | \\
  |||
   |`

const GRASS_SM = `\
/|\\
|||
 |`

const FERN = `\
\\  |  /
 \\ | /
  \\|/
  /|\\
 / | \\
/  |  \\`

const SHRUB = `\
 ,~~~,
( o.o )
 (   )
  )|(
  |||
   |`

const FLOWER = `\
 * *
* . *
 * *
  |
  |`

const REED = `\
  ~
  |
  |~
  ||
  ||
  ||
  ||`

const VINE = `\
  @
 @|
@ |
  |@
  | @
  |  @
  |`

const PLANTS: Plant[] = [
  // ── Left edge ───────────────────────────────────────────────────────────
  { art: TALL_PINE,  left: '-1%',  top: '8%',   size: 14, opacity: 0.1,  rotate: -1  },
  { art: MED_PINE,   left: '0%',   top: '38%',  size: 13, opacity: 0.08, rotate: 2   },
  { art: FERN,       left: '1%',   top: '62%',  size: 12, opacity: 0.09, rotate: -2  },
  { art: BAMBOO,     left: '3%',   top: '72%',  size: 12, opacity: 0.07, rotate: 1   },
  { art: GRASS,      left: '0%',   bottom:'4%', size: 12, opacity: 0.1              },
  { art: SMALL_PINE, left: '7%',   top: '18%',  size: 12, opacity: 0.07, rotate: 3  },
  { art: SHRUB,      left: '5%',   bottom:'8%', size: 11, opacity: 0.08, rotate: -1 },

  // ── Right edge ──────────────────────────────────────────────────────────
  { art: TALL_PINE,  right: '-1%', top: '12%',  size: 14, opacity: 0.1,  rotate: 2  },
  { art: MED_PINE,   right: '1%',  top: '44%',  size: 13, opacity: 0.08, rotate: -1 },
  { art: REED,       right: '3%',  top: '30%',  size: 12, opacity: 0.07, rotate: 1  },
  { art: VINE,       right: '2%',  top: '60%',  size: 12, opacity: 0.09, rotate: -2 },
  { art: SMALL_PINE, right: '6%',  top: '75%',  size: 12, opacity: 0.08, rotate: 2  },
  { art: FERN,       right: '1%',  bottom:'5%', size: 12, opacity: 0.09, rotate: 1  },
  { art: GRASS_SM,   right: '8%',  bottom:'3%', size: 13, opacity: 0.1              },

  // ── Deeper left (slightly inset) ────────────────────────────────────────
  { art: SPROUT,     left: '12%',  top: '5%',   size: 11, opacity: 0.06            },
  { art: GRASS_SM,   left: '10%',  bottom:'2%', size: 12, opacity: 0.07, rotate: -1},
  { art: FLOWER,     left: '14%',  top: '88%',  size: 11, opacity: 0.07            },

  // ── Deeper right (slightly inset) ───────────────────────────────────────
  { art: SPROUT,     right: '13%', top: '7%',   size: 11, opacity: 0.06, rotate: 2 },
  { art: FLOWER,     right: '15%', top: '82%',  size: 11, opacity: 0.07, rotate: -1},
  { art: GRASS_SM,   right: '11%', bottom:'2%', size: 12, opacity: 0.07            },
]

export function AsciiGarden() {
  return (
    <div
      aria-hidden="true"
      className="ascii-garden-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {PLANTS.map((plant, i) => (
        <pre
          key={i}
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-geist-mono), "Courier New", monospace',
            fontSize: plant.size ?? 13,
            lineHeight: 1.25,
            color: '#B3446C',
            opacity: plant.opacity ?? 0.09,
            whiteSpace: 'pre',
            margin: 0,
            padding: 0,
            top:    plant.top,
            bottom: plant.bottom,
            left:   plant.left,
            right:  plant.right,
            transform: plant.rotate ? `rotate(${plant.rotate}deg)` : undefined,
            transformOrigin: 'bottom center',
          }}
        >
          {plant.art}
        </pre>
      ))}
    </div>
  )
}
