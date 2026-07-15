// ═══════════════════════════════════════════════════════════════════════════════
//  Trivia game data — all questions live here.
//
//  HOW TO EDIT:
//    1. Change category `name` values to rename the column headers on the board.
//    2. Fill in each `clue` — this is the prompt the player sees (the Jeopardy
//       "answer", i.e. the hint about you).
//    3. Fill in each `answer` — use Jeopardy format: "What is X?" or "Who is X?"
//       This is revealed after the player buzzes in.
//    4. Questions are ordered by point value: [0] = $100 (easiest) → [4] = $500 (hardest).
//    5. Do NOT touch the game logic in app/games/trivia/page.tsx — all content
//       lives here.
// ═══════════════════════════════════════════════════════════════════════════════

export const POINT_VALUES = [100, 200, 300, 400, 500] as const

export type TriviaQuestion = {
  clue:   string  // shown to the player — the prompt/hint
  answer: string  // revealed on request — "What is X?" / "Who is X?" format
}

export type TriviaCategory = {
  name:      string
  questions: TriviaQuestion[]  // must have exactly 5 entries (one per point tier)
}

export const triviaData: TriviaCategory[] = [
  // ── Column 1 ─────────────────────────────────────────────────────────────────
  {
    name: 'Early Life',
    questions: [
      {
        // $100 — easiest / most widely known
        clue:   'The country where I was born and grew up.',
        answer: 'What is [your country]?',
      },
      {
        // $200
        clue:   'The number of siblings I have.',
        answer: 'What is [number]?',
      },
      {
        // $300
        clue:   'The type of pet (or name of pet) I had growing up.',
        answer: 'What is [pet / "no pets"]?',
      },
      {
        // $400
        clue:   'The year I started university.',
        answer: 'What is [year]?',
      },
      {
        // $500 — hardest / most obscure
        clue:   'The language other than English that I learned as a child.',
        answer: 'What is [language]?',
      },
    ],
  },

  // ── Column 2 ─────────────────────────────────────────────────────────────────
  {
    name: 'School',
    questions: [
      {
        // $100
        clue:   'The university I currently attend.',
        answer: 'What is [university name]?',
      },
      {
        // $200
        clue:   'My program or major.',
        answer: 'What is [program]?',
      },
      {
        // $300
        clue:   'My expected graduation year.',
        answer: 'What is [year]?',
      },
      {
        // $400
        clue:   'A club, team, or student org I have been a part of at university.',
        answer: 'What is [club / org]?',
      },
      {
        // $500
        clue:   'An award, scholarship, or honour I received in school.',
        answer: 'What is [award]?',
      },
    ],
  },

  // ── Column 3 ─────────────────────────────────────────────────────────────────
  {
    name: 'Career',
    questions: [
      {
        // $100
        clue:   'The broad field I am most interested in professionally.',
        answer: 'What is [field — e.g. product, software, design]?',
      },
      {
        // $200
        clue:   'The type of company where I had (or want) my first internship.',
        answer: 'What is [company type / name]?',
      },
      {
        // $300
        clue:   'The programming language I am most comfortable writing in.',
        answer: 'What is [language]?',
      },
      {
        // $400
        clue:   'The domain or industry I want to work in after graduating.',
        answer: 'What is [domain / industry]?',
      },
      {
        // $500
        clue:   'A specific project, event, or initiative I led or significantly contributed to.',
        answer: 'What is [project / initiative name]?',
      },
    ],
  },

  // ── Column 4 ─────────────────────────────────────────────────────────────────
  {
    name: 'Hobbies',
    questions: [
      {
        // $100
        clue:   'Something I enjoy doing outdoors.',
        answer: 'What is [outdoor activity]?',
      },
      {
        // $200
        clue:   'The music genre I listen to most.',
        answer: 'What is [genre]?',
      },
      {
        // $300
        clue:   'A book (or genre of book) I would recommend to anyone.',
        answer: 'What is [book / genre]?',
      },
      {
        // $400
        clue:   'A sport or physical activity I have played competitively or trained seriously in.',
        answer: 'What is [sport / activity]?',
      },
      {
        // $500
        clue:   'A creative skill or craft I picked up outside of school.',
        answer: 'What is [skill / craft]?',
      },
    ],
  },

  // ── Column 5 ─────────────────────────────────────────────────────────────────
  {
    name: 'Favourites',
    questions: [
      {
        // $100
        clue:   'My go-to comfort food.',
        answer: 'What is [food]?',
      },
      {
        // $200
        clue:   'The app or website I probably have the most screen time on.',
        answer: 'What is [app / site]?',
      },
      {
        // $300
        clue:   'A TV show or movie I could watch on repeat.',
        answer: 'What is [show / movie]?',
      },
      {
        // $400
        clue:   'My favourite season — and where I would ideally spend it.',
        answer: 'What is [season] in [place]?',
      },
      {
        // $500
        clue:   'The one non-electronic item I would bring to a desert island.',
        answer: 'What is [item]?',
      },
    ],
  },
]
