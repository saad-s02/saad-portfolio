import { query } from "./_generated/server";
import { v } from "convex/values";

// List all published projects (for projects index page)
export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

// Get top 3 featured published projects (for home page)
export const listFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) =>
        q.eq("featured", true).eq("status", "published")
      )
      .order("desc")
      .take(3);
  },
});

// Get single project by slug (for project detail pages)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});
