'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from 'app/projects/data'
import { timeline } from 'app/content/timeline'
import { heroLinks, gallery } from 'app/content/about'
import { Reveal } from 'app/components/reveal'
import { ProjectCard } from 'app/components/project-card'
import { TerminalAbout } from 'app/components/terminal'

export default function Page() {
  const [displayText, setDisplayText] = useState('')
  const [done, setDone] = useState(false)
  const message = "Hey, I'm Nikki. What's up?"

  useEffect(() => {
    // Respect prefers-reduced-motion: show full text immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayText(message)
      setDone(true)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayText(message.slice(0, i))
      if (i === message.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 65)
    return () => clearInterval(id)
  }, [])

  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="glass glass-ring p-6 md:p-10">
          <div className="flex flex-col-reverse lg:flex-row items-start gap-8 lg:gap-14">

            {/* Profile photo */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 lg:w-64 lg:h-64 flex-shrink-0 mx-auto lg:mx-0 self-start rounded-2xl overflow-hidden bg-neutral-900/60 ring-1 ring-white/10">
              {/* ↓ Replace with your photo: place file at public/images/profile.jpg
                  then swap this div for:
                  <Image src="/images/profile.jpg" alt="Nikki Rana" fill className="object-cover" />
              */}
              <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 text-center p-4 leading-relaxed">
                Profile photo
                <br />
                <span className="opacity-60">/public/images/profile.jpg</span>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              {/* Pixel greeting — Press Start 2P, sized so it wraps gracefully on mobile */}
              <h1 className="mb-4 font-pixel font-pixel-hero drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: 'var(--font-pixel), monospace' }}>
                {displayText}
                {/* Blinking block cursor while typing; hides when text is complete */}
                {!done && (
                  <span
                    className="pixel-cursor-blink"
                    aria-hidden="true"
                    style={{ background: '#f9a8d4' }}
                  />
                )}
              </h1>
              <p className="max-w-xl text-pink-200/80 leading-relaxed text-lg">
                {/* Replace with your own short intro — 1–2 sentences max. */}
                I'm a Systems Design Engineering student at the University of Waterloo,
                interested in the space where product, design, and people meet.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {heroLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        link.primary
                          ? 'rounded-full bg-[#B3446C] px-5 py-2 text-sm font-medium text-pink-100 shadow-sm transition-all hover:brightness-110'
                          : 'rounded-full px-5 py-2 text-sm font-medium text-pink-300/70 ring-1 ring-pink-900/50 transition-all hover:bg-pink-950/40 hover:text-pink-200/80'
                      }
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={
                        link.primary
                          ? 'rounded-full bg-[#B3446C] px-5 py-2 text-sm font-medium text-pink-100 shadow-sm transition-all hover:brightness-110'
                          : 'rounded-full px-5 py-2 text-sm font-medium text-pink-300/70 ring-1 ring-pink-900/50 transition-all hover:bg-pink-950/40 hover:text-pink-200/80'
                      }
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Terminal (replaces About Me + Interests) ──────────────────── */}
        <Reveal>
          <TerminalAbout />
        </Reveal>

        {/* ── Photo gallery ─────────────────────────────────────────────── */}
        {gallery.some(item => item.src) && (
          <Reveal>
            <section className="glass glass-ring p-6 md:p-10">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-pink-400/60">
                Moments
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.filter(item => item.src).map((item, i) => (
                  <div key={i}>
                    <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900/60 ring-1 ring-white/10">
                      <Image
                        src={item.src}
                        alt={item.caption || `Photo ${i + 1}`}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {item.caption && (
                      <p className="mt-1.5 text-center text-xs text-pink-300/50">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Timeline ─────────────────────────────────────────────────────── */}
        <Reveal>
          <section className="glass glass-ring p-6 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">My Story</h2>

            <div className="relative pl-7 sm:pl-10">
              {/* Vertical connecting line */}
              <div
                className="absolute left-[9px] sm:left-[11px] top-1 bottom-4 w-px bg-pink-900/50"
                aria-hidden="true"
              />

              <div className="space-y-7">
                {timeline.map((entry, i) => {
                  const dateLabel =
                    !entry.endYear
                      ? `${entry.startYear} – present`
                      : entry.startYear === entry.endYear
                        ? entry.startYear
                        : `${entry.startYear} – ${entry.endYear}`

                  return (
                    <Reveal key={i} delay={i * 60}>
                      <div className="relative">
                        {/* Dot */}
                        <div
                          className="absolute -left-7 sm:-left-10 top-1.5 h-[10px] w-[10px] rounded-full bg-[#B3446C] ring-[3px] ring-[#B3446C]/20"
                          aria-hidden="true"
                        />
                        {/* Date */}
                        <p className="mb-1.5 text-xs font-medium tabular-nums text-pink-400/65">
                          {dateLabel}
                        </p>
                        {/* Card */}
                        <div className="card rounded-xl p-4 ring-1 ring-white/8">
                          <p className="font-semibold text-pink-100 leading-snug">
                            {entry.title}
                          </p>
                          {entry.organization && (
                            <p className="mt-0.5 text-sm text-pink-300/65">
                              {entry.organization}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-pink-100/65 leading-relaxed">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Featured Work ─────────────────────────────────────────────────── */}
        {featuredProjects.length > 0 && (
          <Reveal>
            <section className="glass glass-ring p-6 md:p-10">
              <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Featured Work</h2>
                  <p className="mt-1 text-sm text-pink-300/55">
                    A few things I've built and led.
                  </p>
                </div>
                <Link
                  href="/portfolio"
                  className="text-sm text-pink-300/65 transition-colors hover:text-pink-100"
                >
                  View full portfolio →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((p, idx) => (
                  <Reveal key={p.slug} delay={idx * 80}>
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            </section>
          </Reveal>
        )}

      </div>
    </main>
  )
}
