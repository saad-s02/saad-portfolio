# Phase 3: Contact Form - Research

**Researched:** 2026-01-19
**Domain:** React forms with validation, spam protection, and Convex backend
**Confidence:** HIGH

## Summary

The standard approach for building a contact form in Next.js 14 App Router with Convex backend involves:

1. **React Hook Form + Zod** for client-side validation (industry standard, type-safe)
2. **Convex mutations** with `useMutation` hook for data persistence
3. **@convex-dev/ratelimiter** component for spam protection via rate limiting
4. **Honeypot field** as additional spam defense layer (hidden field trap)
5. **React Hot Toast** for user feedback (success/error notifications)

This stack is well-established, with official Convex documentation supporting this pattern and React Hook Form being the most popular form library in the React ecosystem (8,305+ dependent packages). The combination provides type safety from schema definition through to database insertion.

**Primary recommendation:** Use React Hook Form with zodResolver, implement Convex mutation with ConvexError for validation failures, add @convex-dev/ratelimiter for IP-based rate limiting, and include a CSS-hidden honeypot field for bot detection.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | ^7.71.1 | Form state management | Most performant (uncontrolled inputs), smallest re-renders, 8,305+ dependents |
| zod | ^4.3.5 | Schema validation | TypeScript-first, runtime + compile-time safety, pairs with RHF |
| @hookform/resolvers | ^5.2.2 | Zod-RHF integration | Official bridge for schema-based validation |
| react-hot-toast | ^2.6.0 | User notifications | Lightweight (5KB), promise-based API, accessible |
| @convex-dev/ratelimiter | latest | Rate limiting | Official Convex component, transactional, fair queuing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| convex/values | (included) | ConvexError class | Throw structured errors from mutations |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Hook Form | Formik | RHF is more performant (uncontrolled), smaller bundle |
| React Hook Form | React Server Actions only | Loses client-side validation, worse UX (full page refresh on error) |
| Zod | Yup | Zod has better TypeScript inference, more active development |
| react-hot-toast | Sonner | Sonner is newer (good for shadcn/ui), react-hot-toast more established |
| react-hot-toast | react-toastify | react-toastify is 16KB vs 5KB, more features but heavier |
| @convex-dev/ratelimiter | Custom rate limiting | Don't hand-roll - rate limiters need fairness, transaction safety, sharding |

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers react-hot-toast
npm install @convex-dev/ratelimiter
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── contact/
│   └── page.tsx              # Server Component wrapper
components/
└── contact/
    └── ContactForm.tsx        # "use client" - form component
convex/
├── contact.ts                 # Mutation for form submission
├── convex.config.ts           # Register rate limiter component
└── schema.ts                  # Already has contactSubmissions table
lib/
└── validations/
    └── contact.ts             # Shared Zod schema (client + server)
