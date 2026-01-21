"use server";

import { projectSchema, type ProjectFormData } from "./schema";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function createProjectAction(formData: ProjectFormData) {
  // Verify authentication
  const { user, accessToken } = await withAuth();
  if (!user || !accessToken) {
    throw new Error("Unauthorized");
  }

  // Validate form data with Zod
  const validated = projectSchema.parse(formData);

  // Call Convex mutation to create project with access token
  const projectId = await fetchMutation(api.projects.create, validated, { token: accessToken });

  return { success: true, projectId };
}
