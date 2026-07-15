'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── Constants ─────────────────────────────────────────────────────────────────

const CANVAS_W = 480
const CANVAS_H = 400

const BLOCK_COLS = 9
const BLOCK_ROWS = 5
const BLOCK_W    = 46
const BLOCK_H    = 14
const BLOCK_GAP  = 4
const BLOCK_TOP  = 40
// Centre the block grid horizontally
const BLOCK_LEFT = Math.round((CANVAS_W - (BLOCK_COLS * BLOCK_W + (BLOCK_COLS - 1) * BLOCK_GAP)) / 2)

const PADDLE_W     = 82
const PADDLE_H     = 10
const PADDLE_Y     = CANVAS_H - 28
const PADDLE_SPEED = 8

const BALL_R     = 7
const BALL_SPEED = 4.5

const INIT_LIVES = 3

// Row colours and point values (index 0 = topmost row)
const ROW_COLORS = ['#B3446C', '#db2777', '#f9a8d4', '#fce7f3', 'rgba(252,231,243,0.55)']
const ROW_POINTS = [30, 20, 15, 10, 5]

const LS_KEY = 'game-breakout-hi'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'running' | 'paused' | 'over' | 'won'

type Ball   = { x: number; y: number; vx: number; vy: number }
type Paddle = { x: number }

type GameState = {
  blocks:  boolean[][]
  ball:    Ball
  paddle:  Paddle
  lives:   number
  score:   number
  serving: boolean  // true = waiting for player to launch the ball
}

function makeBlocks(): boolean[][] {
  return Array.from({ length: BLOCK_ROWS }, () => Array(BLOCK_COLS).fill(true))
}

function initGameState(): GameState {
  return {
    blocks:  makeBlocks(),
    ball:    { x: CANVAS_W / 2, y: PADDLE_Y - BALL_R - 2, vx: 0, vy: 0 },
    paddle:  { x: (CANVAS_W - PADDLE_W) / 2 },
    lives:   INIT_LIVES,
    score:   0,
    serving: true,
  }
}

