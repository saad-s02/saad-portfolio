import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get resume data (single document)
export const get = query({
  handler: async (ctx) => {
    // Resume table is single-document, get first entry
    return await ctx.db.query("resume").first();
  },
});

// ===== ADMIN OPERATIONS =====

// Update resume mutation (upsert: patch if exists, insert if not)
export const update = mutation({
  args: {
    highlights: v.array(v.string()),
    experience: v.array(
      v.object({
        role: v.string(),
        company: v.string(),
        period: v.string(),
        description: v.string(),
        achievements: v.array(v.string()),
      })
    ),
    education: v.array(
      v.object({
        degree: v.string(),
        institution: v.string(),
        year: v.string(),
      })
    ),
    skills: v.array(
      v.object({
        category: v.string(),
        items: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if resume document exists
    const existing = await ctx.db.query("resume").first();

    if (existing) {
      // Update existing document
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      // Create new document
      const resumeId = await ctx.db.insert("resume", args);
      return resumeId;
    }
  },
});
