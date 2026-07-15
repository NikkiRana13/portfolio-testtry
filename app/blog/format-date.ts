// Pure date formatter — no Node.js imports, safe to use in 'use client' components.
export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date()
  if (!date.includes('T')) date = `${date}T00:00:00`
  const targetDate = new Date(date)

  const yearsAgo  = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth()     - targetDate.getMonth()
  const daysAgo   = currentDate.getDate()      - targetDate.getDate()

  const relative =
    yearsAgo  > 0 ? `${yearsAgo}y ago`  :
    monthsAgo > 0 ? `${monthsAgo}mo ago` :
    daysAgo   > 0 ? `${daysAgo}d ago`   : 'Today'

  const full = targetDate.toLocaleString('en-us', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return includeRelative ? `${full} (${relative})` : full
}
