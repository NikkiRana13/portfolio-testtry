'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from 'app/projects/data'
import { timeline } from 'app/content/timeline'
import { interests } from 'app/content/interests'
import { heroLinks, gallery } from 'app/content/about'
import { Reveal } from 'app/components/reveal'
import { ProjectCard } from 'app/components/project-card'

// ─── Personal facts ────────────────────────────────────────────────────────────
// Edit these directly — they appear as a short list in the About Me section.
const facts = [
  '[Fact 1 — e.g. Born and raised in Cambridge, ON]',
  '[Fact 2 — e.g. Something you love outside of school]',
  '[Fact 3 — e.g. A quirk or fun detail about you]',
  '[Fact 4 — e.g. Something you\'re learning or excited about]',
]

// ─── Bio paragraphs ────────────────────────────────────────────────────────────
// Replace each string with a paragraph of your own writing.
const bio = [
  '[PLACEHOLDER — First paragraph. Introduce yourself: where you\'re from, what you study, and what draws you to it. Keep it honest and specific — generic bios are forgettable.]',
  '[PLACEHOLDER — Second paragraph. Get a little more personal. What drives you? What do you care about beyond grades and internships? What makes you, you?]',
]

export default function Page() {
  const [displayText, setDisplayText] = useState('')
  const message = "Hey, I'm Nikki. What's up?"

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setDisplayText(message.slice(0, i + 1))
      i++
      if (i === message.length) clearInterval(id)
    }, 80)
    return () => clearInterval(id)
  }, [])

  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0809] text-pink-100">
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
            <div className="w-44 h-44 sm:w-52 sm:h-52 lg:w-64 lg:h-64 flex-shrink-0 self-start rounded-2xl overflow-hidden bg-neutral-900/60 ring-1 ring-white/10">
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
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">
                {displayText}
                <span className="animate-pulse">|</span>
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

        {/* ── About Me ─────────────────────────────────────────────────────── */}
        <Reveal>
          <section className="glass glass-ring p-6 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">About Me</h2>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              {/* About photo */}
              <div className="md:w-56 lg:w-64 flex-shrink-0">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900/60 ring-1 ring-white/10">
                  {/* ↓ Replace with your about photo:
                      <Image src="/images/about.jpg" alt="Nikki" fill className="object-cover" />
                  */}
                  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 text-center p-4 leading-relaxed">
                    About photo
                    <br />
                    <span className="opacity-60">/public/images/about.jpg</span>
                  </div>
                </div>
              </div>

              {/* Bio + facts */}
              <div className="flex-1 min-w-0">
                <div className="space-y-4">
                  {bio.map((paragraph, i) => (
                    <p key={i} className="text-pink-200/80 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 border-t border-pink-900/30 pt-6">
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-pink-400/60">
                    A few things about me
                  </h3>
                  <ul className="space-y-2 text-sm text-pink-200/70">
                    {facts.map((fact, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#B3446C] select-none">–</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Photo gallery */}
            <div className="mt-10 border-t border-pink-900/30 pt-8">
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-pink-400/60">
                Moments
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((item, i) => (
                  <div key={i}>
                    <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900/60 ring-1 ring-white/10">
                      {item.src ? (
                        <Image
                          src={item.src}
                          alt={item.caption || `Photo ${i + 1}`}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500 text-center p-3 leading-relaxed">
                          Photo {i + 1}
                          <br />
                          <span className="opacity-60">Set src in about.ts</span>
                        </div>
                      )}
                    </div>
                    {item.caption && (
                      <p className="mt-1.5 text-xs text-pink-300/50 text-center">
                        {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </section>
        </Reveal>

        {/* ── Interests ────────────────────────────────────────────────────── */}
        <Reveal>
          <section className="glass glass-ring p-6 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">What I'm Into</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {interests.map((interest, i) => (
                <div
                  key={i}
                  className="card rounded-xl p-4 ring-1 ring-white/8"
                >
                  <p className="font-medium text-pink-100">{interest.label}</p>
                  <p className="mt-1 text-sm text-pink-300/55 leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

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
