import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SwipePlans - Group Decision Made Easy',
  description: 'Make group decisions without the drama. Create, share, and swipe on options together. Only unanimous matches are revealed!',
  keywords: 'group decisions, tinder for decisions, swipe app, activities, date night, group planning',
  authors: [{ name: 'SwipePlans' }],
  creator: 'SwipePlans',
  publisher: 'SwipePlans',
  openGraph: {
    title: 'SwipePlans - Group Decision Made Easy',
    description: 'Make group decisions without the drama. Create, share, and swipe on options together.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwipePlans - Group Decision Made Easy',
    description: 'Make group decisions without the drama. Create, share, and swipe on options together.',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#dc2626',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Access environment variable on server side
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SwipePlans" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={`${inter.className} h-full`}>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {children}
        </div>
        {/* Pass bucket slug as prop to client component */}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}