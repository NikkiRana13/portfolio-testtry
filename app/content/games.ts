export type Game = {
  id: string
  title: string
  description: string
  href: string
  storageKey: string
  difficulty: 'easy' | 'medium' | 'hard'
  controls: string
}

export const games: Game[] = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake. Eat, grow, avoid walls and yourself.',
    href: '/games/snake',
    storageKey: 'game-snake-hi',
    difficulty: 'easy',
    controls: 'Arrow keys · WASD · Swipe',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: "Break all the bricks. Don't let the ball fall.",
    href: '/games/breakout',
    storageKey: 'game-breakout-hi',
    difficulty: 'medium',
    controls: 'Mouse · Touch · Arrow keys',
  },
]
