'use client'
import { usePathname } from 'next/navigation'
import { useFlowerCollection } from 'app/context/FlowerCollectionContext'
import { FLOWERS, FlowerDef } from 'app/content/flowers'
import { CollectibleFlower } from './CollectibleFlower'

function matchesPage(
  page: string,
  matchMode: 'exact' | 'startsWith',
  pathname: string
): boolean {
  if (matchMode === 'exact')      return pathname === page
  if (matchMode === 'startsWith') return pathname === page || pathname.startsWith(page + '/')
  return false
}

// Renders one flower at its desktop position and (optionally) a different
// mobile position, using Tailwind responsive visibility classes.
function FlowerSlot({ flower }: { flower: FlowerDef }) {
  const desktop = flower.pos
  const mobile  = flower.mobilePos ?? flower.pos

  return (
    <>
      {/* Desktop (≥ 640 px) */}
      <div
        className="hidden sm:block"
        style={{ position: 'absolute', ...desktop }}
      >
        <CollectibleFlower flower={flower} />
      </div>

      {/* Mobile (< 640 px) */}
      <div
        className="block sm:hidden"
        style={{ position: 'absolute', ...mobile }}
      >
        <CollectibleFlower flower={flower} />
      </div>
    </>
  )
}

export function FlowerLayer() {
  const pathname = usePathname()
  const { hydrated, isCollected } = useFlowerCollection()

  if (!hydrated) return null

  const visible = FLOWERS.filter(
    f => matchesPage(f.page, f.matchMode, pathname) && !isCollected(f.id)
  )

  if (visible.length === 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 30,
        // No overflow:hidden — flowers at edge can partially peek
      }}
    >
      {visible.map(flower => (
        <FlowerSlot key={flower.id} flower={flower} />
      ))}
    </div>
  )
}
