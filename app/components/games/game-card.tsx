'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Game } from 'app/content/games'

// ── Pixel art previews ──────────────────────────────────────────────────────────

function SnakePreview() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="64"
      height="64"
      aria-hidden="true"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      <rect width="64" height="64" fill="#0a0809" />
      {[8, 16, 24, 32, 40, 48, 56].map((v) => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="64" stroke="rgba(179,68,108,0.10)" strokeWidth="1" />
          <line x1="0" y1={v} x2="64" y2={v} stroke="rgba(179,68,108,0.10)" strokeWidth="1" />
        </g>
      ))}
      {/* Food */}
      <rect x="9" y="9" width="6" height="6" fill="#fce7f3" />
      {/* Snake: tail → body → head (going right then turning down) */}
      <rect x="25" y="33" width="6" height="6" fill="#8B1A45" />
      <rect x="25" y="25" width="6" height="6" fill="#8B1A45" />
      <rect x="25" y="17" width="6" height="6" fill="#B3446C" />
      <rect x="33" y="17" width="6" height="6" fill="#B3446C" />
      {/* Head */}
      <rect x="41" y="16" width="7" height="7" fill="#f9a8d4" />
      {/* Eye */}
      <rect x="46" y="18" width="1" height="1" fill="#0a0809" />
    </svg>
  )
}

function BreakoutPreview() {
  const cols       = 4
  const blockW     = 13
  const gap        = 2
  const startX     = 2
  const rowColors  = ['#B3446C', '#f9a8d4', '#fce7f3']

  return (
    <svg
      viewBox="0 0 64 64"
      width="64"
      height="64"
      aria-hidden="true"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      <rect width="64" height="64" fill="#0a0809" />
      {rowColors.map((color, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={startX + c * (blockW + gap)}
            y={8 + r * 9}
            width={blockW}
            height={6}
            fill={color}
          />
        )),
      )}
      {/* Ball */}
      <circle cx="32" cy="44" r="3" fill="#fce7f3" />
      {/* Paddle */}
      <rect x="18" y="54" width="28" height="5" rx="2" fill="#B3446C" />
    </svg>
  )
}

const PREVIEWS: Record<string, ReactNode> = {
  snake:    <SnakePreview />,
  breakout: <BreakoutPreview />,
}

const DIFFICULTY_COLORS: Record<Game['difficulty'], string> = {
  easy:   'text-emerald-400/70 bg-emerald-950/40 ring-emerald-800/30',
  medium: 'text-yellow-400/70  bg-yellow-950/40  ring-yellow-800/30',
  hard:   'text-red-400/70     bg-red-950/40     ring-red-800/30',
}

// ── Component ──────────────────────────────────────────────────────────────────

export function GameCard({ game }: { game: Game }) {
  const [hiScore, setHiScore] = useState<number | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(game.storageKey)
    if (raw !== null) {
      const n = parseInt(raw, 10)
      if (!isNaN(n) && n > 0) setHiScore(n)
    }
  }, [game.storageKey])

  return (
    <Link
      href={game.href}
      className="glass glass-ring group block p-5 transition-all hover:ring-[#B3446C]/50"
    >
      <div className="flex items-start gap-4">
        {/* Pixel preview */}
        <div className="flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
          {PREVIEWS[game.id] ?? null}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-bold text-pink-100 transition-colors group-hover:text-white">
              {game.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${DIFFICULTY_COLORS[game.difficulty]}`}
            >
              {game.difficulty}
            </span>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-pink-300/60">
            {game.description}
          </p>

          <div className="flex items-center justify-between text-xs text-pink-300/40">
            <span>{game.controls}</span>
            {hiScore !== null && (
              <span className="font-mono text-pink-400/60">best: {hiScore}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
