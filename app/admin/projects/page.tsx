"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ProjectStatusToggle } from "@/components/admin/ProjectStatusToggle";
import { ProjectFeaturedToggle } from "@/components/admin/ProjectFeaturedToggle";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";

export default function ProjectsListPage() {
  const projects = useQuery(api.projects.listAll);

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Create New Project
        </Link>
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
          <p className="text-gray-400 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="text-blue-500 hover:text-blue-400"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full bg-gray-800/50">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-800/70">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-100">
                        {project.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400 font-mono">
                        {project.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProjectStatusToggle
                        projectId={project._id}
                        initialStatus={project.status}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProjectFeaturedToggle
                        projectId={project._id}
                        initialFeatured={project.featured}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/projects/${project._id}/edit`}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton
                        projectId={project._id}
                        projectTitle={project.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 space-y-3"
              >
                <div>
                  <h3 className="font-medium text-gray-100">{project.title}</h3>
                  <p className="text-sm text-gray-400 font-mono">{project.slug}</p>
                </div>

                <div className="flex items-center gap-4">
                  <ProjectStatusToggle
                    projectId={project._id}
                    initialStatus={project.status}
                  />
                  <ProjectFeaturedToggle
                    projectId={project._id}
                    initialFeatured={project.featured}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project._id}/edit`}
                    className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm font-medium rounded text-center"
                  >
                    Edit
                  </Link>
                  <DeleteProjectButton
                    projectId={project._id}
                    projectTitle={project.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
