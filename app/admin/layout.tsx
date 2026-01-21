import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Second layer of defense: verify auth at layout level
  const { user } = await withAuth()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top navigation bar */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400">{user.email}</span>
              <a
                href="/auth/sign-out"
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main container with sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar navigation */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/projects"
                className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-gray-100"
              >
                Projects
              </Link>
              <Link
                href="/admin/resume"
                className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-gray-100"
              >
                Resume
              </Link>
              <Link
                href="/admin/changelog"
                className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-gray-100"
              >
                Changelog
              </Link>
              <Link
                href="/admin/contact"
                className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-gray-100"
              >
                Contact Submissions
              </Link>
            </nav>
          </aside>

          {/* Main content area */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
