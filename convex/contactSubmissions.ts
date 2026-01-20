import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ===== ADMIN OPERATIONS =====

// Admin query: list ALL contact submissions
export const listAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status")
      .collect();
  },
});

// Update contact submission status
export const updateStatus = mutation({
  args: {
    id: v.id("contactSubmissions"),
    status: v.union(v.literal("new"), v.literal("archived")),
  },
  handler: async (ctx, { id, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { status });
  },
});
