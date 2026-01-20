"use server";

import { resumeSchema, type ResumeFormData } from "./schema";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function updateResumeAction(formData: ResumeFormData) {
  // Verify authentication
  const { user } = await withAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Validate input
  const validated = resumeSchema.parse(formData);

  // Call Convex mutation
  await fetchMutation(api.resume.update, validated);

  return { success: true };
}
