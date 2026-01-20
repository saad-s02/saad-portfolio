import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ===== ADMIN OPERATIONS =====

// Admin query: list ALL changelog entries
export const listAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("changelog")
      .withIndex("by_date")
      .order("desc")
      .collect();
  },
});

// Update changelog visibility
export const updateVisibility = mutation({
  args: {
    id: v.id("changelog"),
    visible: v.boolean(),
  },
  handler: async (ctx, { id, visible }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { visible });
  },
});
