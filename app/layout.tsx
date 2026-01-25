import type { Metadata } from 'next'
import { ConvexClientProvider } from './ConvexClientProvider'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Portfolio',
    template: '%s | Portfolio',
  },
  description: 'Full-stack engineer building automated workflows that ship faster. Next.js, TypeScript, AI-assisted development.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-50 antialiased min-h-screen flex flex-col">
        <ConvexClientProvider>
          <Header />
          <main className="container mx-auto px-4 py-8 flex-1">
            {children}
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  )
}
