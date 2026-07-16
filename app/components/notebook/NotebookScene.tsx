'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { formatDate } from 'app/blog/format-date'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'reflections' | 'learning' | 'yap'

type Post = {
  metadata: { title: string; publishedAt: string; summary: string; category?: Tab }
  slug: string
}

type Props = {
  posts: Post[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'reflections', label: 'Reflections', color: '#B3446C' },
  { id: 'learning',    label: 'Learning',    color: '#9b3060' },
  { id: 'yap',         label: 'Yap',         color: '#c2617a' },
]

const TODO_ITEMS = [
  { done: true,  text: 'survive another day' },
  { done: false, text: 'wear matching socks' },
  { done: false, text: 'drink water (for real this time)' },
  { done: false, text: 'reply to that email (u know the one)' },
  { done: false, text: 'touch grass at least once' },
  { done: false, text: 'pretend to understand recursion' },
  { done: false, text: 'go to sleep before 2am' },
]

// ─── Pen SVG ─────────────────────────────────────────────────────────────────

function PenSVG({ wiggling }: { wiggling: boolean }) {
  return (
    <svg
      viewBox="0 0 71 14"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: wiggling ? 'penWiggle 0.5s ease 1' : undefined,
      }}
    >
      <rect x={0}  y={4}  width={54} height={6}  fill="#f472b6" shapeRendering="crispEdges" />
      <rect x={0}  y={4}  width={54} height={2}  fill="#fce7f3" opacity={0.35} shapeRendering="crispEdges" />
      <rect x={23} y={4}  width={10} height={6}  fill="#B3446C" shapeRendering="crispEdges" />
      <rect x={54} y={4}  width={8}  height={6}  fill="#B3446C" shapeRendering="crispEdges" />
      <rect x={62} y={5}  width={4}  height={4}  fill="#2d0f1e" shapeRendering="crispEdges" />
      <rect x={66} y={6}  width={3}  height={2}  fill="#2d0f1e" shapeRendering="crispEdges" />
      <rect x={69} y={6}  width={2}  height={2}  fill="#4d1a2e" shapeRendering="crispEdges" />
      <rect x={0}  y={10} width={69} height={1}  fill="rgba(0,0,0,0.3)" shapeRendering="crispEdges" />
    </svg>
  )
}

// ─── Spine rings ──────────────────────────────────────────────────────────────

function SpineRings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 0' }}>
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{
          width: 12, height: 12,
          borderRadius: '50%',
          border: '2px solid rgba(0,0,0,0.45)',
          background: '#0a0809',
          margin: '0 auto',
        }} />
      ))}
    </div>
  )
}

// ─── Pixel star ───────────────────────────────────────────────────────────────

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

// ─── Tab strip (right edge of open notebook) ──────────────────────────────────

function TabStrip({ activeTab, onTabChange }: { activeTab: Tab | null; onTabChange: (t: Tab) => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 64,
      flexShrink: 0,
      borderLeft: '2px solid rgba(179,68,108,0.2)',
    }}>
      {TABS.map((tab, i) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-pressed={isActive}
            aria-label={`${tab.label} posts`}
            style={{
              flex: 1,
              background: isActive ? tab.color : 'rgba(179,68,108,0.12)',
              border: 'none',
              borderBottom: i < TABS.length - 1 ? '1px solid rgba(179,68,108,0.25)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'background 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(179,68,108,0.28)'
            }}
            onMouseLeave={e => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(179,68,108,0.12)'
            }}
          >
            {/* Active tab gets a small left arrow indicator */}
            {isActive && (
              <div style={{
                position: 'absolute',
                left: -6,
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: `6px solid ${tab.color}`,
              }} />
            )}
            <span style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 14,
              color: isActive ? '#fce7f3' : 'var(--pixel-ink)',
              opacity: isActive ? 1 : 0.75,
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              letterSpacing: '0.1em',
              userSelect: 'none',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Left page: name + to-do list ─────────────────────────────────────────────

function LeftPage() {
  return (
    <div
      className="pixel-lined"
      style={{
        width: '38%',
        minWidth: 200,
        padding: '28px 22px',
        borderRight: '2px solid rgba(179,68,108,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        flexShrink: 0,
      }}
    >
      {/* Name */}
      <div>
        <p className="pixel-label" style={{ color: 'rgba(179,68,108,0.55)', marginBottom: 8 }}>
          property of
        </p>
        <h2 style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 30,
          color: 'var(--pixel-ink)',
          lineHeight: 1.3,
          margin: 0,
        }}>
          Nikki<br />Rana
        </h2>
      </div>

      <div className="pixel-divider" />

      {/* To-do list */}
      <div>
        <p className="pixel-label" style={{ color: 'rgba(179,68,108,0.6)', marginBottom: 12 }}>
          to-do
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TODO_ITEMS.map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: 13,
                color: item.done ? '#B3446C' : 'rgba(179,68,108,0.5)',
                flexShrink: 0,
                lineHeight: 1.5,
              }}>
                {item.done ? '[x]' : '[ ]'}
              </span>
              <span style={{
                fontSize: 13,
                color: 'var(--pixel-ink)',
                opacity: item.done ? 0.38 : 0.7,
                lineHeight: 1.5,
                textDecoration: item.done ? 'line-through' : 'none',
              }}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="pixel-divider" />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <PixelStar color="#B3446C" />
          <PixelStar color="rgba(179,68,108,0.45)" />
          <PixelStar color="rgba(179,68,108,0.2)" />
        </div>
      </div>
    </div>
  )
}

