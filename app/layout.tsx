import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { PixelGoose } from './components/pixel-goose'
import { FlowerCollectionProvider } from './context/FlowerCollectionContext'
import { FlowerLayer, BouquetController } from './components/flowers'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Nikki Rana',
    template: '%s | Next.js Portfolio Starter',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'hey there!',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(GeistSans.variable, GeistMono.variable)}
    >
      <head>
        {/* Runs before paint — applies saved theme class to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();` }} />
      </head>
      <body className="antialiased">
        <FlowerCollectionProvider>
          <main className="flex-auto min-w-0 flex flex-col">
            <Navbar />
            {children}
            <Footer />
            <PixelGoose />
            <FlowerLayer />
            <BouquetController />
            <Analytics />
            <SpeedInsights />
          </main>
        </FlowerCollectionProvider>
      </body>
    </html>
  )
}
