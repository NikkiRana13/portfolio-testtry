// ─── About / hero link data ───────────────────────────────────────────────────
// These links appear as CTA buttons in the hero section of the homepage.
// Set primary: true on the one you want highlighted (filled button style).
// Replace href: '#' with your actual resume URL when you have one.

export type HeroLink = {
  label: string
  href: string
  external: boolean
  primary?: boolean
}

export const heroLinks: HeroLink[] = [
  {
    label: 'View Portfolio',
    href: '/portfolio',
    external: false,
    primary: true,
  },
  {
    label: 'Blog',
    href: '/blog',
    external: false,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nikkirana1/',
    external: true,
  },
  {
    label: 'Resume',
    href: '#', // Replace with your resume URL or /resume
    external: false,
  },
]

// ─── About Me gallery ─────────────────────────────────────────────────────────
// Each item maps to one photo slot in the gallery grid.
// src:     path relative to /public, e.g. '/images/gallery/photo-1.jpg'
//          Leave as '' to show the placeholder box.
// caption: shown beneath the photo. Can be left blank.

export type GalleryItem = {
  src: string
  caption: string
}

export const gallery: GalleryItem[] = [
  { src: '', caption: '[Caption — e.g. CTPC tournament, 2024]' },
  { src: '', caption: '[Caption — e.g. Campus life at Waterloo]' },
  { src: '', caption: '[Caption — e.g. Somewhere you travelled]' },
  { src: '', caption: '[Caption — e.g. An event or conference]' },
  { src: '', caption: '[Caption — e.g. Something you cooked]' },
  { src: '', caption: '[Caption — e.g. Friends, family, or anything fun]' },
]
