// ─── Interests data ───────────────────────────────────────────────────────────
// Edit labels and descriptions freely. Add or remove entries as you like.
// These appear as cards in the "What I'm Into" section of the homepage.

export type Interest = {
  label: string
  description: string
}

export const interests: Interest[] = [
  {
    label: 'Product Design',
    description: 'How things should work — and why they usually don\'t.',
  },
  {
    label: 'Human Factors',
    description: 'People first. Always.',
  },
  {
    label: 'Software Engineering',
    description: 'Building things that actually run.',
  },
  {
    label: 'Community Building',
    description: 'Events, programs, and bringing people together.',
  },
  {
    label: 'Mentorship',
    description: 'Paying it forward wherever I can.',
  },
  {
    label: 'Travel',
    description: '[Replace with your favourite places or where you want to go next.]',
  },
  {
    label: 'Food',
    description: '[Replace with what you love to cook, eat, or explore.]',
  },
  {
    label: 'Photography',
    description: '[Replace with what you like to photograph or capture.]',
  },
  {
    label: 'Creative Projects',
    description: 'Side experiments, writing, and random things I get excited about.',
  },
]
