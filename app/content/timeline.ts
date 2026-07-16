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
  highlights?: string[]
  type: TimelineType
}

export const timeline: TimelineEntry[] = [
  {
    startYear: '2021',
    endYear: '2024',
    title: 'Youth Advisory Council',
    organization: 'Region of Waterloo',
    description:
      'Contributed to municipal policy discussions and projects overseeing a ~$2.1M budget. Advanced from Member to Senior Member.',
    highlights: [
      'Advanced from Member to Senior Member over 3 years',
      'Helped redesign the Upstream Fund',
      'Participated in municipal policy discussions across the Region of Waterloo',
      'Contributed to projects overseeing a ~$2.1M budget',
      'First real exposure to systems-level leadership and civic decision-making',
    ],
    type: 'leadership',
  },
  {
    startYear: '2022',
    endYear: '2025',
    title: 'Co-founder & Organizer',
    organization: '#Launch — Canadian Tech Competition',
    description:
      'Co-founded a national student programming competition that grew to 800+ participants, $7K+ in sponsorships, and a 45% YoY satisfaction improvement.',
    highlights: [
      'Co-founded from scratch and scaled to national reach',
      '800+ participants across Canada',
      'Secured $7,000+ in corporate sponsorships',
      '45% year-over-year participant satisfaction improvement',
      'Led partnerships, operations, event planning, and product decisions',
      'First exposure to real product management and large-scale event ownership',
    ],
    type: 'leadership',
  },
  {
    startYear: '2024',
    title: 'Systems Design Engineering',
    organization: 'University of Waterloo',
    description:
      'Studying the intersection of systems, people, and technology. Recipient of the Ted Rogers Legacy Scholarship ($100,000). Class Representative and Engineering Ambassador.',
    highlights: [
      'Ted Rogers Legacy Scholarship recipient — $100,000',
      'Class Representative across multiple terms',
      'Engineering Ambassador representing Waterloo Engineering',
      'Coursework: human factors, data structures, digital logic, calculus, technology & society',
      'Human factors became a defining academic interest — building things that actually help people',
    ],
    type: 'education',
  },
  {
    startYear: '2025',
    endYear: '2025',
    title: 'Junior Consultant',
    organization: 'NorthGuide',
    description:
      'First co-op. Delivered 20+ economic development proposals, led website redesign, and improved UX for client-facing products.',
    highlights: [
      'Delivered 20+ economic development and grant proposals',
      'Led full website redesign and UX improvements',
      'Worked directly with clients on ambiguous, fast-moving briefs',
      'Cross-functional team environment in a boutique consultancy',
      'Applied engineering thinking to real business and community challenges',
    ],
    type: 'work',
  },
  {
    startYear: '2025',
    endYear: '2025',
    title: 'Applied AI & Product Intern',
    organization: 'Rogers Communications',
    description:
      'Built MentorAI — an internal AI coaching platform processing 9,000+ transcripts/day. Won the Rogers Innovators Challenge People\'s Choice Award; project selected for production.',
    highlights: [
      'Built MentorAI, an internal AI coaching platform end-to-end',
      'Processed 9,000+ call transcripts per day',
      'Features: KPI extraction, empathy analysis, compliance flagging, talk/listen ratio, payment detection, sales coaching',
      'Tech stack: Azure OpenAI, Databricks, Delta Lake, MLflow, Python, ETL pipelines',
      'Projected impact: ~$1.5M/year in efficiency gains',
      'Won People\'s Choice Award at the Rogers Innovators Challenge',
      'Project selected for production deployment',
      'Also contributed to satellite-to-mobile connectivity market analysis and product strategy',
    ],
    type: 'work',
  },
  {
    startYear: '2026',
    endYear: '2026',
    title: 'Undergraduate Research Assistant',
    organization: 'University of Waterloo',
    description:
      'Research under Professor Robert Hunter on prompt engineering, AI literacy, and structured ideation in design education.',
    highlights: [
      'Worked under Professor Robert Hunter',
      'Research focus: prompt engineering, creativity, and AI literacy',
      'Studied structured prompting techniques in design education contexts',
      'Explored how AI tools change ideation and problem-solving processes',
      'First formal academic research experience',
    ],
    type: 'work',
  },
  {
    startYear: '2026',
    title: 'Software Engineering Intern',
    organization: 'PointClickCare',
    description:
      'Backend-focused co-op in Java, Docker, and SQL Server. Increased unit test coverage from 67% → 86%. Proactively pursued product and frontend exposure beyond assigned work.',
    highlights: [
      'Increased unit test coverage from 67% → 86% across the codebase',
      'Backend stack: Java, JUnit, Docker, SQL Server, Gherkin',
      'Proactively requested frontend and product ownership beyond assigned tickets',
      'Proposed internal AI tooling including Claude-powered onboarding workflows',
      'Attended the Ascend Healthcare Conference — reinforced interest in healthcare technology',
      'Continued pattern of leaving behind more than what was originally expected',
    ],
    type: 'work',
  },
]
