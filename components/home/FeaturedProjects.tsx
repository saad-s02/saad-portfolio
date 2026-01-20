"use client";
import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectCard } from "@/components/projects/ProjectCard";

type Props = {
  preloadedProjects: Preloaded<typeof api.projects.listFeatured>;
};

export function FeaturedProjects({ preloadedProjects }: Props) {
  const projects = usePreloadedQuery(preloadedProjects);

  if (projects.length === 0) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-50">Featured Projects</h2>
        <p className="text-gray-500">No featured projects yet. Check back soon!</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-gray-50">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
