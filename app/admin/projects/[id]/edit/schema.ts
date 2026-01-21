import { z } from "zod";

// Schema for edit form - accepts both string (from textarea) and array formats
export const editProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must not exceed 500 characters"),
  content: z
    .string()
    .min(1, "Content is required"),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  stack: z
    .string()
    .transform((val) =>
      val.split(',').map(s => s.trim()).filter(Boolean)
    )
    .refine((val) => val.length > 0, {
      message: "At least one technology is required"
    }),
  tags: z
    .string()
    .default("")
    .transform((val) =>
      val.split(',').map(s => s.trim()).filter(Boolean)
    ),
  links: z.array(
    z.object({
      label: z.string().min(1, "Link label is required"),
      url: z.string().url("Link URL must be valid"),
    })
  ),
  screenshots: z
    .string()
    .default("")
    .transform((val) =>
      val.split('\n').map(s => s.trim()).filter(Boolean)
    ),
});

export type EditProjectFormData = z.infer<typeof editProjectSchema>;
