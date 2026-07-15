import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects, getProject } from 'app/projects/data'
import type { Project } from 'app/projects/data'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: `${baseUrl}/projects/${project.slug}`,
    },
  }
}

// ─── Shared label style ────────────────────────────────────────────────────────

const LABEL_CLASS =
  'text-xs font-semibold uppercase tracking-widest text-pink-400/55'

// ─── Main content sections ─────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-pink-900/40 pt-7 mt-7 first:border-0 first:pt-0 first:mt-0">
      <h2 className={`mb-3 ${LABEL_CLASS}`}>{label}</h2>
      {children}
    </div>
  )
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function ExternalArrow() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0 opacity-60"
    >
      <path
        d="M1.5 8.5l7-7M5 1.5h3v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectSidebar({ project }: { project: Project }) {
  // Build the visible row list — each null entry is simply skipped.
  // This avoids border/padding issues with conditional Tailwind `first:` classes.
  type Row = { label: string; content: React.ReactNode }

  const rows: Row[] = []

  if (project.projectType) {
    rows.push({
      label: 'Type',
      content: (
        <span className="inline-block rounded-full bg-pink-950/50 px-3 py-0.5 text-xs font-medium text-pink-300 ring-1 ring-pink-800/40">
          {project.projectType}
        </span>
      ),
    })
  }

  if (project.timeline) {
    rows.push({
      label: 'Timeline',
      content: <p className="text-sm text-pink-100/80">{project.timeline}</p>,
    })
  }

  if (project.organization) {
    rows.push({
      label: 'Organization',
      content: (
        <p className="text-sm text-pink-100/80">{project.organization}</p>
      ),
    })
  }

  if (project.roleTitle) {
    rows.push({
      label: 'Role',
      content: (
        <p className="text-sm text-pink-100/80">{project.roleTitle}</p>
      ),
    })
  }

  if (project.team && project.team.length > 0) {
    rows.push({
      label: 'Team',
      content: (
        <ul className="space-y-1">
          {project.team.map((member) => (
            <li key={member} className="text-sm text-pink-100/80">
              {member}
            </li>
          ))}
        </ul>
      ),
    })
  }

  if (project.tools && project.tools.length > 0) {
    rows.push({
      label: 'Stack',
      content: (
        <div className="flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-md bg-pink-950/50 px-2.5 py-0.5 text-xs text-pink-300/90 ring-1 ring-pink-800/40"
            >
              {tool}
            </span>
          ))}
        </div>
      ),
    })
  }

  if (project.links && project.links.length > 0) {
    rows.push({
      label: 'Links',
      content: (
        <ul className="space-y-2">
          {project.links.map((link) => (
            <li key={link.label + link.href}>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="inline-flex items-center gap-1.5 text-sm text-[#B3446C] transition-colors hover:text-pink-200"
              >
                {link.label}
                <ExternalArrow />
              </a>
            </li>
          ))}
        </ul>
      ),
    })
  }

  if (rows.length === 0) return null

  return (
    <div>
      <p className={`${LABEL_CLASS} mb-4`}>At a glance</p>
      <div>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`py-4 ${i > 0 ? 'border-t border-pink-900/30' : ''}`}
          >
            <p className={`mb-2 ${LABEL_CLASS}`}>{row.label}</p>
            {row.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) notFound()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0809] text-pink-100">
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      {/* Wider container to fit sidebar beside content */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Back button */}
        <Link
          href="/portfolio"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-pink-300/60 transition-colors hover:text-pink-100"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path
              d="M9 2.5L4.5 7L9 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to portfolio
        </Link>

        {/*
          Two-column layout:
            mobile  → sidebar card stacked above main content (flex-col)
            desktop → sidebar pinned to the right, main content takes remaining width
        */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Main content ─────────────────────────────────────────────── */}
          {/* order-2 on mobile so sidebar card appears first */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="glass glass-ring p-6 md:p-10">

              {/* Cover image */}
              <div className="relative mb-8 overflow-hidden rounded-xl ring-1 ring-white/10">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={`${project.title} cover`}
                    width={900}
                    height={450}
                    className="w-full object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-52 w-full items-center justify-center bg-neutral-900/60 text-center text-xs text-neutral-500 leading-relaxed p-6">
                    Cover image placeholder
                    <br />
                    <span className="opacity-60 mt-1 block">
                      Set <code className="font-mono">coverImage</code> in{' '}
                      <code className="font-mono">app/projects/data.ts</code>
                    </span>
                  </div>
                )}
              </div>

              {/* Title block */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-pink-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="mt-2 text-sm text-pink-300/80">
                    {project.subtitle}
                  </p>
                )}
                {project.shortDescription && (
                  <p className="mt-3 text-pink-100/70 leading-relaxed">
                    {project.shortDescription}
                  </p>
                )}
              </div>

              {/* Case study sections */}
              <div>
                {project.overview && (
                  <Section label="Overview">
                    <p className="leading-relaxed text-pink-100/80">
                      {project.overview}
                    </p>
                  </Section>
                )}

                {project.problem && (
                  <Section label="Problem / Context">
                    <p className="leading-relaxed text-pink-100/80">
                      {project.problem}
                    </p>
                  </Section>
                )}

                {project.role && (
                  <Section label="My Role">
                    <p className="leading-relaxed text-pink-100/80">
                      {project.role}
                    </p>
                  </Section>
                )}

                {project.process && (
                  <Section label="Process">
                    <p className="leading-relaxed text-pink-100/80">
                      {project.process}
                    </p>
                  </Section>
                )}

                {project.results && (
                  <Section label="Results & Impact">
                    <p className="leading-relaxed text-pink-100/80">
                      {project.results}
                    </p>
                  </Section>
                )}

                {project.learnings && (
                  <Section label="Key Learnings">
                    <p className="leading-relaxed text-pink-100/80">
                      {project.learnings}
                    </p>
                  </Section>
                )}
              </div>

              {/* Gallery */}
              <div className="mt-10 border-t border-pink-900/40 pt-8">
                <h2 className={`mb-1 ${LABEL_CLASS}`}>Gallery</h2>
                <p className="mb-5 text-xs text-pink-300/40">
                  Add image paths to the{' '}
                  <code className="font-mono text-pink-300/50">images</code>{' '}
                  array in{' '}
                  <code className="font-mono text-pink-300/50">
                    app/projects/data.ts
                  </code>
                  .
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(project.images ?? []).map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl ring-1 ring-white/10"
                    >
                      <Image
                        src={src}
                        alt={`${project.title} image ${i + 1}`}
                        width={600}
                        height={400}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                  {Array.from({
                    length: Math.max(0, 2 - (project.images?.length ?? 0)),
                  }).map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className="flex aspect-video items-center justify-center rounded-xl bg-neutral-900/60 ring-1 ring-white/10 text-xs text-neutral-500 text-center p-4 leading-relaxed"
                    >
                      Image {(project.images?.length ?? 0) + i + 1} placeholder
                      <br />
                      <span className="opacity-60 mt-1 block">
                        Add a path to{' '}
                        <code className="font-mono">images[]</code> in data.ts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          {/* order-1 on mobile so it appears above the main content card */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-1 lg:order-2 lg:sticky lg:top-8">
            <div className="glass glass-ring p-5">
              <ProjectSidebar project={project} />
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}
