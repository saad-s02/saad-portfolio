"use server";

import { projectSchema, type ProjectFormData } from "../../new/schema";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { Id } from "@/convex/_generated/dataModel";

export async function updateProjectAction(id: Id<"projects">, formData: ProjectFormData) {
  // Verify authentication
  const { user } = await withAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Validate form data with Zod
  const validated = projectSchema.parse(formData);

  // Call Convex mutation to update project
  await fetchMutation(api.projects.update, { id, ...validated });

  return { success: true };
}
