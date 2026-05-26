import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#131313',
}

export const metadata: Metadata = {
  title: 'CITY 404 — Hide Messages in Horror Rooms',
  description: 'An immersive horror puzzle game. Hide messages inside horror rooms. Dare your friends to find them.',
  keywords: ['horror game', 'puzzle', 'multiplayer', 'city 404', 'horror room'],
  openGraph: {
    title: 'CITY 404',
    description: 'Hide messages in horror rooms. Challenge your friends to find them.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-on-surface min-h-screen overflow-x-hidden">
        {/* VHS Scanlines */}
        <div className="vhs-scanlines" aria-hidden="true" />
        {/* Film Grain */}
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
