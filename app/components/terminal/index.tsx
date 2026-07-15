'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { projects } from 'app/projects/data'
import { timeline } from 'app/content/timeline'
import { games } from 'app/content/games'
import { COMMAND_LIST, TERMINAL_CONTENT } from 'app/content/terminal'

// ═══════════════════════════════════════════════════════════════════════════════
//  TerminalAbout
//
//  An interactive fake terminal that lets visitors explore info about Nikki.
//  All editable content lives in app/content/terminal.ts.
//  Game/project/timeline data is pulled from existing data files.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Output types ──────────────────────────────────────────────────────────────

type TextLine    = { type: 'text' | 'heading' | 'accent' | 'dim' | 'error' | 'success'; content: string }
type BlankLine   = { type: 'blank' }
type LinkLine    = { type: 'link';    content: string; href: string }
type ButtonsLine = { type: 'buttons'; buttons: Array<{ label: string; href: string; primary?: boolean }> }

type OutputLine  = TextLine | BlankLine | LinkLine | ButtonsLine
type HistoryItem = { command: string; output: OutputLine[] }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PROMPT = 'nikki@portfolio:~$'

function blank(): BlankLine { return { type: 'blank' } }
function text(content: string): TextLine { return { type: 'text', content } }
function dim(content: string): TextLine  { return { type: 'dim', content } }
function accent(content: string): TextLine { return { type: 'accent', content } }
function heading(content: string): TextLine { return { type: 'heading', content } }
function link(content: string, href: string): LinkLine { return { type: 'link', content, href } }

// ─── Command output generators ────────────────────────────────────────────────
// Each returns OutputLine[] — pure functions, no side effects.

function helpOutput(): OutputLine[] {
  const lines: OutputLine[] = [
    heading('available commands'),
    blank(),
  ]
  COMMAND_LIST.forEach(cmd => {
    lines.push(text(`  ${cmd.name.padEnd(22)}${cmd.desc}`))
  })
  lines.push(blank())
  lines.push(dim('  ↑/↓ to navigate history  ·  Tab to autocomplete  ·  clear to reset'))
  return lines
}

function aboutOutput(): OutputLine[] {
  const { bio, facts, identity } = TERMINAL_CONTENT
  const lines: OutputLine[] = [
    heading(`about ${identity.name.toLowerCase()}`),
    blank(),
  ]
  bio.forEach(p => {
    lines.push(text(`  ${p}`))
    lines.push(blank())
  })
  lines.push(accent('  ── quick facts ──────────────────────────'))
  facts.forEach(f => lines.push(text(`  –  ${f}`)))
  return lines
}

function whoamiOutput(): OutputLine[] {
  const { identity } = TERMINAL_CONTENT
  return [
    blank(),
    accent(`  ${identity.name}`),
    text(`  ${identity.title}`),
    text(`  ${identity.roles.join(' · ')}`),
    text(`  ${identity.university}`),
    dim(`  ${identity.location}`),
    blank(),
  ]
}

function interestsOutput(): OutputLine[] {
  const lines: OutputLine[] = [heading('interests'), blank()]
  Object.entries(TERMINAL_CONTENT.interests).forEach(([category, items]) => {
    lines.push(accent(`  ── ${category}`))
    ;(items as string[]).forEach(item => lines.push(text(`    ·  ${item}`)))
    lines.push(blank())
  })
  return lines
}

function currentlyOutput(): OutputLine[] {
  const c = TERMINAL_CONTENT.currently
  return [
    heading('currently'),
    blank(),
    dim('  building'),
    text(`    ${c.building}`),
    blank(),
    dim('  learning'),
    text(`    ${c.learning}`),
    blank(),
    dim('  reading'),
    text(`    ${c.reading}`),
    blank(),
    dim('  exploring'),
    text(`    ${c.exploring}`),
    blank(),
    dim('  looking forward to'),
    text(`    ${c.lookingForwardTo}`),
    blank(),
  ]
}

