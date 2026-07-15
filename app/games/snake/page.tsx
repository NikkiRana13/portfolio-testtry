'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── Constants ─────────────────────────────────────────────────────────────────

const GRID     = 20
const CELL     = 20
const CANVAS_W = GRID * CELL  // 400
const CANVAS_H = GRID * CELL  // 400

const BASE_SPEED    = 160  // ms per tick
const MIN_SPEED     = 65   // ms (fastest)
const SPEED_UP_EVERY = 5   // score points between each speed increase

const LS_KEY = 'game-snake-hi'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Dir = 'U' | 'D' | 'L' | 'R'
type Pt  = { x: number; y: number }

const OPPOSITE: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' }
const DIR_FROM_KEY: Record<string, Dir> = {
  ArrowUp: 'U', KeyW: 'U',
  ArrowDown: 'D', KeyS: 'D',
  ArrowLeft: 'L', KeyA: 'L',
  ArrowRight: 'R', KeyD: 'R',
}

// ─── State factory ─────────────────────────────────────────────────────────────

function randFood(snake: Pt[]): Pt {
  let pt: Pt
  do {
    pt = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (snake.some((s) => s.x === pt.x && s.y === pt.y))
  return pt
}

type GameState = {
  snake:   Pt[]
  dir:     Dir
  nextDir: Dir
  food:    Pt
  score:   number
  speed:   number
}

function initState(): GameState {
  const snake: Pt[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
  return { snake, dir: 'R', nextDir: 'R', food: randFood(snake), score: 0, speed: BASE_SPEED }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef  = useRef<GameState>(initState())
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [status,  setStatus]  = useState<'idle' | 'running' | 'paused' | 'over'>('idle')
  const [score,   setScore]   = useState(0)
  const [hiScore, setHiScore] = useState(0)

  // ── Load hi-score on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const n = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10)
    if (!isNaN(n)) setHiScore(n)
  }, [])

  // ── Canvas render (reads only from refs — safe to call any time) ───────────
  function renderFrame() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { snake, food } = stateRef.current

    ctx.fillStyle = '#0a0809'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Grid lines
    ctx.strokeStyle = 'rgba(179,68,108,0.06)'
    ctx.lineWidth   = 1
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0);       ctx.lineTo(i * CELL, CANVAS_H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0,        i * CELL); ctx.lineTo(CANVAS_W, i * CELL); ctx.stroke()
    }

    // Food
    ctx.fillStyle = '#fce7f3'
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6)

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#f9a8d4' : '#B3446C'
      const p = i === 0 ? 1 : 2
      ctx.fillRect(seg.x * CELL + p, seg.y * CELL + p, CELL - p * 2, CELL - p * 2)
    })
  }

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // When not running, just re-draw the current state (shows idle/pause/over board)
    if (status !== 'running') {
      renderFrame()
      return
    }

    const tick = () => {
      const s = stateRef.current
      s.dir = s.nextDir

      const head = { x: s.snake[0].x, y: s.snake[0].y }
      if (s.dir === 'U') head.y--
      if (s.dir === 'D') head.y++
      if (s.dir === 'L') head.x--
      if (s.dir === 'R') head.x++

      // Wall or self collision → game over
      if (
        head.x < 0 || head.x >= GRID ||
        head.y < 0 || head.y >= GRID ||
        s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
      ) {
        renderFrame()
        setHiScore((prev) => {
          const next = Math.max(prev, s.score)
          localStorage.setItem(LS_KEY, String(next))
          return next
        })
        setStatus('over')
        return  // do NOT schedule another tick
      }

      s.snake.unshift(head)

      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++
        setScore(s.score)
        s.food = randFood(s.snake)
        if (s.score % SPEED_UP_EVERY === 0) {
          s.speed = Math.max(MIN_SPEED, s.speed - 12)
        }
      } else {
        s.snake.pop()
      }

      renderFrame()
      timerRef.current = setTimeout(tick, s.speed)
    }

    timerRef.current = setTimeout(tick, stateRef.current.speed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
    // renderFrame is defined in component scope and only reads refs — stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // ── Keyboard controls ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) && status === 'running') {
        e.preventDefault()
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (status === 'running') setStatus('paused')
        else if (status === 'paused') setStatus('running')
        return
      }

      if (status !== 'running') return
      const dir = DIR_FROM_KEY[e.code]
      if (!dir) return
      const s = stateRef.current
      if (dir !== OPPOSITE[s.dir]) s.nextDir = dir
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status])

  // ── Touch swipe on canvas ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (status !== 'running') return
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
      const dir: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U')
      const s = stateRef.current
      if (dir !== OPPOSITE[s.dir]) s.nextDir = dir
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [status])

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  // ── Actions ───────────────────────────────────────────────────────────────
  function startGame() {
    if (timerRef.current) clearTimeout(timerRef.current)
    stateRef.current = initState()
    setScore(0)
    setStatus('running')
  }

  function handleDpad(dir: Dir) {
    if (status !== 'running') return
    const s = stateRef.current
    if (dir !== OPPOSITE[s.dir]) s.nextDir = dir
  }

  // ── Initial draw ──────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { renderFrame() }, [])

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen bg-[#0a0809] text-pink-100">
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-lg px-4 py-10">
        {/* Back link */}
        <Link
          href="/games"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-pink-300/60 transition-colors hover:text-pink-100"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          back to games
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Snake</h1>
          <p className="mt-1 text-sm text-pink-300/50">eat the dots. don't hit the walls.</p>
        </div>

        {/* Score bar */}
        <div className="glass glass-ring mb-4 flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-400/40">score</span>
            <span className="font-mono text-xl font-bold">{score}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-400/40">best</span>
            <span className="font-mono text-xl font-bold text-pink-300/50">{hiScore}</span>
          </div>
          {status === 'running' && (
            <button
              onClick={() => setStatus('paused')}
              className="text-xs text-pink-300/40 transition-colors hover:text-pink-100"
            >
              pause
            </button>
          )}
          {status === 'paused' && (
            <button
              onClick={() => setStatus('running')}
              className="text-xs text-[#B3446C] transition-colors hover:text-pink-100"
            >
              resume
            </button>
          )}
        </div>

        {/* Canvas */}
        <div className="relative glass glass-ring overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: CANVAS_W,
              margin: '0 auto',
              imageRendering: 'pixelated',
            }}
          />

          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0a0809]/80">
              <p className="text-sm text-pink-300/50">arrow keys · WASD · swipe to move</p>
              <button
                onClick={startGame}
                className="rounded-full bg-[#B3446C] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9B2A55]"
              >
                Start
              </button>
            </div>
          )}

          {status === 'paused' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0a0809]/75">
              <p className="text-2xl font-bold">paused</p>
              <button
                onClick={() => setStatus('running')}
                className="rounded-full bg-[#B3446C] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9B2A55]"
              >
                Resume
              </button>
            </div>
          )}

          {status === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0809]/80">
              <p className="text-2xl font-bold">game over</p>
              <p className="text-sm text-pink-300/50">score: {score}</p>
              <button
                onClick={startGame}
                className="rounded-full bg-[#B3446C] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9B2A55]"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* D-pad for touch (hidden on ≥ sm because keyboard is available) */}
        <div className="mt-6 flex flex-col items-center gap-2 sm:hidden">
          <button
            onPointerDown={() => handleDpad('U')}
            className="flex h-12 w-12 items-center justify-center rounded-xl glass glass-ring text-lg select-none active:bg-[#B3446C]/20"
          >
            ↑
          </button>
          <div className="flex gap-8">
            <button
              onPointerDown={() => handleDpad('L')}
              className="flex h-12 w-12 items-center justify-center rounded-xl glass glass-ring text-lg select-none active:bg-[#B3446C]/20"
            >
              ←
            </button>
            <button
              onPointerDown={() => handleDpad('R')}
              className="flex h-12 w-12 items-center justify-center rounded-xl glass glass-ring text-lg select-none active:bg-[#B3446C]/20"
            >
              →
            </button>
          </div>
          <button
            onPointerDown={() => handleDpad('D')}
            className="flex h-12 w-12 items-center justify-center rounded-xl glass glass-ring text-lg select-none active:bg-[#B3446C]/20"
          >
            ↓
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-pink-300/25">Esc or P to pause</p>
      </div>
    </main>
  )
}