// ─── Right page: tab content ───────────────────────────────────────────────────

function RightPage({ posts, activeTab }: { posts: Post[]; activeTab: Tab | null }) {
  if (!activeTab) {
    return (
      <div
        className="pixel-lined"
        style={{
          flex: 1,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <p style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 26,
          color: 'var(--pixel-ink)',
          textAlign: 'center',
          lineHeight: 1.7,
          opacity: 0.7,
        }}>
          pick a tab →<br />to start reading
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <PixelStar color="rgba(179,68,108,0.18)" />
          <PixelStar color="rgba(179,68,108,0.35)" />
          <PixelStar color="rgba(179,68,108,0.18)" />
        </div>
      </div>
    )
  }

  const tab = TABS.find(t => t.id === activeTab)!
  const filtered = posts.filter(p => p.metadata.category === activeTab)

  return (
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
      <h3 style={{
        fontFamily: 'var(--font-pixel), monospace',
        fontSize: 22,
        color: tab.color,
        lineHeight: 1.4,
        margin: '0 0 18px 0',
      }}>
        // {activeTab}
      </h3>

      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, opacity: 0.45, fontStyle: 'italic', color: 'var(--pixel-ink)' }}>
          Nothing here yet — check back soon.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((post, i) => (
            <li
              key={post.slug}
              style={{
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(179,68,108,0.12)' : 'none',
                padding: '16px 0',
              }}
            >
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    className="post-title"
                    style={{
                      fontFamily: 'var(--font-pixel), monospace',
                      fontSize: 20,
                      color: 'var(--pixel-ink)',
                      lineHeight: 1.4,
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {post.metadata.title}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 14,
                    color: 'rgba(179,68,108,0.65)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {formatDate(post.metadata.publishedAt)}
                  </span>
                </div>
                {post.metadata.summary && (
                  <p style={{
                    marginTop: 6,
                    fontSize: 14,
                    color: 'var(--pixel-ink)',
                    opacity: 0.55,
                    lineHeight: 1.65,
                  }}>
                    {post.metadata.summary}
                  </p>
                )}
                <span style={{
                  marginTop: 8,
                  display: 'inline-block',
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 16,
                  color: tab.color,
                  letterSpacing: '0.04em',
                }}>
                  read →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Open notebook two-page spread ────────────────────────────────────────────

function NotebookOpen({ posts, onClose }: { posts: Post[]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      border: '2px solid rgba(179,68,108,0.55)',
      boxShadow: '6px 6px 0 rgba(0,0,0,0.7)',
      overflow: 'hidden',
    }}>
      {/* ── Binding bar ─────────────────────────────────────────────────────── */}
      <div style={{
        background: '#B3446C',
        height: 32,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        borderBottom: '2px solid rgba(0,0,0,0.35)',
        flexShrink: 0,
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10,
            borderRadius: '50%',
            border: '2px solid rgba(0,0,0,0.45)',
            background: '#0a0809',
            flexShrink: 0,
          }} />
        ))}
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
      <div style={{
        display: 'flex',
        background: 'var(--pixel-paper-open)',
        minHeight: 560,
      }}>
        <LeftPage />
        <RightPage posts={posts} activeTab={activeTab} />
        <TabStrip activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--pixel-paper-open)',
        borderTop: '1px solid rgba(179,68,108,0.12)',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span className="pixel-label" style={{ color: 'rgba(179,68,108,0.4)' }}>nikki rana</span>
        <span className="pixel-label" style={{ color: 'rgba(179,68,108,0.4)' }}>
          {activeTab ? `// ${activeTab}` : 'pick a tab →'}
        </span>
      </div>
    </div>
  )
}