function projectsOutput(): OutputLine[] {
  const featured = projects.filter(p => p.featured)
  const lines: OutputLine[] = [heading('featured projects'), blank()]
  featured.forEach(p => {
    lines.push(link(`  ▸  ${p.title}`, `/projects/${p.slug}`))
    if (p.shortDescription) lines.push(dim(`     ${p.shortDescription}`))
    lines.push(blank())
  })
  lines.push(dim('  Run `portfolio` to see all projects.'))
  return lines
}

function experienceOutput(): OutputLine[] {
  const lines: OutputLine[] = [heading('experience'), blank()]
  // Show all timeline entries (work, education, leadership)
  timeline.forEach(entry => {
    const date = !entry.endYear
      ? `${entry.startYear} – present`
      : entry.startYear === entry.endYear
        ? entry.startYear
        : `${entry.startYear} – ${entry.endYear}`
    const tag = entry.type === 'work' ? '[work]' : entry.type === 'education' ? '[edu] ' : '[ldrs]'
    lines.push(accent(`  ${tag}  ${entry.title}`))
    if (entry.organization) lines.push(dim(`         ${entry.organization}  ·  ${date}`))
    lines.push(text(`         ${entry.description}`))
    lines.push(blank())
  })
  return lines
}

function gamesOutput(): OutputLine[] {
  const lines: OutputLine[] = [heading('mini games'), blank()]
  games.forEach(g => {
    lines.push(link(`  ▸  ${g.title}`, g.href))
    lines.push(dim(`     ${g.description}`))
    lines.push(blank())
  })
  lines.push(link('  → visit the games hub', '/games'))
  return lines
}

function portfolioOutput(): OutputLine[] {
  return [
    blank(),
    { type: 'success', content: '  → opening portfolio…' },
    blank(),
    link('  /portfolio', '/portfolio'),
    blank(),
  ]
}

function resumeOutput(): OutputLine[] {
  const { resume } = TERMINAL_CONTENT.contact
  const isSet = resume && resume !== '#'
  return [
    heading('resume'),
    blank(),
    isSet
      ? link('  → View / Download Resume', resume)
      : dim("  Resume not yet linked. Update contact.resume in app/content/terminal.ts."),
    blank(),
  ]
}

function contactOutput(): OutputLine[] {
  const { email, linkedin, github } = TERMINAL_CONTENT.contact
  const lines: OutputLine[] = [heading('contact'), blank()]
  if (email)    { lines.push(dim('  email'));    lines.push(link(`  ${email}`, `mailto:${email}`));    lines.push(blank()) }
  if (linkedin) { lines.push(dim('  linkedin')); lines.push(link('  linkedin.com/in/nikkirana1', linkedin)); lines.push(blank()) }
  if (github)   { lines.push(dim('  github'));   lines.push(link('  @nrana13', github));               lines.push(blank()) }
  return lines
}

function coffeeOutput(): OutputLine[] {
  return [
    blank(),
    accent('  ☕  always up for a coffee chat.'),
    blank(),
    text(`  ${TERMINAL_CONTENT.coffeeMessage}`),
    blank(),
    link('  → reach out on LinkedIn', TERMINAL_CONTENT.contact.linkedin),
    blank(),
  ]
}

function jokeOutput(): OutputLine[] {
  const { jokes } = TERMINAL_CONTENT
  const joke = jokes[Math.floor(Math.random() * jokes.length)]
  return [blank(), text(`  ${joke}`), blank()]
}

function fortuneOutput(): OutputLine[] {
  const { fortunes } = TERMINAL_CONTENT
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)]
  return [blank(), accent(`  "${fortune}"`), blank()]
}

function duckOutput(): OutputLine[] {
  return [
    blank(),
    dim('        __'),
    dim('    ___( o)>'),
    dim('    \\ <_. )'),
    dim("     `---'"),
    blank(),
    text('  quack.'),
    blank(),
  ]
}

