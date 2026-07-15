export type ProjectLink = {
  label: string
  href: string
}

// ─── Categories ────────────────────────────────────────────────────────────────
// Internal slugs used in project data. Add new values here to create a
// new category; then register it in FILTERS below.
export type CategoryId = 'product' | 'software' | 'extracurriculars' | 'fun'

export type Filter = {
  id: 'all' | CategoryId
  label: string
}

// Central filter list — edit labels here, add/remove entries here.
// "all" must stay first and is handled automatically by the filter logic.
export const FILTERS: Filter[] = [
  { id: 'all',            label: 'All'                  },
  { id: 'product',        label: 'Product'               },
  { id: 'software',       label: 'Software Engineering'  },
  { id: 'extracurriculars', label: 'Extracurriculars'    },
  { id: 'fun',            label: 'Fun Projects'          },
]

// ─── Project type ──────────────────────────────────────────────────────────────
export type Project = {
  slug: string
  title: string
  subtitle?: string
  shortDescription?: string
  coverImage?: string
  images?: string[]
  overview?: string
  problem?: string
  role?: string
  process?: string
  tools?: string[]
  results?: string
  learnings?: string
  links?: ProjectLink[]
  // One or more CategoryId values. A project with no categories will only
  // appear under "All".
  categories: CategoryId[]
  // Set to true to show this project in the Featured Work section on the homepage.
  featured?: boolean
}

// ─── Project data ──────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    slug: 'ctpc-coding-tournament',
    title: 'CTPC Coding Tournament',
    subtitle: 'National student-run event · Ops, sponsorships, product',
    shortDescription:
      'Scaled a cross-campus tournament; built ops workflows, sponsorship pipeline, and event tooling.',
    categories: ['extracurriculars', 'product'],
    featured: true,
    overview:
      'The Canadian Tech Programming Competition (CTPC) is a national, student-run coding tournament that brought together hundreds of participants from universities across Canada. I was involved in operations, sponsorships, and product — helping scale the event from a single campus to a multi-school initiative.',
    role:
      'I led the sponsorship pipeline, coordinating outreach to over a dozen companies and securing more than $7,000 in funding. I also built operational workflows for volunteer coordination and contributed to the event platform.',
    process:
      'We started with a small organizing committee and iterated quickly — running planning sprints, building a sponsorship deck, and designing volunteer onboarding flows. I worked across teams to align logistics, branding, and technical requirements.',
    tools: ['Notion', 'Google Workspace', 'Figma', 'Discord'],
    results:
      'Over 800 attendees across campuses, $7K+ raised in sponsorships, and a volunteer team of 30+. The event ran smoothly and generated significant interest for a second edition.',
    learnings:
      'Organizing at scale taught me that clear communication beats perfect planning. Early documentation and shared systems saved hours of back-and-forth later.',
    links: [
      { label: 'Photos', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  {
    slug: 'human-factors-mini-lab',
    title: 'Human Factors Mini Lab',
    subtitle: 'Usability studies · Task analysis · UI prototyping',
    shortDescription:
      'Rapid studies on reach, visual angle, and interface flows; turned findings into design requirements.',
    categories: ['product'],
    featured: true,
    overview:
      'A series of mini research studies conducted as part of my Systems Design Engineering coursework in human factors. Each study applied ergonomics and usability principles to real interface or physical design problems.',
    problem:
      'Many interfaces are designed without empirical data on how people actually use them. This project explored how small, focused usability studies can surface design requirements quickly and cheaply.',
    role:
      'I designed and ran each study, recruited participants, analyzed results, and translated findings into actionable design recommendations.',
    process:
      'Studies covered reach envelope analysis, visual angle thresholds, and task flow mapping. I prototyped interface improvements in Figma based on findings.',
    tools: ['Figma', 'Google Forms', 'Excel'],
    results:
      'Produced a set of design requirements grounded in measured user behavior. Findings influenced prototype iterations across multiple interface contexts.',
    learnings:
      'Even simple studies with small sample sizes can reveal significant usability gaps. The key is asking precise questions and designing tasks carefully.',
    links: [
      { label: 'Case Study', href: '#' },
      { label: 'Figma', href: '#' },
    ],
  },
  {
    slug: 'vim-essay',
    title: 'Vim Essay',
    subtitle: 'Writing · Developer tooling',
    shortDescription:
      "A defense of Vim's longevity: efficiency, customizability, and a thriving community.",
    categories: ['fun'],
    overview:
      "A long-form essay arguing that Vim's enduring popularity is not nostalgia but a rational response to genuine ergonomic and efficiency advantages.",
    role: 'Sole author. Researched, outlined, and wrote the full piece.',
    tools: ['Vim', 'MDX', 'Next.js'],
    results:
      'Published as a blog post. Explored modal editing, plugin ecosystems, and community sustainability.',
    learnings:
      'Writing about tools forces you to articulate why you use them — a useful exercise in itself.',
    links: [{ label: 'Read Post', href: '/blog/vim' }],
  },
  {
    slug: 'portfolio-site',
    title: 'Portfolio Site',
    subtitle: 'Next.js · MDX · Tailwind',
    shortDescription:
      'Personal site with MDX blog, dark pink theme, and a filterable project grid.',
    categories: ['software', 'fun'],
    overview:
      'This site — built to showcase my work, host my blog, and serve as a living document of my interests and projects. Designed and developed from scratch.',
    role: 'Sole designer and developer.',
    process:
      'Started from a minimal Next.js starter, then custom-built the aurora background, glass card system, and dark pink theme. Blog is powered by MDX files.',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'Vercel'],
    results: 'Live at this URL. Fully responsive and fast.',
    learnings:
      'Building your own site is the best way to learn a stack in depth — every edge case is your own problem to solve.',
    links: [{ label: 'Repo', href: '#' }],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
