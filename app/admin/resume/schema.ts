import { z } from "zod";

export const resumeSchema = z.object({
  highlights: z.array(z.string().min(1, "Highlight cannot be empty")),
  experience: z.array(
    z.object({
      role: z.string().min(1, "Role is required"),
      company: z.string().min(1, "Company is required"),
      period: z.string().min(1, "Period is required"),
      description: z.string().min(1, "Description is required"),
      achievements: z.array(z.string().min(1, "Achievement cannot be empty")),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      year: z.string().min(1, "Year is required"),
    })
  ),
  skills: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      items: z.array(z.string().min(1, "Skill item cannot be empty")),
    })
  ),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
