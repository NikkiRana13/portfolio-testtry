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
    startYear: '2021',
    endYear: '2024',
    title: 'Youth Advisory Council',
    organization: 'Region of Waterloo',
    description:
      'Joined as a member, later advancing to Senior Member. Contributed to municipal policy discussions, helped redesign the Upstream Fund, and participated in projects overseeing a ~$2.1M budget. My first real exposure to systems-level leadership.',
    type: 'leadership',
  },
  {
    startYear: '2022',
    endYear: '2025',
    title: 'Co-founder & Organizer',
    organization: '#Launch — Canadian Tech Competition',
    description:
      'Co-founded a national student programming competition that grew to 800+ participants, $7K+ in sponsorships, and a 45% YoY satisfaction improvement. Led partnerships, operations, and product decisions. My first taste of real product management.',
    type: 'leadership',
  },
  {
    startYear: '2024',
    title: 'Systems Design Engineering',
    organization: 'University of Waterloo',
    description:
      'Studying the intersection of systems, people, and technology. Coursework spans human factors, data structures, digital logic, and usability. Recipient of the Ted Rogers Legacy Scholarship ($100,000). Class Representative and Engineering Ambassador.',
    type: 'education',
  },
  {
    startYear: '2025',
    endYear: '2025',
    title: 'Junior Consultant',
    organization: 'NorthGuide',
    description:
      'First co-op. Delivered 20+ economic development proposals, led website redesign, and improved UX for client-facing products. Worked across ambiguous briefs and tight timelines in a small cross-functional team.',
    type: 'work',
  },
  {
    startYear: '2025',
    endYear: '2025',
    title: 'Applied AI & Product Intern',
    organization: 'Rogers Communications',
    description:
      'Built MentorAI — an internal AI coaching platform processing 9,000+ transcripts/day using Azure OpenAI, Databricks, and MLflow. Features included KPI extraction, empathy analysis, compliance flagging, and sales coaching. Projected impact ~$1.5M/year. Won the Rogers Innovators Challenge People\'s Choice Award; project selected for production.',
    type: 'work',
  },
  {
    startYear: '2026',
    endYear: '2026',
    title: 'Undergraduate Research Assistant',
    organization: 'University of Waterloo',
    description:
      'Research under Professor Robert Hunter exploring prompt engineering, AI literacy, and structured ideation in design education. First formal research experience.',
    type: 'work',
  },
  {
    startYear: '2026',
    title: 'Software Engineering Intern',
    organization: 'PointClickCare',
    description:
      'Backend-focused co-op working in Java, Docker, and SQL Server. Increased unit test coverage from 67% → 86%. Proactively pursued frontend and product exposure beyond assigned tickets, and proposed internal AI tooling including Claude-powered onboarding workflows.',
    type: 'work',
  },
]
