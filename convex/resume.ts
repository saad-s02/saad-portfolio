import { query } from "./_generated/server";

// Get resume data (single document)
export const get = query({
  handler: async (ctx) => {
    // Resume table is single-document, get first entry
    return await ctx.db.query("resume").first();
  },
});
