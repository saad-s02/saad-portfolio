'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'

export default function AdminDashboard() {
  // Fetch all projects for stats
  const allProjects = useQuery(api.projects.listAll)

  // Fetch all contact submissions for stats
  const allSubmissions = useQuery(api.contactSubmissions.listAll)

  // Show loading state while data is being fetched
  if (allProjects === undefined || allSubmissions === undefined) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
        <p className="text-gray-400">Loading dashboard data...</p>
      </div>
    )
  }

  // Calculate stats
  const totalProjects = allProjects.length
  const publishedProjects = allProjects.filter((p) => p.status === 'published').length
  const featuredProjects = allProjects.filter((p) => p.featured).length

  const totalSubmissions = allSubmissions.length
  const newSubmissions = allSubmissions.filter((s) => s.status === 'new').length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-white">Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Welcome to your portfolio admin panel. Manage your projects, resume, and contact submissions.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Projects Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-sm font-medium text-gray-400 mb-2">Projects</h2>
          <div className="text-3xl font-bold text-white mb-2">{totalProjects}</div>
          <div className="text-sm text-gray-400">
            <span className="text-green-400">{publishedProjects} published</span>
            {' • '}
            <span className="text-gray-500">{totalProjects - publishedProjects} draft</span>
          </div>
        </div>

        {/* Featured Projects Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-sm font-medium text-gray-400 mb-2">Featured Projects</h2>
          <div className="text-3xl font-bold text-white mb-2">{featuredProjects}</div>
          <div className="text-sm text-gray-400">
            Shown on homepage
          </div>
        </div>

        {/* Contact Submissions Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-sm font-medium text-gray-400 mb-2">Contact Submissions</h2>
          <div className="text-3xl font-bold text-white mb-2">{totalSubmissions}</div>
          <div className="text-sm text-gray-400">
            {newSubmissions > 0 ? (
              <span className="text-yellow-400">{newSubmissions} new</span>
            ) : (
              <span className="text-gray-500">No new submissions</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="block p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <div className="font-semibold text-white mb-1">Create New Project</div>
            <div className="text-sm text-blue-100">Add a new project to your portfolio</div>
          </Link>

          <Link
            href="/admin/resume"
            className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <div className="font-semibold text-white mb-1">Edit Resume</div>
            <div className="text-sm text-gray-400">Update your experience and skills</div>
          </Link>

          <Link
            href="/admin/contact"
            className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <div className="font-semibold text-white mb-1">View Contact Submissions</div>
            <div className="text-sm text-gray-400">
              {newSubmissions > 0 ? `${newSubmissions} new message${newSubmissions > 1 ? 's' : ''}` : 'No new messages'}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
