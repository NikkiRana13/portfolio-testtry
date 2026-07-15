'use client'
import { useState } from 'react'
import { projects, FILTERS } from 'app/projects/data'
import type { CategoryId } from 'app/projects/data'
import { Reveal } from 'app/components/reveal'
import { ProjectCard } from 'app/components/project-card'

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | CategoryId>('all')

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter))

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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <section className="glass glass-ring p-6 md:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-pixel font-pixel-xl drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
                style={{ fontFamily: 'var(--font-pixel), monospace' }}>
              // portfolio
            </h1>
            <p className="mt-3 text-pink-200/70 max-w-xl">
              Things I've built, organised, researched, and shipped.
            </p>
          </div>

          {/* Filter pills */}
          <div
            role="group"
            aria-label="Filter projects by category"
            className="mb-8 flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id as 'all' | CategoryId)}
                  aria-pressed={isActive}
                  className={[
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3446C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0809]',
                    isActive
                      ? 'bg-[#B3446C] text-pink-100 shadow-sm'
                      : 'bg-pink-950/50 text-pink-300/60 ring-1 ring-pink-900/40 hover:bg-pink-900/40 hover:text-pink-200/80',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Grid or empty state */}
          {filteredProjects.length === 0 ? (
            <p className="py-12 text-center text-sm text-pink-300/50">
              No projects in this category yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProjects.map((p, idx) => (
                <Reveal key={`${p.slug}-${activeFilter}`} delay={idx * 80}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}

        </section>
      </div>
    </main>
  )
}