```

### Pattern 1: Shared Validation Schema
**What:** Define Zod schema once, use on both client (React Hook Form) and server (Convex mutation validation)
**When to use:** Always - prevents client/server validation drift
**Example:**
```typescript
// lib/validations/contact.ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string()
    .email("Please enter a valid email address"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  // Honeypot field (should always be empty)
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

### Pattern 2: Client Component with useMutation
**What:** "use client" component with React Hook Form + Convex useMutation hook
**When to use:** Forms that need reactivity and client-side validation
**Example:**
```typescript
// components/contact/ContactForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import toast from "react-hot-toast";
import { ConvexError } from "convex/values";

export function ContactForm() {
  const submitContact = useMutation(api.contact.submit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "", // honeypot
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContact({
        name: data.name,
        email: data.email,
        message: data.message,
        honeypot: data.website || "",
      });
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      if (error instanceof ConvexError) {
        const msg = (error.data as { message: string }).message;
        toast.error(msg || "Failed to send message");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Honeypot field - hidden from users */}
      <input
        {...register("website")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        style={{
          opacity: 0,
          position: "absolute",
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          zIndex: -1,
        }}
      />

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register("name")}
          disabled={isSubmitting}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span id="name-error" role="alert">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Similar for email and message */}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

### Pattern 3: Convex Mutation with Rate Limiting
**What:** Mutation that validates input, checks rate limit, then stores submission
**When to use:** Any user-generated content submission
**Example:**
```typescript
// convex/contact.ts
import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { RateLimiter, MINUTE } from "@convex-dev/ratelimiter";
import { components } from "./_generated/api";

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
    // 1. Check honeypot (bot detection)
    if (args.honeypot && args.honeypot.length > 0) {
      // Silent fail - don't tell bots they were caught
      console.log("Honeypot triggered - bot detected");
      return { success: true }; // Fake success
    }

    // 2. Rate limiting (spam prevention)
    // Get IP from ctx if available, or use session-based key
    const limitKey = "anonymous"; // In production, use IP or session ID

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

    // 3. Server-side validation (defense in depth)
    if (args.name.length < 2 || args.name.length > 50) {
      throw new ConvexError({ message: "Invalid name length" });
    }

    if (!args.email.includes("@")) {
      throw new ConvexError({ message: "Invalid email format" });
    }

    if (args.message.length < 10 || args.message.length > 1000) {
      throw new ConvexError({ message: "Invalid message length" });
    }

    // 4. Store submission
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
```

### Pattern 4: Rate Limiter Setup
**What:** Configure Convex app to use rate limiter component
**When to use:** Required for @convex-dev/ratelimiter to work
**Example:**
```typescript
// convex/convex.config.ts
import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/ratelimiter/convex.config.js";

const app = defineApp();
app.use(rateLimiter);

export default app;
```

### Pattern 5: Toast Provider Setup
**What:** Wrap app with Toaster component for react-hot-toast
**When to use:** Add to root layout once
**Example:**
```typescript
// app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexClientProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937', // dark theme
                color: '#f9fafb',
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

### Anti-Patterns to Avoid

- **No default values in useForm**: Always provide defaultValues to prevent bugs with form reset, dirty state tracking, and controlled components
- **Validation-only in client**: Always validate server-side too - client validation can be bypassed
- **Using display:none for honeypot**: Some bots detect this; use opacity:0 + absolute positioning instead
- **Obvious honeypot names**: Don't use "honeypot" or "spam_trap"; use realistic field names like "website" or "company_url"
- **Not handling isSubmitting state**: Disable button during submission to prevent double-submits
- **Missing error boundaries for ConvexError**: Check `instanceof ConvexError` to handle application errors vs system errors
- **Forgetting to register rate limiter in convex.config.ts**: Component won't work without app.use(rateLimiter)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state management | Custom useState for each field | react-hook-form | Handles validation, dirty state, errors, touched, re-renders optimization, nested fields |
| Schema validation | Manual validation functions | Zod | Type inference, composable schemas, error messages, async validation, transforms |
| Rate limiting | setTimeout + in-memory counter | @convex-dev/ratelimiter | Transactional (rolls back on error), fair queuing (prevents exponential backoff), sharding for scale, distributed state |
| Spam detection | CAPTCHA only | Honeypot + rate limiting | Better UX (no puzzle), catches 50%+ of bots, combined with rate limiting = strong defense |
| Toast notifications | Custom state + setTimeout | react-hot-toast | Promise-based API, positioning, stacking, accessibility (ARIA), keyboard navigation |
| Email validation | Regex only | Zod .email() | Handles edge cases, internationalization, plus/dot addressing |

**Key insight:** Form handling has many edge cases (async validation, field arrays, nested objects, conditional fields, error propagation, accessibility). React Hook Form solves all of these. Rate limiting needs fairness guarantees and distributed state - hand-rolling will miss concurrent request edge cases.

## Common Pitfalls

### Pitfall 1: Forgetting Default Values
**What goes wrong:** Form reset doesn't work, dirty state is incorrect, controlled components break
**Why it happens:** React Hook Form tracks changes from defaultValues baseline
**How to avoid:** Always provide defaultValues in useForm config, even for empty strings
**Warning signs:** `reset()` doesn't clear form, `formState.isDirty` always false

### Pitfall 2: Not Returning Promise from Submit Handler
**What goes wrong:** `isSubmitting` stays false during async operations
**Why it happens:** React Hook Form needs Promise to track submission lifecycle
**How to avoid:** Make onSubmit handler async, or return the Promise from mutation
**Warning signs:** Button doesn't disable during submission, no loading state

### Pitfall 3: Mismatched Field Names
**What goes wrong:** Validation errors don't appear, fields don't register
**Why it happens:** `register("name")` must match schema field name exactly
**How to avoid:** Use TypeScript - `register<keyof FormData>` catches typos
**Warning signs:** Form submits with invalid data, errors.fieldName is always undefined

### Pitfall 4: Honeypot Field Visible to Users
**What goes wrong:** Real users fill it out, legitimate submissions rejected
**Why it happens:** Forgot to hide with CSS, or used wrong CSS properties
**How to avoid:** Use opacity:0 + position:absolute + z-index:-1, test with screen reader
**Warning signs:** Users report "form won't submit" but validation passes

### Pitfall 5: Rate Limit Too Strict
**What goes wrong:** Users hit limit during normal usage (e.g., fixing typos)
**Why it happens:** Set rate to 1 per minute, didn't account for retry behavior
**How to avoid:** Use 3-5 submissions per minute, or token bucket with burst capacity
**Warning signs:** Users complain about "try again later" on first submission

### Pitfall 6: Not Validating Server-Side
**What goes wrong:** Malicious users bypass client validation, insert bad data
**Why it happens:** Assumed client validation is enough, or forgot server validation
**How to avoid:** Always validate in mutation - client validation is UX, server is security
**Warning signs:** Database has data that violates schema constraints

### Pitfall 7: Exposing Rate Limit to Bots
**What goes wrong:** Bots learn the rate limit and stay just under it
**Why it happens:** ConvexError message says "try again in X seconds"
**How to avoid:** For honeypot catches, return fake success; for rate limits, generic error
**Warning signs:** Spam submissions arriving at exact rate limit intervals

### Pitfall 8: Missing Accessibility Attributes
**What goes wrong:** Screen reader users can't understand errors or required fields
**Why it happens:** Forgot aria-invalid, aria-describedby, role="alert" on error messages
**How to avoid:** Add aria-invalid={!!errors.field}, aria-describedby on inputs, role="alert" on error spans
**Warning signs:** Accessibility audit fails, screen reader testing shows unclear errors

### Pitfall 9: Validation Mode Set to onSubmit Only
**What goes wrong:** User doesn't see errors until after submit, then errors persist even after fixing
**Why it happens:** Default mode is "onSubmit", doesn't revalidate on change
**How to avoid:** Use `mode: "onBlur"` or `mode: "onChange"` for better UX
**Warning signs:** Users fix validation errors but error message stays visible

## Code Examples

Verified patterns from official sources:

### Honeypot CSS Hiding (Source: [DEV Community](https://dev.to/felipperegazio/how-to-create-a-simple-honeypot-to-protect-your-web-forms-from-spammers--25n8))
```css
.honeypot {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  z-index: -1;
}
```

**Why not display:none**: Some bots detect and skip display:none fields. Opacity + positioning hides visually while keeping field in DOM.

### React Hook Form Error Display (Source: [React Hook Form Docs](https://react-hook-form.com/get-started))
```typescript
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    {...register("email")}
    aria-invalid={errors.email ? "true" : "false"}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <span id="email-error" role="alert" className="text-red-500">
      {errors.email.message}
    </span>
  )}
</div>
```

### ConvexError Handling (Source: [Convex Docs](https://docs.convex.dev/functions/error-handling/application-errors))
```typescript
import { ConvexError } from "convex/values";

try {
  await submitContact({ name, email, message });
  toast.success("Message sent!");
} catch (error) {
  if (error instanceof ConvexError) {
    // Application error (expected)
    const msg = (error.data as { message: string }).message;
    toast.error(msg);
  } else {
    // System error (unexpected)
    console.error("Unexpected error:", error);
    toast.error("An unexpected error occurred");
  }
}
```

### Rate Limiter Token Bucket (Source: [Convex Rate Limiter Docs](https://www.convex.dev/components/rate-limiter))
```typescript
import { RateLimiter, MINUTE } from "@convex-dev/ratelimiter";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Fixed window: 3 submissions per minute
  contactForm: {
    kind: "fixed window",
    rate: 3,
    period: MINUTE
  },

  // Token bucket: 10/min with burst of 3
  sendMessage: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 3
  },
});

// In mutation
const { ok, retryAfter } = await rateLimiter.limit(
  ctx,
  "contactForm",
  { key: userId, throws: false }
);

if (!ok) {
  throw new ConvexError({
    message: `Please wait ${Math.ceil(retryAfter / 1000)} seconds`
  });
}
```

### Zod Email Validation (Source: [Zod Docs](https://zod.dev/))
```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email too long"),

  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),

  message: z.string()
    .min(10, "Please provide more details")
    .max(1000, "Message is too long"),
});

type FormData = z.infer<typeof schema>;
```

### Accessible Form Labels (Source: [WebAIM](https://webaim.org/techniques/forms/controls))
```typescript
// Semantic HTML with proper label association
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
<input
  id="name"
  type="text"
  required
  aria-required="true"
  {...register("name")}
/>

// For required fields, use both visual indicator and aria-required
// Screen readers announce "Name, required, edit text"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Formik | React Hook Form | ~2020 | Better performance (uncontrolled inputs), smaller bundle, better TypeScript |
| Yup | Zod | ~2021 | Superior TypeScript inference, more active development, better DX |
| Next.js API Routes | Server Actions OR Convex | 2023-2024 | Server Actions for simple cases, Convex for real-time + complex state |
| reCAPTCHA for all forms | Honeypot + rate limiting | Ongoing | Better UX (no puzzle), privacy-friendly, still effective |
| Custom rate limiting | @convex-dev/ratelimiter | 2024+ | Transactional safety, fair queuing, production-ready |
| Manual toast state | react-hot-toast/Sonner | 2021+ | Lighter bundles, better accessibility, promise-based API |

**Deprecated/outdated:**
- **Formik**: Still works but React Hook Form is more performant and has better TypeScript support
- **Manual Server Actions for Convex apps**: Convex mutations provide real-time updates, transactions, and better type safety
- **CAPTCHA-first approach**: Privacy concerns, accessibility issues, annoying UX - honeypot + rate limiting preferred
- **display:none for honeypot**: Detectable by modern bots; use opacity:0 + absolute positioning

## Open Questions

Things that couldn't be fully resolved:

1. **IP-based rate limiting in Convex**
   - What we know: @convex-dev/ratelimiter supports key-based limiting
   - What's unclear: How to reliably get user IP in Convex mutations (ctx doesn't include request headers)
   - Recommendation: Use session-based or anonymous rate limiting for now. For IP-based, may need Next.js middleware to set session cookie with IP hash, or use Convex actions instead of mutations (actions can access HTTP context).

2. **Email notification on form submission**
   - What we know: Convex can trigger actions, could integrate with email service
   - What's unclear: Whether Phase 3 scope includes email notifications or just storage
   - Recommendation: Plan for storage only in Phase 3. Email notifications can be added in Phase 5 (Admin Panel) as a follow-up task.

3. **Spam submission cleanup**
   - What we know: Honeypot catches will be stored in database
   - What's unclear: Whether to store honeypot catches or silently reject them
   - Recommendation: Silent rejection (fake success) to avoid database bloat. Only store legitimate submissions.

4. **Form submission success state persistence**
   - What we know: Toast shows success message
   - What's unclear: Should success message persist on page, or just toast?
   - Recommendation: Show toast + clear form. Optionally add success state to show "Message sent!" until user starts typing again.

## Sources

### Primary (HIGH confidence)
- [Convex Rate Limiting Docs](https://docs.convex.dev/agents/rate-limiting) - Rate limiting implementation patterns
- [Convex Rate Limiter Component](https://www.convex.dev/components/rate-limiter) - API and configuration
- [Convex Next.js App Router Docs](https://docs.convex.dev/client/nextjs/app-router/) - Integration patterns
- [Convex Error Handling](https://docs.convex.dev/functions/error-handling/application-errors) - ConvexError usage
- [React Hook Form Docs](https://react-hook-form.com/get-started) - Basic usage and TypeScript
- [Zod Docs](https://zod.dev/) - Schema validation patterns
- [WebAIM Forms](https://webaim.org/techniques/forms/controls) - Accessibility best practices

### Secondary (MEDIUM confidence)
- [Next.js 14 App Router Best Practices](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7) - Server Actions vs mutations
- [React Hook Form + Zod Integration](https://nehalist.io/react-hook-form-with-nextjs-server-actions/) - Verified pattern
- [Honeypot Implementation](https://dev.to/felipperegazio/how-to-create-a-simple-honeypot-to-protect-your-web-forms-from-spammers--25n8) - CSS hiding techniques
- [React Hot Toast](https://react-hot-toast.com/) - Library documentation
- [React Form UX Best Practices](https://blog.logrocket.com/ui-design-best-practices-loading-error-empty-state-react/) - Loading/error states

### Tertiary (LOW confidence)
- [React Hook Form Common Mistakes](https://alexhooley.com/blog/react-hook-form-common-mistakes) - Community patterns
- [Top React Toast Libraries 2026](https://knock.app/blog/the-top-notification-libraries-for-react) - Library comparison

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React Hook Form and Zod are industry standard with 8K+ and 57M+ weekly downloads respectively
- Architecture: HIGH - Official Convex docs demonstrate useMutation pattern, React Hook Form docs show zodResolver integration
- Rate limiting: HIGH - Official @convex-dev/ratelimiter component with transactional guarantees
- Honeypot: MEDIUM - Community-verified pattern, effective but no official standard
- Accessibility: HIGH - W3C/WebAIM official guidelines for form accessibility

**Research date:** 2026-01-19
**Valid until:** 2026-02-28 (30 days - stable ecosystem, mature libraries)
