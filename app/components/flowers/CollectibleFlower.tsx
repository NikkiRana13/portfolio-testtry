'use client'
import { useState, useEffect } from 'react'
import { FlowerDef } from 'app/content/flowers'
import { useFlowerCollection } from 'app/context/FlowerCollectionContext'
import { FlowerSVG } from './sprites'

type VisualState = 'idle' | 'hover' | 'collecting' | 'gone'

// Renders the interactive button for a single flower.
// Positioning is handled by the parent (FlowerLayer).
export function CollectibleFlower({ flower }: { flower: FlowerDef }) {
  const { isCollected, collect, collected } = useFlowerCollection()
  const [vis, setVis] = useState<VisualState>('idle')
  const [showToast, setShowToast] = useState(false)

  // Sync collected state from localStorage hydration
  useEffect(() => {
    if (isCollected(flower.id)) setVis('gone')
  }, [isCollected, flower.id])

  function handleClick() {
    if (vis === 'collecting' || vis === 'gone') return
    if (isCollected(flower.id)) return

    setVis('collecting')
    setShowToast(true)
    setTimeout(() => collect(flower.id), 220)
    setTimeout(() => setVis('gone'), 500)
    setTimeout(() => setShowToast(false), 2200)
  }

  if (vis === 'gone') return null

  const toastCount = collected.length + (vis === 'collecting' ? 1 : 0)

  return (
    <div style={{ position: 'relative', pointerEvents: 'auto' }}>
      {/* Tooltip-style toast */}
      {showToast && (
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            background: 'rgba(10,8,9,0.9)',
            color: '#fce7f3',
            fontSize: '11px',
            lineHeight: 1.4,
            padding: '4px 8px',
            borderRadius: '6px',
            pointerEvents: 'none',
            animation: 'flowerToast 2.2s ease forwards',
            zIndex: 2,
          }}
        >
          {flower.name} collected! ({toastCount}/10)
        </div>
      )}

      <button
        onClick={handleClick}
        onMouseEnter={() => vis === 'idle' && setVis('hover')}
        onMouseLeave={() => vis === 'hover' && setVis('idle')}
        aria-label={`Collect the ${flower.name}`}
        title={`Collect the ${flower.name}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          animation:
            vis === 'hover'      ? 'flowerHover 0.8s ease-in-out infinite' :
            vis === 'collecting' ? 'flowerCollect 0.5s ease forwards'      :
            undefined,
        }}
      >
        <FlowerSVG type={flower.type} />
      </button>
    </div>
  )
}
