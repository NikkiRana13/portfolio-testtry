'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Navigation items ─────────────────────────────────────────────────────────
// Add, remove, or reorder entries here to update the site navigation.
const navItems = [
  { href: '/',                                    label: 'home',      external: false },
  { href: '/portfolio',                           label: 'portfolio', external: false },
  { href: '/blog',                                label: 'blog',      external: false },
  { href: 'https://www.linkedin.com/in/nikkirana1/', label: 'linkedin', external: true  },
]

function ExternalIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="ml-0.5 inline-block opacity-50"
    >
      <path
        d="M1.5 8.5l7-7M5 1.5h3v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <aside className="px-4 sm:px-6 lg:px-8 pt-6 mb-12 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative pb-0 md:overflow-auto scroll-pr-6"
          id="nav"
          aria-label="Main navigation"
        >
          <div className="flex flex-row flex-wrap gap-y-1 pr-10">
            {navItems.map(({ href, label, external }) => {
              // Active when the path matches exactly (home) or starts with the
              // route prefix. Project detail pages also light up "portfolio".
              const isActive =
                !external &&
                (href === '/'
                  ? pathname === '/'
                  : pathname === href ||
                    pathname.startsWith(href + '/') ||
                    (href === '/portfolio' && pathname.startsWith('/projects')))

              const sharedClass =
                'flex items-center relative py-1 px-2 m-1 transition-colors duration-150 ' +
                (isActive
                  ? 'text-[#B3446C]'
                  : 'text-[--fg] hover:text-pink-200')

              if (external) {
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sharedClass}
                  >
                    {label}
                    <ExternalIcon />
                  </a>
                )
              }

              return (
                <Link key={href} href={href} className={sharedClass}>
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