function launchBall(state: GameState) {
  // Angle from vertical: 25°–65° (varied, never too shallow or too steep)
  const fromVertical = (25 + Math.random() * 40) * (Math.PI / 180)
  const xDir = Math.random() > 0.5 ? 1 : -1
  state.ball.vx  = BALL_SPEED * Math.sin(fromVertical) * xDir
  state.ball.vy  = -BALL_SPEED * Math.cos(fromVertical)  // always upward
  state.serving  = false
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function BreakoutPage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const stateRef    = useRef<GameState>(initGameState())
  const rafRef      = useRef<number | null>(null)
  const keysRef     = useRef<Set<string>>(new Set())
  const statusRef   = useRef<Status>('idle')

  // Track previous score/lives so we only call setState when they change
  const prevScoreRef = useRef(0)
  const prevLivesRef = useRef(INIT_LIVES)

  const [status,  setStatus]  = useState<Status>('idle')
  const [score,   setScore]   = useState(0)
  const [lives,   setLives]   = useState(INIT_LIVES)
  const [hiScore, setHiScore] = useState(0)

  // Keep statusRef in sync so renderFrame (called from RAF) can read it
  useEffect(() => { statusRef.current = status }, [status])

  // Load hi-score
  useEffect(() => {
    const n = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10)
    if (!isNaN(n)) setHiScore(n)
  }, [])

  // ── Canvas render ─────────────────────────────────────────────────────────
  function renderFrame() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { blocks, ball, paddle, serving } = stateRef.current

    ctx.fillStyle = '#0a0809'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Blocks
    for (let r = 0; r < BLOCK_ROWS; r++) {
      for (let c = 0; c < BLOCK_COLS; c++) {
        if (!blocks[r][c]) continue
        const bx = BLOCK_LEFT + c * (BLOCK_W + BLOCK_GAP)
        const by = BLOCK_TOP  + r * (BLOCK_H + BLOCK_GAP)

        ctx.fillStyle = ROW_COLORS[r]
        ctx.fillRect(bx, by, BLOCK_W, BLOCK_H)

        // Top/left highlight
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        ctx.fillRect(bx, by, BLOCK_W, 2)
        ctx.fillRect(bx, by, 2, BLOCK_H)
        // Bottom shadow
        ctx.fillStyle = 'rgba(0,0,0,0.20)'
        ctx.fillRect(bx, by + BLOCK_H - 2, BLOCK_W, 2)
      }
    }

    // Paddle (rounded rectangle)
    const px = paddle.x
    const py = PADDLE_Y
    const cr = 5
    ctx.fillStyle = '#B3446C'
    ctx.beginPath()
    ctx.moveTo(px + cr, py)
    ctx.lineTo(px + PADDLE_W - cr, py)
    ctx.quadraticCurveTo(px + PADDLE_W, py,            px + PADDLE_W, py + cr)
    ctx.lineTo(px + PADDLE_W, py + PADDLE_H - cr)
    ctx.quadraticCurveTo(px + PADDLE_W, py + PADDLE_H, px + PADDLE_W - cr, py + PADDLE_H)
    ctx.lineTo(px + cr, py + PADDLE_H)
    ctx.quadraticCurveTo(px, py + PADDLE_H,            px, py + PADDLE_H - cr)
    ctx.lineTo(px, py + cr)
    ctx.quadraticCurveTo(px, py,                       px + cr, py)
    ctx.closePath()
    ctx.fill()
    // Paddle shine
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.fillRect(px + cr, py, PADDLE_W - cr * 2, 2)

    // Ball (with soft glow)
    ctx.shadowColor = 'rgba(249,168,212,0.55)'
    ctx.shadowBlur  = 12
    ctx.fillStyle   = '#fce7f3'
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Serving hint (only when ball is on paddle and game is running)
    if (serving && statusRef.current === 'running') {
      ctx.fillStyle    = 'rgba(252,231,243,0.40)'
      ctx.font         = '12px monospace'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('space · click · tap to launch', CANVAS_W / 2, CANVAS_H / 2)
    }
  }

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'running') {
      renderFrame()
      return
    }

    const loop = () => {
      const s = stateRef.current

      // Keyboard paddle movement
      if (keysRef.current.has('ArrowLeft'))  s.paddle.x = clamp(s.paddle.x - PADDLE_SPEED, 0, CANVAS_W - PADDLE_W)
      if (keysRef.current.has('ArrowRight')) s.paddle.x = clamp(s.paddle.x + PADDLE_SPEED, 0, CANVAS_W - PADDLE_W)

      if (s.serving) {
        // Ball rides on top of the paddle
        s.ball.x = s.paddle.x + PADDLE_W / 2
        s.ball.y = PADDLE_Y - BALL_R - 2
      } else {
        // ── Advance ball ──────────────────────────────────────────────────
        s.ball.x += s.ball.vx
        s.ball.y += s.ball.vy

        // Side walls
        if (s.ball.x - BALL_R < 0) {
          s.ball.x  = BALL_R; s.ball.vx = -s.ball.vx
        } else if (s.ball.x + BALL_R > CANVAS_W) {
          s.ball.x  = CANVAS_W - BALL_R; s.ball.vx = -s.ball.vx
        }
        // Top wall
        if (s.ball.y - BALL_R < 0) {
          s.ball.y  = BALL_R; s.ball.vy = -s.ball.vy
        }

        // Anti-stuck: ensure the ball always has a meaningful vertical component
        const spd = Math.hypot(s.ball.vx, s.ball.vy)
        if (Math.abs(s.ball.vy) < spd * 0.22) {
          const sign = s.ball.vy >= 0 ? 1 : -1
          s.ball.vy  = sign * spd * 0.32
          s.ball.vx  = Math.sign(s.ball.vx || 1) * Math.sqrt(Math.max(0, spd * spd - s.ball.vy * s.ball.vy))
        }

        // ── Paddle collision (only when ball is descending) ────────────────
        if (
          s.ball.vy > 0 &&
          s.ball.y + BALL_R >= PADDLE_Y &&
          s.ball.y - BALL_R <= PADDLE_Y + PADDLE_H &&
          s.ball.x >= s.paddle.x - BALL_R &&
          s.ball.x <= s.paddle.x + PADDLE_W + BALL_R
        ) {
          s.ball.y = PADDLE_Y - BALL_R
          // Map hit position to bounce angle: centre = straight up, edges = steep angle
          const hit   = (s.ball.x - (s.paddle.x + PADDLE_W / 2)) / (PADDLE_W / 2)  // −1 to 1
          const angle = hit * (Math.PI * 5 / 12)  // max ±75° from vertical
          s.ball.vx = spd * Math.sin(angle)
          s.ball.vy = -Math.abs(spd * Math.cos(angle))
        }

        // ── Block collisions ──────────────────────────────────────────────
        outer: for (let r = 0; r < BLOCK_ROWS; r++) {
          for (let c = 0; c < BLOCK_COLS; c++) {
            if (!s.blocks[r][c]) continue
            const bx = BLOCK_LEFT + c * (BLOCK_W + BLOCK_GAP)
            const by = BLOCK_TOP  + r * (BLOCK_H + BLOCK_GAP)

            // Circle vs AABB: find nearest point on block to ball centre
            const nearX = clamp(s.ball.x, bx, bx + BLOCK_W)
            const nearY = clamp(s.ball.y, by, by + BLOCK_H)
            const dx    = s.ball.x - nearX
            const dy    = s.ball.y - nearY

            if (dx * dx + dy * dy < BALL_R * BALL_R) {
              s.blocks[r][c] = false
              s.score += ROW_POINTS[r]

              // Reflect off closest side of block
              if (Math.abs(dx) >= Math.abs(dy)) {
                s.ball.vx = -s.ball.vx
                s.ball.x += dx >= 0 ? 1 : -1
              } else {
                s.ball.vy = -s.ball.vy
                s.ball.y += dy >= 0 ? 1 : -1
              }

              // Sync score to UI (only when changed)
              if (s.score !== prevScoreRef.current) {
                prevScoreRef.current = s.score
                setScore(s.score)
              }

              // Win check
              if (s.blocks.every((row) => row.every((b) => !b))) {
                renderFrame()
                setStatus('won')
                setHiScore((prev) => {
                  const next = Math.max(prev, s.score)
                  localStorage.setItem(LS_KEY, String(next))
                  return next
                })
                return  // exit loop — RAF not re-scheduled
              }

              break outer  // one block hit per frame
            }
          }
        }

        // ── Ball fell below paddle ────────────────────────────────────────
        if (s.ball.y - BALL_R > CANVAS_H) {
          s.lives--
          if (s.lives !== prevLivesRef.current) {
            prevLivesRef.current = s.lives
            setLives(s.lives)
          }
          if (s.lives <= 0) {
            renderFrame()
            setStatus('over')
            setHiScore((prev) => {
              const next = Math.max(prev, s.score)
              localStorage.setItem(LS_KEY, String(next))
              return next
            })
            return  // exit loop
          }
          // Reset ball to serve position
          s.serving = true
          s.ball.x  = s.paddle.x + PADDLE_W / 2
          s.ball.y  = PADDLE_Y - BALL_R - 2
        }
      }

      renderFrame()
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // ── Keyboard: direction keys (held) + Space to launch ─────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code)

      if (['ArrowLeft', 'ArrowRight'].includes(e.code) && status === 'running') {
        e.preventDefault()
      }
      if (e.code === 'Space' && status === 'running') {
        e.preventDefault()
        if (stateRef.current.serving) launchBall(stateRef.current)
      }
      if ((e.code === 'Escape' || e.code === 'KeyP') && (status === 'running' || status === 'paused')) {
        setStatus((prev) => (prev === 'running' ? 'paused' : 'running'))
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup',   onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup',   onKeyUp)
      keysRef.current.clear()
    }
  }, [status])

  // ── Mouse: move paddle, click to launch ───────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onMouseMove = (e: MouseEvent) => {
      const rect   = canvas.getBoundingClientRect()
      const scaleX = CANVAS_W / rect.width
      stateRef.current.paddle.x = clamp(
        (e.clientX - rect.left) * scaleX - PADDLE_W / 2,
        0,
        CANVAS_W - PADDLE_W,
      )
    }
    const onMouseDown = () => {
      if (status === 'running' && stateRef.current.serving) launchBall(stateRef.current)
    }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mousedown',  onMouseDown)
    return () => {
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mousedown',  onMouseDown)
    }
  }, [status])

  // ── Touch: drag to move paddle, tap to launch ─────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const movePaddle = (clientX: number) => {
      const rect   = canvas.getBoundingClientRect()
      const scaleX = CANVAS_W / rect.width
      stateRef.current.paddle.x = clamp(
        (clientX - rect.left) * scaleX - PADDLE_W / 2,
        0,
        CANVAS_W - PADDLE_W,
      )
    }

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      movePaddle(e.touches[0].clientX)
      if (status === 'running' && stateRef.current.serving) launchBall(stateRef.current)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      movePaddle(e.touches[0].clientX)
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove',  onTouchMove)
    }
  }, [status])

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ── Actions ───────────────────────────────────────────────────────────────
  function startGame() {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    const fresh = initGameState()
    stateRef.current    = fresh
    prevScoreRef.current = 0
    prevLivesRef.current = INIT_LIVES
    setScore(0)
    setLives(INIT_LIVES)
    setStatus('running')
  }

  // ── Initial draw ──────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { renderFrame() }, [])

  // ─── Render ────────────────────────────────────────────────────────────────
  const livesArr = Array.from({ length: INIT_LIVES }, (_, i) => i < lives)

  return (
    <main className="relative min-h-screen bg-[#0a0809] text-pink-100">
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-xl px-4 py-10">
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
          <h1 className="text-3xl font-bold tracking-tight">Breakout</h1>
          <p className="mt-1 text-sm text-pink-300/50">break all the bricks. don't let the ball fall.</p>
        </div>

        {/* Score bar */}
        <div className="glass glass-ring mb-4 flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-400/40">score</span>
            <span className="font-mono text-xl font-bold">{score}</span>
          </div>

          {/* Lives as dots */}
          <div className="flex items-center gap-2">
            {livesArr.map((alive, i) => (
              <span
                key={i}
                className="inline-block h-2.5 w-2.5 rounded-full transition-colors"
                style={{ background: alive ? '#B3446C' : 'rgba(179,68,108,0.18)' }}
              />
            ))}
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
              cursor: status === 'running' ? 'none' : 'default',
            }}
          />

          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#0a0809]/80">
              <p className="text-sm text-pink-300/50">mouse · touch · arrow keys to move</p>
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

          {status === 'won' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0809]/80">
              <p className="text-2xl font-bold">you win!</p>
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

        <p className="mt-6 text-center text-xs text-pink-300/25">Esc or P to pause</p>
      </div>
    </main>
  )
}
