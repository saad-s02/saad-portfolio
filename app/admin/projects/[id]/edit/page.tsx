"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectForm } from "./ProjectForm";
import { Id } from "@/convex/_generated/dataModel";

interface EditProjectPageProps {
  params: {
    id: Id<"projects">;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const projects = useQuery(api.projects.listAll);

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading project...</div>
      </div>
    );
  }

  const project = projects.find((p) => p._id === params.id);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400">Project not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Edit Project</h1>
      <ProjectForm projectId={project._id} initialData={project} />
    </div>
  );
}