function hireOutput(): OutputLine[] {
  const { resume } = TERMINAL_CONTENT.contact
  return [
    blank(),
    dim('  [sudo] password for visitor: ••••••••'),
    blank(),
    { type: 'success', content: '  ✓  Access granted.' },
    accent('     Great taste, honestly.'),
    blank(),
    text('  What would you like to do next?'),
    {
      type: 'buttons',
      buttons: [
        { label: 'View Resume',   href: resume && resume !== '#' ? resume : '#', primary: true },
        { label: 'View Projects', href: '/portfolio' },
        { label: 'Contact Me',    href: `mailto:${TERMINAL_CONTENT.contact.email}` },
      ],
    },
    blank(),
  ]
}

function errorOutput(raw: string): OutputLine[] {
  return [
    { type: 'error', content: `  Command not found: ${raw}` },
    dim('  Type `help` or choose a command from the list below.'),
  ]
}

// ─── Command dispatcher ────────────────────────────────────────────────────────

function getOutput(raw: string): OutputLine[] {
  switch (raw.trim().toLowerCase()) {
    case 'help':            return helpOutput()
    case 'about':           return aboutOutput()
    case 'whoami':          return whoamiOutput()
    case 'interests':       return interestsOutput()
    case 'currently':       return currentlyOutput()
    case 'projects':        return projectsOutput()
    case 'experience':      return experienceOutput()
    case 'games':           return gamesOutput()
    case 'portfolio':       return portfolioOutput()
    case 'resume':          return resumeOutput()
    case 'contact':         return contactOutput()
    case 'coffee':          return coffeeOutput()
    case 'joke':            return jokeOutput()
    case 'fortune':         return fortuneOutput()
    case 'duck':            return duckOutput()
    case 'sudo hire nikki': return hireOutput()
    default:                return errorOutput(raw.trim())
  }
}

// ─── Line renderer ─────────────────────────────────────────────────────────────

function OutputLineEl({ line }: { line: OutputLine }) {
  if (line.type === 'blank')   return <div className="h-1.5" aria-hidden="true" />
  if (line.type === 'heading') return <div className="mt-3 mb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B3446C]">{line.content}</div>
  if (line.type === 'accent')  return <div className="text-pink-300">{line.content}</div>
  if (line.type === 'dim')     return <div className="text-pink-300/40">{line.content}</div>
  if (line.type === 'error')   return <div className="text-red-400">{line.content}</div>
  if (line.type === 'success') return <div className="text-emerald-400">{line.content}</div>

  if (line.type === 'link') {
    const isExternal = line.href.startsWith('http') || line.href.startsWith('mailto:')
    const cls = 'text-[#B3446C] underline underline-offset-2 decoration-[#B3446C]/40 hover:text-pink-200 transition-colors'
    return (
      <div>
        {isExternal
          ? <a href={line.href} target="_blank" rel="noopener noreferrer" className={cls}>{line.content}</a>
          : <Link href={line.href} className={cls}>{line.content}</Link>
        }
      </div>
    )
  }

  if (line.type === 'buttons') {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {line.buttons.map((btn, i) => {
          const isExt = btn.href.startsWith('http') || btn.href.startsWith('mailto:')
          const cls = btn.primary
            ? 'rounded-full bg-[#B3446C] px-4 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110'
            : 'rounded-full px-4 py-1.5 text-xs font-medium text-pink-300/70 ring-1 ring-pink-900/50 transition-all hover:bg-pink-950/40 hover:text-pink-200'
          return isExt
            ? <a key={i} href={btn.href} target={btn.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className={cls}>{btn.label}</a>
            : <Link key={i} href={btn.href} className={cls}>{btn.label}</Link>
        })}
      </div>
    )
  }

  // default: text
  return <div className="leading-relaxed text-pink-100/85">{line.content}</div>
}

