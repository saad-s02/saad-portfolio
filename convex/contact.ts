import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

// Set up rate limiter: 3 submissions per minute (fixed window)
const rateLimiter = new RateLimiter(components.rateLimiter, {
  contactForm: {
    kind: "fixed window",
    rate: 3,        // 3 submissions
    period: MINUTE  // per minute
  },
});

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    honeypot: v.string(),
  },
  handler: async (ctx, args) => {
    // Layer 1 - Honeypot check (bot detection)
    // CRITICAL: Silently return fake success to avoid alerting bots
    if (args.honeypot && args.honeypot.length > 0) {
      console.log("Honeypot triggered - bot detected");
      return { success: true }; // Fake success to not alert bot
    }

    // Layer 2 - Rate limiting (spam prevention)
    // TODO: Use IP address or session ID in production instead of "anonymous"
    const limitKey = "anonymous";
    const { ok, retryAfter } = await rateLimiter.limit(
      ctx,
      "contactForm",
      { key: limitKey }
    );

    if (!ok) {
      throw new ConvexError({
        message: `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 1000)} seconds.`,
      });
    }

    // Layer 3 - Server-side validation (defense in depth)
    // Client validation can be bypassed - server validation is security
    if (args.name.length < 2 || args.name.length > 50) {
      throw new ConvexError({
        message: "Name must be between 2 and 50 characters",
      });
    }

    // Enforce proper email format - matches Zod .email() validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new ConvexError({
        message: "Please enter a valid email address",
      });
    }

    if (args.message.length < 10 || args.message.length > 1000) {
      throw new ConvexError({
        message: "Message must be between 10 and 1000 characters",
      });
    }

    // Layer 4 - Store submission
    await ctx.db.insert("contactSubmissions", {
      name: args.name,
      email: args.email,
      message: args.message,
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});
