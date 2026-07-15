'use client'
import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useReducer, useState,
} from 'react'
import { FLOWERS, LS_KEY, TOTAL_FLOWERS } from 'app/content/flowers'

// ─── State ───────────────────────────────────────────────────────────────────

type State = {
  collected:     string[]   // flower ids
  isComplete:    boolean
  justCompleted: boolean    // briefly true when the last flower is collected
}

type Action =
  | { type: 'HYDRATE';          ids: string[] }
  | { type: 'COLLECT';          id: string }
  | { type: 'RESET' }
  | { type: 'CLEAR_COMPLETE' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE': {
      const valid = action.ids.filter(id => FLOWERS.some(f => f.id === id))
      return { collected: valid, isComplete: valid.length === TOTAL_FLOWERS, justCompleted: false }
    }
    case 'COLLECT': {
      if (state.collected.includes(action.id)) return state
      const next = [...state.collected, action.id]
      const isComplete = next.length === TOTAL_FLOWERS
      return { collected: next, isComplete, justCompleted: isComplete }
    }
    case 'RESET':
      return { collected: [], isComplete: false, justCompleted: false }
    case 'CLEAR_COMPLETE':
      return { ...state, justCompleted: false }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

type CtxValue = {
  collected:      string[]
  isComplete:     boolean
  justCompleted:  boolean
  hydrated:       boolean
  isCollected:    (id: string) => boolean
  collect:        (id: string) => void
  reset:          () => void
  clearComplete:  () => void
}

const Ctx = createContext<CtxValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function FlowerCollectionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    collected: [], isComplete: false, justCompleted: false,
  })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) dispatch({ type: 'HYDRATE', ids: parsed as string[] })
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(LS_KEY, JSON.stringify(state.collected)) } catch {}
  }, [state.collected, hydrated])

  const collect       = useCallback((id: string) => dispatch({ type: 'COLLECT', id }), [])
  const reset         = useCallback(() => dispatch({ type: 'RESET' }), [])
  const clearComplete = useCallback(() => dispatch({ type: 'CLEAR_COMPLETE' }), [])
  const isCollected   = useCallback(
    (id: string) => state.collected.includes(id),
    [state.collected],
  )

  const value = useMemo<CtxValue>(() => ({
    collected: state.collected,
    isComplete: state.isComplete,
    justCompleted: state.justCompleted,
    hydrated,
    isCollected,
    collect,
    reset,
    clearComplete,
  }), [state, hydrated, isCollected, collect, reset, clearComplete])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useFlowerCollection(): CtxValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useFlowerCollection must be inside FlowerCollectionProvider')
  return ctx
}
