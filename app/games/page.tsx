import { games } from 'app/content/games'
import { GameCard } from 'app/components/games/game-card'

export const metadata = {
  title: 'Games',
  description: 'Small games I built to take a break from building things.',
}

export default function GamesPage() {
  return (
    <main className="relative min-h-screen">
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <h1 className="mb-3 font-pixel font-pixel-lg"
              style={{ fontFamily: 'var(--font-pixel), monospace' }}>
            // games
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-pink-300/60">
            sometimes i build useful things. sometimes i build tiny games.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-pink-300/25">
          high scores are saved locally in your browser
        </p>
      </div>
    </main>
  )
}
