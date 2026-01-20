import type { Metadata } from 'next'
import { ConvexClientProvider } from './ConvexClientProvider'
import { Header } from '@/components/navigation/Header'
import { Toaster } from 'react-hot-toast'
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