// ─── Main component ────────────────────────────────────────────────────────────

export function TerminalAbout() {
  const [history,       setHistory]      = useState<HistoryItem[]>([])
  const [input,         setInput]         = useState('')
  const [cmdHistory,    setCmdHistory]    = useState<string[]>([])
  const [cmdHistIdx,    setCmdHistIdx]    = useState(-1)  // -1 = not navigating history
  const [menuOpen,      setMenuOpen]      = useState(true)
  const [menuIdx,       setMenuIdx]       = useState(-1)  // -1 = nothing highlighted
  const [announcement,  setAnnouncement]  = useState('')  // for sr-only live region

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const menuRef   = useRef<HTMLDivElement>(null)

  // Scroll output to bottom after each new command
  useEffect(() => {
    if (!outputRef.current) return
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    outputRef.current.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [history])

  // Scroll the highlighted menu item into view
  useEffect(() => {
    if (!menuRef.current || menuIdx < 0) return
    const el = menuRef.current.children[menuIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [menuIdx])

  // Filtered command list (updates as user types)
  const filtered = input
    ? COMMAND_LIST.filter(c =>
        c.name.startsWith(input.toLowerCase()) ||
        c.name.includes(input.toLowerCase())
      )
    : COMMAND_LIST

  // Run a command string
  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([])
      setInput('')
      setCmdHistIdx(-1)
      setAnnouncement('Terminal cleared.')
      return
    }

    const output = getOutput(trimmed)
    setHistory(prev => [...prev, { command: trimmed, output }])
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)])
    setInput('')
    setCmdHistIdx(-1)
    setMenuIdx(-1)

    // Announce to screen readers (plain text only)
    const text = output
      .filter((l): l is TextLine | LinkLine => 'content' in l)
      .map(l => l.content.trim())
      .filter(Boolean)
      .join('. ')
    setAnnouncement(text)
  }, [])

  // Keyboard handler for the text input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter — run highlighted menu item or current input
    if (e.key === 'Enter') {
      e.preventDefault()
      if (menuOpen && menuIdx >= 0 && filtered[menuIdx]) {
        runCommand(filtered[menuIdx].name)
      } else {
        runCommand(input)
      }
      return
    }

    // Tab — autocomplete from menu
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = menuIdx >= 0 ? filtered[menuIdx] : filtered[0]
      if (target) { setInput(target.name); setMenuIdx(-1) }
      return
    }

    // Escape — close menu
    if (e.key === 'Escape') {
      setMenuOpen(false)
      setMenuIdx(-1)
      return
    }

    // Arrow keys — navigate menu (when open) or command history (when closed)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (menuOpen && filtered.length > 0) {
        setMenuIdx(prev => (prev >= filtered.length - 1 ? 0 : prev + 1))
      } else {
        const next = Math.max(-1, cmdHistIdx - 1)
        setCmdHistIdx(next)
        setInput(next < 0 ? '' : cmdHistory[next])
      }
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (menuOpen && filtered.length > 0) {
        setMenuIdx(prev => (prev <= 0 ? filtered.length - 1 : prev - 1))
      } else {
        const next = Math.min(cmdHistory.length - 1, cmdHistIdx + 1)
        setCmdHistIdx(next)
        if (next >= 0) setInput(cmdHistory[next])
      }
      return
    }
  }

  return (
    <section aria-label="Interactive terminal — explore info about Nikki">

      {/* Screen reader live region — only the last output, not the full history */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="glass glass-ring overflow-hidden">

        {/* ── Title bar ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 border-b border-pink-900/30 px-4 py-3 select-none"
          aria-hidden="true"
        >
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/55" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/55" />
            <span className="h-3 w-3 rounded-full bg-green-500/55" />
          </span>
          <span className="ml-2 font-mono text-xs text-pink-300/45">{PROMPT}</span>
        </div>

        {/* ── Scrollable output ─────────────────────────────────────────── */}
        {/*
            Not aria-live — the sr-only region above handles announcements.
            Keeping this visible so keyboard/mouse users can navigate output links.
        */}
        <div
          ref={outputRef}
          className="h-64 overflow-y-auto px-4 py-3 font-mono text-sm sm:h-72"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Welcome message */}
          <div className="mb-4 text-pink-300/50 leading-relaxed">
            <p>Welcome to Nikki&apos;s terminal. <span className="text-[#B3446C]">✦</span></p>
            <p>Type a command or choose one from the list below.</p>
            <p>Try <span className="text-[#B3446C]">`help`</span> to see what&apos;s available.</p>
          </div>

          {/* Command history */}
          {history.map((entry, i) => (
            <div key={i} className="mb-3">
              {/* Echoed command */}
              <div>
                <span className="text-[#B3446C] select-none">{PROMPT} </span>
                <span className="text-pink-100">{entry.command}</span>
              </div>
              {/* Output lines */}
              <div className="mt-1">
                {entry.output.map((line, j) => (
                  <OutputLineEl key={j} line={line} />
                ))}
              </div>
            </div>
          ))}

          <div aria-hidden="true" className="h-1" />
        </div>

        {/* ── Input row ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-t border-pink-900/30 px-4 py-2.5">
          <span
            className="flex-shrink-0 select-none font-mono text-xs text-[#B3446C]"
            aria-hidden="true"
          >
            {PROMPT}
          </span>

          <input
            ref={inputRef}
            type="text"
            value={input}
            aria-label="Terminal input. Type a command and press Enter, or use the command list below."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-sm text-pink-100 caret-[#B3446C] outline-none placeholder:text-pink-300/25 focus:outline-none"
            placeholder="type a command…"
            onChange={e => {
              setInput(e.target.value)
              setMenuIdx(-1)
              if (!menuOpen) setMenuOpen(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setMenuOpen(true)}
          />

          {/* Toggle for the command menu */}
          <button
            type="button"
            aria-label={menuOpen ? 'Collapse command list' : 'Expand command list'}
            aria-expanded={menuOpen}
            aria-controls="terminal-cmd-menu"
            onClick={() => setMenuOpen(o => !o)}
            className="flex-shrink-0 select-none text-xs text-pink-300/40 transition-colors hover:text-pink-100"
          >
            {menuOpen ? '▲ hide' : '▼ commands'}
          </button>
        </div>

        {/* ── Command menu ──────────────────────────────────────────────── */}
        {menuOpen && (
          <div
            id="terminal-cmd-menu"
            role="listbox"
            aria-label="Available commands — click or use arrow keys to select"
            ref={menuRef}
            className="max-h-52 overflow-y-auto border-t border-pink-900/30"
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-3 font-mono text-xs text-pink-300/40">
                no commands match &ldquo;{input}&rdquo;
              </div>
            ) : (
              filtered.map((cmd, i) => (
                <button
                  key={cmd.name}
                  type="button"
                  role="option"
                  aria-selected={i === menuIdx}
                  // onMouseDown prevents blur on the input before the click fires
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    runCommand(cmd.name)
                    inputRef.current?.focus()
                  }}
                  className={[
                    'flex w-full items-center gap-3 px-4 py-2 text-left font-mono text-sm transition-colors',
                    i === menuIdx
                      ? 'bg-[#B3446C]/15 text-pink-100'
                      : 'text-pink-300/65 hover:bg-pink-950/50 hover:text-pink-100',
                  ].join(' ')}
                >
                  <span className="w-[148px] flex-shrink-0 text-[13px] text-[#B3446C]">
                    {cmd.name}
                  </span>
                  <span className="truncate text-xs text-pink-300/40">{cmd.desc}</span>
                </button>
              ))
            )}
          </div>
        )}

      </div>
    </section>
  )
}
