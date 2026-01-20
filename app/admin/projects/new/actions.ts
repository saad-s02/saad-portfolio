"use server";

import { projectSchema, type ProjectFormData } from "./schema";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function createProjectAction(formData: ProjectFormData) {
  // Verify authentication
  const { user } = await withAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Validate form data with Zod
  const validated = projectSchema.parse(formData);

  // Call Convex mutation to create project
  const projectId = await fetchMutation(api.projects.create, validated);

  return { success: true, projectId };
}
