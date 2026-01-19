"use client";
import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectCard } from "./ProjectCard";

type Props = {
  preloadedProjects: Preloaded<typeof api.projects.listPublished>;
};

export function ProjectGrid({ preloadedProjects }: Props) {
  const projects = usePreloadedQuery(preloadedProjects);

  if (projects.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-12 text-center border border-gray-800">
        <p className="text-gray-400 text-lg">
          No projects yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
