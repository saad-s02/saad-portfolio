"use server";

import { resumeSchema, type ResumeFormData } from "./schema";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function updateResumeAction(formData: ResumeFormData) {
  // Verify authentication
  const { user, accessToken } = await withAuth();
  if (!user || !accessToken) {
    throw new Error("Unauthorized");
  }

  // Validate input
  const validated = resumeSchema.parse(formData);

  // Call Convex mutation with access token
  await fetchMutation(api.resume.update, validated, { token: accessToken });

  return { success: true };
}
