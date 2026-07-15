'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { formatDate } from 'app/blog/format-date'

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  metadata: { title: string; publishedAt: string; summary: string }
  slug: string
}

type Props = {
  posts: Post[]
}

// ─── Pen SVG ─────────────────────────────────────────────────────────────────
// Decorative pixel-art pen lying beside the notebook.
// Replace this component's SVG to use a different pen design.

function PenSVG({ wiggling }: { wiggling: boolean }) {
  return (
    <svg
      viewBox="0 0 84 14"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: wiggling ? 'penWiggle 0.5s ease 1' : undefined,
      }}
    >
      {/* Eraser cap (left) */}
      <rect x={0}  y={2}  width={6}  height={10} fill="#fce7f3" shapeRendering="crispEdges" />
      <rect x={6}  y={2}  width={3}  height={10} fill="#B3446C" shapeRendering="crispEdges" />
      {/* Body */}
      <rect x={9}  y={4}  width={54} height={6}  fill="#f472b6" shapeRendering="crispEdges" />
      {/* Highlight stripe */}
      <rect x={9}  y={4}  width={54} height={2}  fill="#fce7f3" opacity={0.35} shapeRendering="crispEdges" />
      {/* Label band */}
      <rect x={32} y={4}  width={10} height={6}  fill="#B3446C" shapeRendering="crispEdges" />
      {/* Nib */}
      <rect x={63} y={4}  width={8}  height={6}  fill="#B3446C" shapeRendering="crispEdges" />
      {/* Tip */}
      <rect x={71} y={5}  width={4}  height={4}  fill="#2d0f1e" shapeRendering="crispEdges" />
      <rect x={75} y={6}  width={3}  height={2}  fill="#2d0f1e" shapeRendering="crispEdges" />
      <rect x={78} y={6}  width={2}  height={2}  fill="#4d1a2e" shapeRendering="crispEdges" />
      {/* Drop shadow line */}
      <rect x={9}  y={10} width={69} height={1}  fill="rgba(0,0,0,0.3)" shapeRendering="crispEdges" />
    </svg>
  )
}

// ─── Notebook rings decoration ────────────────────────────────────────────────

function SpineRings() {
  const rings = [0, 1, 2, 3, 4, 5, 6]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 0' }}>
      {rings.map(i => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid rgba(0,0,0,0.45)',
            background: '#0a0809',
            margin: '0 auto',
          }}
        />
      ))}
    </div>
  )
}

// ─── Small pixel star decoration ──────────────────────────────────────────────

