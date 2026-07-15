import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects, getProject } from 'app/projects/data'
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

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-violet-900/40 pt-7 mt-7 first:border-0 first:pt-0 first:mt-0">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400/60">
        {label}
      </h2>
      {children}
    </div>
  )
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) notFound()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-violet-100">
      {/* Aurora background — same as homepage */}
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10">
        {/* Back button */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-violet-300/60 transition-colors hover:text-violet-100"
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

        <div className="glass glass-ring p-6 md:p-10">
          {/* Cover image */}
          {project.coverImage && (
            <div className="relative mb-8 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src={project.coverImage}
                alt={`${project.title} cover`}
                width={900}
                height={450}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Title block */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-violet-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="mt-2 text-sm text-violet-300/80">{project.subtitle}</p>
            )}
            {project.shortDescription && (
              <p className="mt-3 text-violet-100/70 leading-relaxed">
                {project.shortDescription}
              </p>
            )}
          </div>

          {/* External links */}
          {project.links && project.links.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {project.links.map((link) => (
                <a
                  key={link.label + link.href}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    link.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-violet-900/30 px-4 py-1.5 text-sm text-violet-200 ring-1 ring-violet-500/30 transition-all hover:bg-violet-800/40 hover:ring-violet-400/40"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Content sections — only rendered when content exists */}
          <div>
            {project.overview && (
              <Section label="Overview">
                <p className="leading-relaxed text-violet-100/80">
                  {project.overview}
                </p>
              </Section>
            )}

            {project.problem && (
              <Section label="Problem / Context">
                <p className="leading-relaxed text-violet-100/80">
                  {project.problem}
                </p>
              </Section>
            )}

            {project.role && (
              <Section label="My Role">
                <p className="leading-relaxed text-violet-100/80">
                  {project.role}
                </p>
              </Section>
            )}

            {project.process && (
              <Section label="Process">
                <p className="leading-relaxed text-violet-100/80">
                  {project.process}
                </p>
              </Section>
            )}

            {project.tools && project.tools.length > 0 && (
              <Section label="Tools & Technologies">
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-md bg-violet-950/60 px-3 py-1 text-sm text-violet-300 ring-1 ring-violet-800/50"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {project.results && (
              <Section label="Results & Impact">
                <p className="leading-relaxed text-violet-100/80">
                  {project.results}
                </p>
              </Section>
            )}

            {project.learnings && (
              <Section label="Key Learnings">
                <p className="leading-relaxed text-violet-100/80">
                  {project.learnings}
                </p>
              </Section>
            )}
          </div>

          {/* Additional images / gallery */}
          {project.images && project.images.length > 0 && (
            <div className="mt-10 border-t border-violet-900/40 pt-8">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-violet-400/60">
                Gallery
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.images.map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl ring-1 ring-white/10"
                  >
                    <Image
                      src={src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
