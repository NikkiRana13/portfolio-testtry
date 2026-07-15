'use client'
import { useEffect, useRef } from 'react'
import { useFlowerCollection } from 'app/context/FlowerCollectionContext'
import {
  FLOWERS, TOTAL_FLOWERS, HINTS_ENABLED, COMPLETION_MESSAGE,
  PAGE_LABELS,
} from 'app/content/flowers'
import { FlowerSVG, VaseSVG, SPRITE_W, SPRITE_H } from './sprites'

const ARRANGEMENT_W = 260  // px
const ARRANGEMENT_H = 180  // px

type Props = {
  isOpen: boolean
  onClose: () => void
}

// Sparkle shown on completion
function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 6,
        height: 6,
        pointerEvents: 'none',
        animation: `sparkle 1.4s ease ${delay}s infinite`,
        zIndex: 1,
      }}
    >
      <svg viewBox="0 0 6 6" width="6" height="6">
        <rect x={2} y={0} width={2} height={6} fill="#f9a8d4" shapeRendering="crispEdges" />
        <rect x={0} y={2} width={6} height={2} fill="#f9a8d4" shapeRendering="crispEdges" />
      </svg>
    </div>
  )
}

const SPARKLE_POSITIONS = [
  { x: 20,  y: 10, delay: 0.0 },
  { x: 230, y: 20, delay: 0.3 },
  { x: 10,  y: 80, delay: 0.6 },
  { x: 240, y: 90, delay: 0.2 },
  { x: 120, y: 0,  delay: 0.9 },
  { x: 70,  y: 40, delay: 1.1 },
  { x: 190, y: 50, delay: 0.5 },
  { x: 50,  y: 130, delay: 0.7 },
  { x: 210, y: 140, delay: 0.4 },
  { x: 130, y: 160, delay: 1.2 },
]

export function BouquetPanel({ isOpen, onClose }: Props) {
  const { collected: collectedIds, isComplete, isCollected, reset } = useFlowerCollection()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Trap focus inside panel when open
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  // Hint: group uncollected flowers by page
  const uncollectedByPage = HINTS_ENABLED
    ? FLOWERS
        .filter(f => !isCollected(f.id))
        .reduce<Record<string, string[]>>((acc, f) => {
          const label = PAGE_LABELS[f.page] ?? f.page
          ;(acc[label] ??= []).push(f.name)
          return acc
        }, {})
    : {}

  const hintPages = Object.keys(uncollectedByPage)

  function handleReset() {
    if (confirm('Reset your bouquet? All collected flowers will be lost.')) {
      reset()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 50,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          animation: 'panelFadeIn 0.18s ease',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your bouquet"
        tabIndex={-1}
        style={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          width: 'min(320px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          zIndex: 55,
          background: 'rgba(10,8,9,0.96)',
          border: '1px solid rgba(179,68,108,0.3)',
          borderRadius: '1.25rem',
          padding: '20px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(179,68,108,0.12)',
          animation: 'panelSlideUp 0.22s cubic-bezier(0.22,1,0.36,1)',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fce7f3', letterSpacing: '-0.01em' }}>
              Build a Bouquet
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(252,231,243,0.45)', fontFamily: 'monospace' }}>
              {collectedIds.length} / {TOTAL_FLOWERS} flowers collected
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close bouquet panel"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(252,231,243,0.4)',
              fontSize: 18,
              lineHeight: 1,
              padding: '2px 4px',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fce7f3')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(252,231,243,0.4)')}
          >
            ×
          </button>
        </div>

        {/* Completion message */}
        {isComplete && (
          <div style={{
            marginBottom: 12,
            padding: '10px 12px',
            background: 'rgba(179,68,108,0.12)',
            border: '1px solid rgba(179,68,108,0.3)',
            borderRadius: '0.75rem',
            fontSize: 12,
            color: '#f9a8d4',
            lineHeight: 1.5,
          }}>
            {COMPLETION_MESSAGE}
          </div>
        )}

        {/* Bouquet arrangement */}
        <div style={{ position: 'relative', width: ARRANGEMENT_W, alignSelf: 'center' }}>
          {/* Sparkles on completion */}
          {isComplete && SPARKLE_POSITIONS.map((s, i) => (
            <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} />
          ))}

          {/* Flower arrangement area */}
          <div style={{
            position: 'relative',
            width: ARRANGEMENT_W,
            height: ARRANGEMENT_H,
          }}>
            {FLOWERS.map(flower => {
              const bx = (flower.bouquet.x / 100) * ARRANGEMENT_W - SPRITE_W / 2
              const by = (flower.bouquet.y / 100) * ARRANGEMENT_H - SPRITE_H / 2
              const wasCollected = isCollected(flower.id)

              return (
                <div
                  key={flower.id}
                  title={flower.name}
                  style={{
                    position: 'absolute',
                    left: bx,
                    top: by,
                    width: SPRITE_W,
                    height: SPRITE_H,
                    transform: `rotate(${flower.bouquet.rotate}deg)`,
                    transformOrigin: '50% 100%',
                    opacity: wasCollected ? 1 : 0.18,
                    filter: wasCollected ? 'none' : 'grayscale(1)',
                    transition: 'opacity 0.4s ease, filter 0.4s ease',
                  }}
                >
                  <FlowerSVG type={flower.type} />
                </div>
              )
            })}
          </div>

          {/* Vase */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <VaseSVG />
          </div>
        </div>

        {/* Hints */}
        {HINTS_ENABLED && hintPages.length > 0 && (
          <div style={{ marginTop: 16, borderTop: '1px solid rgba(179,68,108,0.15)', paddingTop: 12 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 500, color: 'rgba(252,231,243,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Still looking for…
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {hintPages.map(page => (
                <li key={page} style={{ fontSize: 12, color: 'rgba(252,231,243,0.55)' }}>
                  flowers on <span style={{ color: '#f9a8d4' }}>{page}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: '1px solid rgba(179,68,108,0.25)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: 11,
              color: 'rgba(252,231,243,0.35)',
              cursor: 'pointer',
              transition: 'color 150ms, border-color 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fce7f3'
              e.currentTarget.style.borderColor = 'rgba(179,68,108,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(252,231,243,0.35)'
              e.currentTarget.style.borderColor = 'rgba(179,68,108,0.25)'
            }}
          >
            reset
          </button>
        </div>
      </div>
    </>
  )
}