function PixelStar({ color = '#f9a8d4' }: { color?: string }) {
  return (
    <svg viewBox="0 0 9 9" width="9" height="9" aria-hidden="true" style={{ imageRendering: 'pixelated' }}>
      <rect x={4} y={0} width={1} height={9} fill={color} shapeRendering="crispEdges" />
      <rect x={0} y={4} width={9} height={1} fill={color} shapeRendering="crispEdges" />
      <rect x={2} y={2} width={1} height={1} fill={color} shapeRendering="crispEdges" />
      <rect x={6} y={2} width={1} height={1} fill={color} shapeRendering="crispEdges" />
      <rect x={2} y={6} width={1} height={1} fill={color} shapeRendering="crispEdges" />
      <rect x={6} y={6} width={1} height={1} fill={color} shapeRendering="crispEdges" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotebookScene({ posts }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [penWiggle, setPenWiggle] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const openPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function openNotebook() {
    if (isOpen || animating) return
    if (!prefersReduced) {
      setPenWiggle(true)
      setTimeout(() => setPenWiggle(false), 600)
    }
    setAnimating(true)
    setTimeout(() => {
      setIsOpen(true)
      setAnimating(false)
      // Move focus into the open panel for keyboard users
      setTimeout(() => openPanelRef.current?.focus(), 50)
    }, prefersReduced ? 0 : 220)
  }

  function closeNotebook() {
    if (!isOpen || animating) return
    setAnimating(true)
    setTimeout(() => {
      setIsOpen(false)
      setAnimating(false)
    }, prefersReduced ? 0 : 200)
  }

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  // ── Desk scene ──────────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-screen">
      {/* Aurora */}
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">

        {/* Pixel section label */}
        <p className="pixel-label mb-6" style={{ color: 'var(--pixel-accent-pink)' }}>
          // blog
        </p>

        {/* ── Desk composition ───────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >

          {/* ── CLOSED notebook ─────────────────────────────────────────────── */}
          {!isOpen && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                animation: animating ? 'notebookClose 0.22s ease forwards' : undefined,
              }}
            >
              <button
                onClick={openNotebook}
                aria-label="Open Nikki's blog notebook"
                style={{
                  display: 'flex',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <NotebookClosed />
              </button>

              {/* Pen below notebook on mobile, beside it on desktop */}
              <div
                aria-hidden="true"
                style={{
                  width: 'clamp(60px, 10vw, 120px)',
                  aspectRatio: '84 / 14',
                  transform: 'rotate(-8deg)',
                  transformOrigin: 'right center',
                  transition: 'transform 0.3s ease',
                  pointerEvents: 'none',
                  alignSelf: 'flex-end',
                  marginRight: 24,
                  marginTop: -8,
                  flexShrink: 0,
                }}
              >
                <PenSVG wiggling={penWiggle} />
              </div>

              <p
                className="font-pixel font-pixel-xs"
                style={{ color: 'rgba(249,168,212,0.55)', letterSpacing: '0.1em' }}
                aria-hidden="true"
              >
                click to open
              </p>
            </div>
          )}

          {/* ── OPEN notebook ───────────────────────────────────────────────── */}
          {isOpen && (
            <div
              ref={openPanelRef}
              tabIndex={-1}
              role="region"
              aria-label="Blog notebook — open"
              style={{
                width: '100%',
                maxWidth: 860,
                outline: 'none',
                animation: animating ? undefined : 'notebookOpen 0.25s ease',
              }}
            >
              <NotebookOpen posts={sortedPosts} onClose={closeNotebook} />
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

// ─── Closed notebook visual ───────────────────────────────────────────────────
// Replace the CSS/JSX inside here to change the cover artwork.

function NotebookClosed() {
  return (
    <div
      style={{
        display: 'flex',
        width: 'clamp(320px, 46vw, 580px)',
        height: 'clamp(422px, calc(46vw * 1.32), 766px)',
        background: 'var(--pixel-paper)',
        border: '2px solid rgba(179,68,108,0.6)',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.7), 10px 10px 0 rgba(179,68,108,0.15)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '8px 8px 0 rgba(0,0,0,0.8), 14px 14px 0 rgba(179,68,108,0.25)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '6px 6px 0 rgba(0,0,0,0.7), 10px 10px 0 rgba(179,68,108,0.15)'
      }}
    >
      {/* Spine */}
      <div
        style={{
          width: 28,
          background: '#B3446C',
          borderRight: '2px solid rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}
      >
        <SpineRings />
        {/* Spine label (rotated text) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: 28,
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <span
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 11,
              color: '#fce7f3',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              letterSpacing: '0.08em',
              opacity: 0.8,
            }}
          >
            NIKKI
          </span>
        </div>
      </div>

      {/* Cover body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, gap: 16 }}>
        {/* Top decorative strip */}
        <div className="pixel-divider" style={{ marginBottom: 8 }} />

        {/* Title area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          <p
            className="pixel-label"
            style={{ color: '#B3446C', letterSpacing: '0.12em' }}
          >
            vol. 01
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 32,
              color: '#fce7f3',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            Nikki&apos;s
            <br />
            Notes
          </h2>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <PixelStar color="#B3446C" />
            <div
              style={{
                height: 1,
                flex: 1,
                background: 'rgba(179,68,108,0.4)',
              }}
            />
            <PixelStar color="#B3446C" />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 14,
              color: 'rgba(249,168,212,0.5)',
              lineHeight: 1.6,
              letterSpacing: '0.04em',
            }}
          >
            thoughts, experiments,
            <br />
            and things i&apos;m learning
          </p>
        </div>

        {/* Bottom strip */}
        <div className="pixel-divider" />

        {/* Decorated corner stars */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
          <PixelStar color="rgba(249,168,212,0.35)" />
          <PixelStar color="rgba(249,168,212,0.2)" />
        </div>
      </div>
    </div>
  )
}

// ─── Open notebook two-page spread ───────────────────────────────────────────

function NotebookOpen({ posts, onClose }: { posts: Post[]; onClose: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid rgba(179,68,108,0.55)',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}
    >
      {/* ── Notebook top bar (binding) ───────────────────────────────────── */}
      <div
        style={{
          background: '#B3446C',
          height: 32,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          borderBottom: '2px solid rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}
      >
        {/* Ring row */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: '2px solid rgba(0,0,0,0.45)',
              background: '#0a0809',
              flexShrink: 0,
            }}
          />
        ))}
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close notebook"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: '1px solid rgba(252,231,243,0.35)',
            color: '#fce7f3',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 14,
            padding: '2px 8px',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          close ×
        </button>
      </div>

      {/* ── Two-page spread ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          background: 'var(--pixel-paper-open)',
          minHeight: 520,
        }}
      >
        {/* LEFT PAGE ── intro / meta */}
        <div
          className="pixel-lined"
          style={{
            width: '38%',
            minWidth: 180,
            padding: '24px 20px',
            borderRight: '2px solid rgba(179,68,108,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            flexShrink: 0,
            // hide on very narrow screens — handled by the single-page view
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 18,
              color: 'var(--pixel-ink)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            // blog
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 14,
              color: 'rgba(179,68,108,0.8)',
              lineHeight: 1.5,
              letterSpacing: '0.04em',
            }}
          >
            nikki&apos;s notes
          </p>

          <div className="pixel-divider" style={{ margin: '4px 0' }} />

          <p
            style={{
              fontSize: 13,
              color: 'var(--pixel-ink)',
              opacity: 0.55,
              lineHeight: 1.7,
            }}
          >
            thoughts,<br />experiments,<br />and things i&apos;m learning.
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="pixel-divider" />
            <div style={{ display: 'flex', gap: 8 }}>
              <PixelStar color="#B3446C" />
              <PixelStar color="rgba(179,68,108,0.45)" />
              <PixelStar color="rgba(179,68,108,0.2)" />
            </div>
            <p className="pixel-label" style={{ color: 'rgba(179,68,108,0.5)' }}>
              {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>

        {/* RIGHT PAGE ── post list */}
        <div
          className="pixel-lined"
          style={{
            flex: 1,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            overflowY: 'auto',
          }}
        >
          {posts.length === 0 ? (
            <p style={{ fontSize: 14, opacity: 0.45, fontStyle: 'italic' }}>
              Nothing written yet. Check back soon.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {posts.map((post, i) => (
                <li
                  key={post.slug}
                  style={{
                    borderBottom: i < posts.length - 1 ? '1px solid rgba(179,68,108,0.12)' : 'none',
                    padding: '16px 0',
                  }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-pixel), monospace',
                          fontSize: 20,
                          color: 'var(--pixel-ink)',
                          lineHeight: 1.4,
                          transition: 'color 0.15s ease',
                        }}
                        className="post-title"
                      >
                        {post.metadata.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-pixel), monospace',
                          fontSize: 13,
                          color: 'rgba(179,68,108,0.65)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {formatDate(post.metadata.publishedAt)}
                      </span>
                    </div>

                    {post.metadata.summary && (
                      <p
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: 'var(--pixel-ink)',
                          opacity: 0.55,
                          lineHeight: 1.65,
                        }}
                      >
                        {post.metadata.summary}
                      </p>
                    )}

                    <span
                      style={{
                        marginTop: 6,
                        display: 'inline-block',
                        fontFamily: 'var(--font-pixel), monospace',
                        fontSize: 14,
                        color: '#B3446C',
                        letterSpacing: '0.04em',
                      }}
                    >
                      read →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Bottom margin / page numbers ─────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--pixel-paper-open)',
          borderTop: '1px solid rgba(179,68,108,0.12)',
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="pixel-label" style={{ color: 'rgba(179,68,108,0.4)' }}>
          nikki rana
        </span>
        <span className="pixel-label" style={{ color: 'rgba(179,68,108,0.4)' }}>
          p. 1
        </span>
      </div>
    </div>
  )
}
