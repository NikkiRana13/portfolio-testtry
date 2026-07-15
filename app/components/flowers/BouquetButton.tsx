'use client'
import { useFlowerCollection } from 'app/context/FlowerCollectionContext'
import { TOTAL_FLOWERS } from 'app/content/flowers'

type Props = {
  onOpen: () => void
}

export function BouquetButton({ onOpen }: Props) {
  const { hydrated, collected, isComplete } = useFlowerCollection()

  if (!hydrated) return null

  const count = collected.length
  const hasAny = count > 0

  return (
    <button
      onClick={onOpen}
      aria-label={`Open bouquet — ${count} of ${TOTAL_FLOWERS} flowers collected`}
      title="Build-a-Bouquet"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 20,
        zIndex: 40,
        background: 'rgba(10,8,9,0.82)',
        border: '1px solid rgba(179,68,108,0.35)',
        borderRadius: '999px',
        padding: '6px 12px 6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'border-color 150ms, box-shadow 150ms',
        boxShadow: isComplete
          ? '0 0 0 2px rgba(179,68,108,0.5), 0 0 16px rgba(179,68,108,0.25)'
          : '0 1px 6px rgba(0,0,0,0.5)',
        animation: isComplete ? 'bouquetGlow 2s ease-in-out infinite alternate' : undefined,
      }}
    >
      {/* Pixel flower icon (2×2 grid for ultra-tiny display) */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 21 30"
        aria-hidden="true"
        style={{ imageRendering: 'pixelated', flexShrink: 0 }}
      >
        {/* Simplified tulip silhouette */}
        <rect x={6}  y={0}  width={3} height={3} fill="#f9a8d4" shapeRendering="crispEdges" />
        <rect x={3}  y={3}  width={9} height={3} fill="#f9a8d4" shapeRendering="crispEdges" />
        <rect x={0}  y={6}  width={15} height={6} fill="#f9a8d4" shapeRendering="crispEdges" />
        <rect x={3}  y={12} width={9} height={3} fill="#f9a8d4" shapeRendering="crispEdges" />
        <rect x={6}  y={15} width={3} height={15} fill="#16a34a" shapeRendering="crispEdges" />
        <rect x={3}  y={21} width={3} height={3} fill="#15803d" shapeRendering="crispEdges" />
      </svg>

      {/* Progress label */}
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: hasAny ? (isComplete ? '#f9a8d4' : '#fce7f3') : 'rgba(252,231,243,0.45)',
          letterSpacing: '0.04em',
        }}
      >
        {count}/{TOTAL_FLOWERS}
      </span>
    </button>
  )
}
