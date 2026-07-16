'use client'
import { useEffect } from 'react'
import type { TimelineEntry } from 'app/content/timeline'

export function TimelineModal({
  entry,
  onClose,
}: {
  entry: TimelineEntry
  onClose: () => void
}) {
  const dateLabel =
    !entry.endYear
      ? `${entry.startYear} – present`
      : entry.startYear === entry.endYear
        ? entry.startYear
        : `${entry.startYear} – ${entry.endYear}`

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        animation: 'panelFadeIn 0.18s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="timeline-modal-box"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 540,
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'var(--bg)',
          border: '2px solid rgba(179,68,108,0.6)',
          padding: '28px 28px 24px',
          animation: 'panelSlideUp 0.2s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            background: 'none',
            border: '1px solid rgba(179,68,108,0.4)',
            color: 'var(--muted)',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 14,
            padding: '2px 8px',
            cursor: 'pointer',
            lineHeight: 1.4,
          }}
        >
          ×
        </button>

        {/* Date */}
        <p style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 13,
          color: 'rgba(179,68,108,0.7)',
          marginBottom: 10,
          letterSpacing: '0.06em',
        }}>
          {dateLabel}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 22,
          color: 'var(--fg)',
          lineHeight: 1.35,
          margin: '0 0 6px 0',
        }}>
          {entry.title}
        </h3>

        {/* Org */}
        {entry.organization && (
          <p style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 14,
            color: '#B3446C',
            marginBottom: 18,
            letterSpacing: '0.04em',
          }}>
            {entry.organization}
          </p>
        )}

        {/* Divider */}
        <div style={{
          height: 2,
          marginBottom: 20,
          background: 'repeating-linear-gradient(90deg, #B3446C 0px, #B3446C 4px, transparent 4px, transparent 8px)',
        }} />

        {/* Description */}
        <p style={{
          fontSize: 14,
          color: 'var(--fg)',
          opacity: 0.8,
          lineHeight: 1.75,
          marginBottom: entry.highlights?.length ? 20 : 0,
        }}>
          {entry.description}
        </p>

        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {entry.highlights.map((h, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  color: '#B3446C',
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 13,
                  flexShrink: 0,
                  lineHeight: 1.6,
                }}>
                  →
                </span>
                <span style={{
                  fontSize: 14,
                  color: 'var(--fg)',
                  opacity: 0.78,
                  lineHeight: 1.65,
                }}>
                  {h}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
