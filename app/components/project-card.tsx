import Link from 'next/link'
import Image from 'next/image'
import type { Project } from 'app/projects/data'

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group block rounded-2xl p-5 card ring-1 ring-white/10 backdrop-blur-[2px] transition-all hover:ring-white/20 hover:brightness-110"
    >
      <div className="relative mb-4 overflow-hidden rounded-xl bg-neutral-900/60 ring-1 ring-white/10">
        {p.coverImage ? (
          <Image
            src={p.coverImage}
            alt={p.title}
            width={600}
            height={192}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-neutral-500">
            (Project image here)
          </div>
        )}
      </div>

      <h4 className="text-xl font-semibold tracking-tight text-pink-100">
        {p.title}
      </h4>

      {p.subtitle && (
        <p className="mt-1 text-sm text-pink-300/85">{p.subtitle}</p>
      )}

      {p.shortDescription && (
        <p className="mt-3 text-sm leading-relaxed text-pink-100/80">
          {p.shortDescription}
        </p>
      )}

      <span className="mt-4 inline-block text-xs text-pink-400/60 transition-colors group-hover:text-pink-300/80">
        View project →
      </span>
    </Link>
  )
}
