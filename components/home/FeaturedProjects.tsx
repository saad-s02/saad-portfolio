"use client";
import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {
  preloadedProjects: Preloaded<typeof api.projects.listFeatured>;
};

export function FeaturedProjects({ preloadedProjects }: Props) {
  const projects = usePreloadedQuery(preloadedProjects);

  return (
    <section>
      <h2 className="text-3xl font-bold">Featured Projects</h2>
      <p className="text-gray-400">Placeholder - will be implemented in plan 02-02</p>
      <p className="text-gray-500 text-sm">Projects loaded: {projects.length}</p>
    </section>
  );
}
