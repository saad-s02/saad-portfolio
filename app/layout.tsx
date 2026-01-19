import type { Metadata } from 'next'
import { ConvexClientProvider } from './ConvexClientProvider'
import { Header } from '@/components/navigation/Header'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Portfolio',
    template: '%s | Portfolio',
  },
  description: 'Personal portfolio showcasing projects and engineering automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-50 antialiased min-h-screen">
        <ConvexClientProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
