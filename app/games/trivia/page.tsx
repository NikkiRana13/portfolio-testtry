'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { triviaData, POINT_VALUES } from 'app/content/trivia'

// ─── Constants ─────────────────────────────────────────────────────────────────

const COLS          = triviaData.length       // 5
const ROWS          = POINT_VALUES.length     // 5
const MAX_SCORE     = POINT_VALUES.reduce((a, v) => a + v, 0) * COLS  // 7500
const LS_KEY        = 'game-trivia-hi'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase    = 'board' | 'clue' | 'answer'
type Selection = { row: number; col: number }

// ─── Board component ───────────────────────────────────────────────────────────

function Board({
  spent,
  onSelect,
}: {
  spent: boolean[][]
  onSelect: (row: number, col: number) => void
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          minWidth: 320,
        }}
      >
        {/* Category headers */}
        {triviaData.map((cat, c) => (
          <div
            key={c}
            className="flex items-center justify-center rounded-lg bg-[#B3446C]/20 px-1 py-3 ring-1 ring-[#B3446C]/30 text-center"
          >
            <span className="text-[10px] font-bold uppercase leading-tight tracking-widest text-[#B3446C]">
              {cat.name}
            </span>
          </div>
        ))}

        {/* Value tiles */}
        {POINT_VALUES.map((pts, r) =>
          triviaData.map((_, c) => {
            const isSpent = spent[r][c]
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => !isSpent && onSelect(r, c)}
                disabled={isSpent}
                aria-label={isSpent ? `$${pts} — used` : `$${pts} in ${triviaData[c].name}`}
                className={[
                  'flex items-center justify-center rounded-lg py-4 transition-all',
                  'ring-1',
                  isSpent
                    ? 'cursor-default opacity-20 ring-pink-900/20 bg-transparent'
                    : 'glass ring-pink-900/30 cursor-pointer hover:ring-[#B3446C]/60 hover:bg-[#B3446C]/10 active:scale-95',
                ].join(' ')}
              >
                <span
                  className={[
                    'font-mono text-lg font-bold',
                    isSpent ? 'text-pink-300/30' : 'text-yellow-400',
                  ].join(' ')}
                >
                  ${pts}
                </span>
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}

// ─── Clue / Answer reveal ──────────────────────────────────────────────────────

function ClueView({
  sel,
  phase,
  onReveal,
  onCorrect,
  onWrong,
  onBack,
}: {
  sel:       Selection
  phase:     Phase
  onReveal:  () => void
  onCorrect: () => void
  onWrong:   () => void
  onBack:    () => void
}) {
  const cat   = triviaData[sel.col]
  const q     = cat.questions[sel.row]
  const pts   = POINT_VALUES[sel.row]

  return (
    <div className="glass glass-ring p-8 text-center">
      {/* Category + point value label */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B3446C]">
          {cat.name}
        </span>
        <span className="text-xs text-pink-300/40">·</span>
        <span className="font-mono text-sm font-bold text-yellow-400">${pts}</span>
      </div>

      {/* Clue */}
      <p className="mx-auto mb-8 max-w-xl text-xl font-bold leading-relaxed text-pink-100 sm:text-2xl">
        {q.clue}
      </p>

      {phase === 'clue' && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onReveal}
            className="rounded-full bg-[#B3446C] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9B2A55]"
          >
            Reveal Answer
          </button>
          <button
            onClick={onBack}
            className="text-sm text-pink-300/40 transition-colors hover:text-pink-100"
          >
            ← Back to board
          </button>
        </div>
      )}

      {phase === 'answer' && (
        <div className="flex flex-col items-center gap-6">
          {/* Answer */}
          <p className="text-base italic text-pink-300/80 sm:text-lg">{q.answer}</p>

          {/* Grade buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onWrong}
              className="rounded-full bg-red-950/60 px-6 py-2.5 text-sm font-semibold text-red-300 ring-1 ring-red-800/50 transition-colors hover:bg-red-900/60"
            >
              ✗ Nope &nbsp;−${pts}
            </button>
            <button
              onClick={onCorrect}
              className="rounded-full bg-emerald-950/60 px-6 py-2.5 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-800/50 transition-colors hover:bg-emerald-900/60"
            >
              ✓ Got it &nbsp;+${pts}
            </button>
          </div>

          <button
            onClick={onBack}
            className="text-sm text-pink-300/40 transition-colors hover:text-pink-100"
          >
            ← Back without scoring
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Complete banner ───────────────────────────────────────────────────────────

function CompleteBanner({ score, onReset }: { score: number; onReset: () => void }) {
  const pct = Math.round((score / MAX_SCORE) * 100)
  return (
    <div className="glass glass-ring p-8 text-center">
      <p className="mb-2 text-3xl font-bold">board complete!</p>
      <p className="mb-1 text-sm text-pink-300/60">
        final score: <span className={`font-mono font-bold ${score < 0 ? 'text-red-400' : 'text-pink-100'}`}>{score}</span>
        {' / '}{MAX_SCORE}
      </p>
      <p className="mb-8 text-xs text-pink-300/40">{pct}% accuracy</p>
      <button
        onClick={onReset}
        className="rounded-full bg-[#B3446C] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9B2A55]"
      >
        Play Again
      </button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TriviaPage() {
  const [spent,    setSpent]    = useState<boolean[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(false)),
  )
  const [selected, setSelected] = useState<Selection | null>(null)
  const [phase,    setPhase]    = useState<Phase>('board')
  const [score,    setScore]    = useState(0)
  const [hiScore,  setHiScore]  = useState(0)

  // Load hi-score from localStorage after mount
  useEffect(() => {
    const n = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10)
    if (!isNaN(n)) setHiScore(n)
  }, [])

  // ── Actions ─────────────────────────────────────────────────────────────────

  function selectTile(row: number, col: number) {
    if (spent[row][col]) return
    setSelected({ row, col })
    setPhase('clue')
  }

  function revealAnswer() {
    setPhase('answer')
  }

  function grade(correct: boolean) {
    if (!selected) return
    const pts  = POINT_VALUES[selected.row]
    const next = score + (correct ? pts : -pts)

    setScore(next)

    if (next > hiScore) {
      setHiScore(next)
      localStorage.setItem(LS_KEY, String(next))
    }

    // Mark tile spent
    setSpent((prev) => {
      const updated = prev.map((row) => [...row])
      updated[selected.row][selected.col] = true
      return updated
    })

    setSelected(null)
    setPhase('board')
  }

  function abandonTile() {
    // Return to board without scoring; tile stays available
    setSelected(null)
    setPhase('board')
  }

  function resetGame() {
    setSpent(Array.from({ length: ROWS }, () => Array(COLS).fill(false)))
    setSelected(null)
    setPhase('board')
    setScore(0)
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const tilesLeft  = spent.flat().filter((s) => !s).length
  const isComplete = tilesLeft === 0 && phase === 'board'

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="relative min-h-screen">
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back */}
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
          <h1 className="text-3xl font-bold tracking-tight">Trivia</h1>
          <p className="mt-1 text-sm text-pink-300/50">how well do you know me?</p>
        </div>

        {/* Score bar */}
        <div className="glass glass-ring mb-4 flex flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-400/40">score</span>
            <span className={`font-mono text-xl font-bold ${score < 0 ? 'text-red-400' : ''}`}>
              {score}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-pink-300/40">
            {phase === 'board' && !isComplete && (
              <span>{tilesLeft} tiles left</span>
            )}
            <div className="flex items-center gap-2">
              <span>best: <span className="font-mono text-pink-400/60">{hiScore}</span></span>
            </div>
            <button
              onClick={resetGame}
              className="transition-colors hover:text-pink-100"
            >
              reset
            </button>
          </div>
        </div>

        {/* Main game area */}
        {isComplete ? (
          <CompleteBanner score={score} onReset={resetGame} />
        ) : phase === 'board' ? (
          <Board spent={spent} onSelect={selectTile} />
        ) : selected !== null ? (
          <ClueView
            sel={selected}
            phase={phase}
            onReveal={revealAnswer}
            onCorrect={() => grade(true)}
            onWrong={() => grade(false)}
            onBack={abandonTile}
          />
        ) : null}

        {/* Self-grading note */}
        {phase === 'board' && !isComplete && (
          <p className="mt-8 text-center text-xs text-pink-300/25">
            self-graded — be honest
          </p>
        )}
      </div>
    </main>
  )
}
