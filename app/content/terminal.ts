// ═══════════════════════════════════════════════════════════════════════════════
//  Terminal content — the only file you need to edit.
//
//  HOW TO USE:
//    • Replace every [bracketed placeholder] with your real content.
//    • Each section is labelled with the command that displays it.
//    • DO NOT touch app/components/terminal/index.tsx for content changes.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Command list (drives the dropdown menu) ───────────────────────────────────
// Add/remove entries here if you add/remove commands in index.tsx.
// `name` must match exactly what the command parser expects (lowercase).

export type CommandMeta = { name: string; desc: string }

export const COMMAND_LIST: CommandMeta[] = [
  { name: 'help',            desc: 'Show all available commands'      },
  { name: 'about',           desc: 'Background, bio & quick facts'    },
  { name: 'whoami',          desc: 'Identity at a glance'             },
  { name: 'interests',       desc: 'What I care about'                },
  { name: 'currently',       desc: "What I'm up to right now"         },
  { name: 'projects',        desc: 'Featured projects'                },
  { name: 'experience',      desc: 'Work & education history'         },
  { name: 'games',           desc: 'Mini-games section'               },
  { name: 'portfolio',       desc: 'Full project portfolio'           },
  { name: 'resume',          desc: 'View my resume'                   },
  { name: 'contact',         desc: 'Email, LinkedIn & GitHub'         },
  { name: 'clear',           desc: 'Clear the terminal'               },
  { name: 'coffee',          desc: 'Open to coffee chats ☕'           },
  { name: 'joke',            desc: 'Random (terrible) joke'           },
  { name: 'fortune',         desc: 'Random fortune'                   },
  { name: 'duck',            desc: 'Important'                        },
  { name: 'sudo hire nikki', desc: '👀'                               },
]

// ─── All editable content ──────────────────────────────────────────────────────

export const TERMINAL_CONTENT = {

  // ── `whoami` ───────────────────────────────────────────────────────────────
  identity: {
    name:       'Nikki Rana',
    title:      'Systems Design Engineering Student',
    roles:      ['software engineer', 'product-minded builder'],  // shown on one line, joined by ·
    university: 'University of Waterloo',
    location:   '[Replace with your city / country]',
  },

  // ── `about` ────────────────────────────────────────────────────────────────
  // Replace each string with a paragraph (2–3 sentences is ideal).
  bio: [
    "[Replace with a short introduction — where you're from, what you study, what draws you to it.]",
    "[Replace with what drives you — what do you care about beyond grades and internships?]",
    "[Replace with where you're headed — what you're building toward right now.]",
  ],

  // Quick facts shown at the bottom of the `about` output.
  facts: [
    '[Fact 1 — e.g. Born and raised in Cambridge, ON]',
    '[Fact 2 — e.g. Something you love outside of school]',
    '[Fact 3 — e.g. A quirk or fun detail about yourself]',
    '[Fact 4 — e.g. Something you\'re learning or excited about]',
  ],

  // ── `interests` ────────────────────────────────────────────────────────────
  // Keys are category headers. Values are bullet lists.
  // Add/remove categories and items freely.
  interests: {
    Technology: [
      'Product design & systems thinking',
      'Human factors & usability',
      'Software engineering',
      'AI & emerging tech',
    ],
    'Creative & Personal': [
      'Photography & visual storytelling',
      'Writing & communication',
      'Community building & mentorship',
    ],
    'Life Stuff': [
      '[Replace — e.g. travel, food, a hobby you love]',
      '[Replace — something you enjoy doing offline]',
      '[Replace — something you\'re currently obsessed with]',
    ],
  } as Record<string, string[]>,

  // ── `currently` ────────────────────────────────────────────────────────────
  currently: {
    building:        '[What you\'re building right now — a project, feature, or idea]',
    learning:        '[What you\'re learning — a skill, subject, or tool]',
    reading:         '[A book, article series, or resource you\'re working through]',
    exploring:       '[Something you\'re curious about or diving into]',
    lookingForwardTo:'[Something coming up that you\'re excited about]',
  },

  // ── `contact` & `resume` ───────────────────────────────────────────────────
  contact: {
    email:    '[your-email@example.com]',          // Replace with your real email
    linkedin: 'https://www.linkedin.com/in/nikkirana1/',
    github:   'https://github.com/nrana13',
    resume:   '#',                                 // Replace with resume URL when available
  },

  // ── `coffee` ───────────────────────────────────────────────────────────────
  coffeeMessage:
    "I love meeting new people and trading ideas. " +
    "[Replace with a sentence about the kinds of chats you enjoy — mentorship, career, tech, etc.]",

  // ── `joke` — add/remove jokes freely ─────────────────────────────────────
  jokes: [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    'A SQL query walks into a bar, walks up to two tables, and asks: "Can I join you?"',
    "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
    "Why do Java developers wear glasses? Because they don't C#.",
    'A PM walks into a bar and orders 10 beers. "Why 10?" asks the bartender. "The client asked for a dozen."',
  ],

  // ── `fortune` — add/remove fortunes freely ───────────────────────────────
  fortunes: [
    "The best time to start was yesterday. The second best time is now.",
    "Build things people want — everything else follows.",
    "Clarity of thought is a superpower. Write more.",
    "Stay curious. The moment you think you know everything is the moment you stop growing.",
    "Good enough shipped beats perfect never launched.",
    "The people who are crazy enough to think they can change the world usually do.",
    "Do the work. Show the work. Let the work speak.",
    "Be the kind of person who makes the room better for having you in it.",
  ],
}
