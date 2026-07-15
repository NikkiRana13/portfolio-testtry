// ─── Timeline data ────────────────────────────────────────────────────────────
// To add a new entry: append an object to the `timeline` array below.
// Leave `endYear` undefined for ongoing/present roles.
// `type` is for future filtering — values: 'education' | 'work' | 'leadership' | 'milestone'

export type TimelineType = 'education' | 'work' | 'leadership' | 'milestone'

export type TimelineEntry = {
  startYear: string
  endYear?: string       // omit for ongoing ("– present")
  title: string
  organization?: string
  description: string
  type: TimelineType
}

export const timeline: TimelineEntry[] = [
  {
    startYear: '2020',
    endYear: '2024',
    title: 'High School',
    organization: '[Your school name]',
    description:
      '[Replace this — describe your high school years: what you were involved in, what you cared about, anything that shaped where you went next.]',
    type: 'education',
  },
  {
    startYear: '2023',
    endYear: '2024',
    title: 'CTPC Coding Tournament',
    organization: 'CTPC',
    description:
      'Organized a national student-run coding competition across multiple campuses. Raised $7K+ in sponsorships, coordinated 800+ attendees, and built ops workflows from scratch.',
    type: 'leadership',
  },
  {
    startYear: '2024',
    title: 'Systems Design Engineering',
    organization: 'University of Waterloo',
    description:
      'Studying the intersection of systems, people, and technology. Coursework spans human factors, data structures, circuits, and usability — building a full-stack understanding of product and engineering.',
    type: 'education',
  },
  {
    startYear: '2025',
    endYear: '2025',
    title: 'Corporate Innovation Consulting',
    organization: 'NorthGuide',
    description:
      'First co-op. Applied engineering thinking to real business challenges — ambiguous problems, tight timelines, and cross-functional teams.',
    type: 'work',
  },
  {
    startYear: '2025',
    title: 'AI Strategy & Product',
    organization: 'Rogers',
    description:
      'Working on real-world GenAI solutions and cross-functional product initiatives on the AI Strategy & Product team.',
    type: 'work',
  },
]
