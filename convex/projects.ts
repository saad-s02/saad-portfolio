import { query, mutation } from "./_generated/server";
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
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    // Return null if draft (treat as not found for security)
    if (project?.status !== "published") {
      return null;
    }

    return project;
  },
});

// ===== ADMIN OPERATIONS =====

// Admin query: list ALL projects (including drafts)
export const listAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("projects").collect();
  },
});

// Create project mutation
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    featured: v.boolean(),
    stack: v.array(v.string()),
    tags: v.array(v.string()),
    links: v.array(v.object({ label: v.string(), url: v.string() })),
    screenshots: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const projectId = await ctx.db.insert("projects", args);
    return projectId;
  },
});

// Update project mutation
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    featured: v.optional(v.boolean()),
    stack: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    links: v.optional(v.array(v.object({ label: v.string(), url: v.string() }))),
    screenshots: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, updates);
  },
});

// Delete project mutation
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(id);
  },
});

// Quick status toggle mutation
export const updateStatus = mutation({
  args: {
    id: v.id("projects"),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, { id, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { status });
  },
});

// Toggle featured flag
export const updateFeatured = mutation({
  args: {
    id: v.id("projects"),
    featured: v.boolean(),
  },
  handler: async (ctx, { id, featured }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { featured });
  },
});
