import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    featured: v.boolean(),
    stack: v.array(v.string()),
    tags: v.array(v.string()),
    links: v.array(v.object({
      label: v.string(),
      url: v.string(),
    })),
    screenshots: v.array(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured", "status"]),

  resume: defineTable({
    highlights: v.array(v.string()),
    experience: v.array(v.object({
      role: v.string(),
      company: v.string(),
      period: v.string(),
      description: v.string(),
      achievements: v.array(v.string()),
    })),
    education: v.array(v.object({
      degree: v.string(),
      institution: v.string(),
      year: v.string(),
    })),
    skills: v.array(v.object({
      category: v.string(),
      items: v.array(v.string()),
    })),
  }),

  changelog: defineTable({
    date: v.string(),
    title: v.string(),
    summary: v.string(),
    prNumber: v.optional(v.number()),
    commitSha: v.optional(v.string()),
    type: v.union(
      v.literal("feature"),
      v.literal("fix"),
      v.literal("chore")
    ),
    visible: v.boolean(),
  }).index("by_date", ["date"]),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("archived")),
    submittedAt: v.string(),
  }).index("by_status", ["status"]),
});