// ─── Closed notebook visual ───────────────────────────────────────────────────

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
      <div style={{
        width: 28,
        background: '#B3446C',
        borderRight: '2px solid rgba(0,0,0,0.35)',
        flexShrink: 0,
      }}>
        <SpineRings />
        <div style={{
          position: 'absolute', left: 0, top: '50%', width: 28,
          transform: 'translateY(-50%)',
          display: 'flex', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 11, color: '#fce7f3',
            writingMode: 'vertical-rl', textOrientation: 'mixed',
            transform: 'rotate(180deg)', letterSpacing: '0.08em', opacity: 0.8,
          }}>
            NIKKI
          </span>
        </div>
      </div>

      {/* Cover body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, gap: 16 }}>
        <div className="pixel-divider" style={{ marginBottom: 8 }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          <p className="pixel-label" style={{ color: '#B3446C', letterSpacing: '0.12em' }}>
            vol. 01
          </p>

          <h2 style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 32, color: 'var(--pixel-ink)',
            lineHeight: 1.3, margin: 0,
          }}>
            Nikki&apos;s<br />Notes
          </h2>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <PixelStar color="#B3446C" />
            <div style={{ height: 1, flex: 1, background: 'rgba(179,68,108,0.4)' }} />
            <PixelStar color="#B3446C" />
          </div>

          <p style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 14, color: 'rgba(179,68,108,0.7)',
            lineHeight: 1.6, letterSpacing: '0.04em',
          }}>
            thoughts, experiments,<br />and things i&apos;m learning
          </p>

          {/* Tab preview labels on cover */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {TABS.map(tab => (
              <span key={tab.id} style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: 11,
                color: tab.color,
                border: `1px solid ${tab.color}`,
                padding: '2px 8px',
                opacity: 0.75,
              }}>
                {tab.label}
              </span>
            ))}
          </div>
        </div>

        <div className="pixel-divider" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
          <PixelStar color="rgba(179,68,108,0.4)" />
          <PixelStar color="rgba(179,68,108,0.2)" />
        </div>
      </div>
    </div>
  )
}

// ─── Main scene ───────────────────────────────────────────────────────────────

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

  return (
    <section className="relative min-h-screen">
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
        <p className="pixel-label mb-6" style={{ color: 'var(--pixel-accent-pink)' }}>
          // blog
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

          {/* ── Closed ───────────────────────────────────────────────────────── */}
          {!isOpen && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
              animation: animating ? 'notebookClose 0.22s ease forwards' : undefined,
            }}>
              <button
                onClick={openNotebook}
                aria-label="Open Nikki's blog notebook"
                style={{ display: 'flex', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <NotebookClosed />
              </button>

              <div
                aria-hidden="true"
                style={{
                  width: 'clamp(140px, 20vw, 280px)',
                  aspectRatio: '71 / 14',
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
                style={{ color: 'rgba(179,68,108,0.65)', letterSpacing: '0.1em' }}
                aria-hidden="true"
              >
                click to open
              </p>
            </div>
          )}

          {/* ── Open ─────────────────────────────────────────────────────────── */}
          {isOpen && (
            <div
              ref={openPanelRef}
              tabIndex={-1}
              role="region"
              aria-label="Blog notebook — open"
              style={{
                width: '100%',
                maxWidth: 960,
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
