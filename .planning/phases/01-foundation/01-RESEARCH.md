# Phase 1: Foundation - Research

**Researched:** 2026-01-18
**Domain:** Next.js 16 App Router + TypeScript + Tailwind v4 + Convex
**Confidence:** HIGH

## Summary

Phase 1 establishes the project scaffold with Next.js 16, Tailwind CSS v4, and Convex backend. The standard approach uses `create-next-app@latest` with recommended defaults (TypeScript, ESLint, Tailwind, App Router, Turbopack), then layers in Convex via `npm create convex@latest`. Tailwind v4 introduces breaking changes from v3 (CSS-first configuration, no more tailwind.config.js), and Next.js 16 requires Node.js 20.9+ with all dynamic APIs now async (params, searchParams, cookies, headers must be awaited).

The critical setup order is: (1) Create Next.js project, (2) Install and configure Tailwind v4 with PostCSS, (3) Initialize Convex with schema, (4) Create responsive layout with root layout.tsx containing `<html>` and `<body>` tags, (5) Build navigation component using `usePathname()` hook. Dark theme is configured via Tailwind's CSS `@theme` block or `next-themes` library for user-toggleable themes.

**Primary recommendation:** Use `create-next-app@latest --yes` to avoid prompt variability, then immediately configure Tailwind v4 PostCSS before starting Convex dev server to ensure build pipeline works end-to-end.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.x | React framework with App Router | Industry standard for production React apps, official recommendation |
| TypeScript | 5.1+ | Type safety | Required minimum for Next.js 16, comes default with create-next-app |
| Tailwind CSS | 4.x (beta) | Utility-first CSS | Specified in project requirements, v4 is production-ready beta |
| Convex | Latest | Backend database + server functions | Specified in project, official Next.js integration available |
| Node.js | 20.9+ (LTS) | Runtime environment | Minimum required for Next.js 16 (dropped Node 18 support) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/postcss | 4.x | PostCSS plugin for Tailwind v4 | Required for Tailwind v4 (breaking change from v3) |
| next-themes | 0.3+ | Theme switching (dark/light) | When users need to toggle themes (optional for dark-only sites) |
| @workos-inc/authkit-nextjs | Latest | WorkOS authentication | Phase 2+ (authentication not in Foundation phase) |
| Framer Motion | 11.x | Animation library | Phase 2+ (UI polish, not foundation) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind CSS v4 | Tailwind v3 | v3 is more stable but v4 offers 3-8x faster builds and modern CSS features |
| Convex | Supabase/Firebase | Convex has better TypeScript DX and real-time by default, others more mature |
| App Router | Pages Router | App Router is recommended path forward, Pages Router is legacy |

**Installation:**
```bash
# Step 1: Create Next.js project
npx create-next-app@latest my-app --yes
cd my-app

# Step 2: Install Tailwind v4
npm install -D tailwindcss@next @tailwindcss/postcss@next postcss@latest

# Step 3: Install Convex
npm install convex
npx convex dev
```

## Architecture Patterns

### Recommended Project Structure
```
saad-portfolio/
├── app/                    # App Router (routes, layouts, pages)
│   ├── layout.tsx          # Root layout (MUST have <html> and <body>)
│   ├── page.tsx            # Home route (/)
│   ├── about/              # /about route
│   ├── resume/             # /resume route
│   ├── projects/           # /projects route
│   ├── stack/              # /stack route
│   └── contact/            # /contact route
├── components/             # Shared UI components
│   ├── ui/                 # Atomic design: buttons, cards, inputs
│   └── navigation/         # Header, nav links
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema definition
│   ├── _generated/         # Auto-generated (gitignored)
│   ├── projects.ts         # Query/mutation functions for projects
│   └── auth.config.ts      # Auth configuration (Phase 2+)
├── lib/                    # Utility functions, helpers
├── public/                 # Static assets (images, fonts)
├── .env.local              # Environment variables (gitignored)
├── postcss.config.mjs      # PostCSS + Tailwind v4 config
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

**Key principle:** Keep `app/` directory purely for routing. Store reusable components in `components/`, utilities in `lib/`, and backend logic in `convex/`.

### Pattern 1: Root Layout with Dark Theme
**What:** The root `app/layout.tsx` must define `<html>` and `<body>` tags and can set dark theme as default via `className="dark"` on `<html>` tag.

**When to use:** Every Next.js App Router project (root layout is required).

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/layouts-and-pages
// Source: https://tailwindcss.com/docs/dark-mode
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Personal portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Pattern 2: Convex Schema with Relationships
**What:** Define tables in `convex/schema.ts` using `defineSchema()` and `defineTable()` with validators. Use `v.id("tableName")` for references between tables.

**When to use:** Once data model is solidified (can prototype without schema initially).

**Example:**
```typescript
// Source: https://docs.convex.dev/database/schemas
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    summary: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    featured: v.boolean(),
    stack: v.array(v.string()),
    tags: v.array(v.string()),
    content: v.string(),
  }).index("by_slug", ["slug"]).index("by_status", ["status"]),

  resume: defineTable({
    highlights: v.array(v.string()),
    experience: v.array(v.object({
      role: v.string(),
      company: v.string(),
      period: v.string(),
      description: v.string(),
    })),
    skills: v.array(v.string()),
  }),

  changelog: defineTable({
    date: v.string(),
    title: v.string(),
    summary: v.string(),
    prNumber: v.optional(v.number()),
    commitSha: v.optional(v.string()),
    type: v.union(v.literal("feature"), v.literal("fix"), v.literal("chore")),
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
```

### Pattern 3: Responsive Navigation with Active State
**What:** Navigation component uses `usePathname()` hook to detect current route and highlight active link. Must be a Client Component (`"use client"`).

**When to use:** For header navigation that shows active page state.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/use-pathname
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/stack', label: 'Stack' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-6">
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-gray-300 transition-colors ${
              isActive ? 'text-white font-semibold' : 'text-gray-400'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

### Pattern 4: Tailwind v4 Configuration in CSS
**What:** Tailwind v4 moves configuration from JavaScript to CSS using `@theme` directive. Dark mode enabled via CSS custom variants.

**When to use:** All Tailwind v4 projects (breaking change from v3).

**Example:**
```css
/* Source: https://tailwindcss.com/blog/tailwindcss-v4 */
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Custom colors for dark theme */
  --color-background: oklch(0.1 0.01 240);
  --color-foreground: oklch(0.95 0.01 240);

  /* Custom breakpoints if needed */
  --breakpoint-3xl: 1920px;
}

/* Enable dark mode with .dark class */
@custom-variant dark (&:where(.dark, .dark *));
```

### Pattern 5: Convex Provider Setup (App Router)
**What:** Wrap the app with `ConvexProvider` in a client component, then use that provider in root layout.

**When to use:** Every Convex + Next.js App Router integration.

**Example:**
```typescript
// Source: https://docs.convex.dev/quickstart/nextjs
// app/ConvexClientProvider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

// app/layout.tsx
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

### Anti-Patterns to Avoid
- **Using `sm:` for mobile styles:** Tailwind is mobile-first, so unprefixed utilities target mobile, `sm:` targets 640px+
- **Synchronous dynamic APIs:** In Next.js 16, `params`, `searchParams`, `cookies()`, `headers()` are async and must be awaited
- **Missing `<html>` and `<body>` in root layout:** Next.js will error if root layout doesn't define these tags
- **Using tailwind.config.js with v4:** Tailwind v4 uses CSS-first config via `@theme`, config.js is legacy
- **Array fields in Convex without indexing strategy:** Arrays can't be indexed, use join tables for many-to-many relationships

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode toggle | Custom theme context + localStorage | `next-themes` library | Handles SSR hydration mismatches, system preference detection, persistence |
| Responsive breakpoints | Custom media queries | Tailwind's built-in breakpoints | Mobile-first, consistent across project, no CSS-in-JS needed |
| Database schema validation | Manual type checking in mutations | Convex schema with validators | Runtime validation, automatic TypeScript types, prevents bad data |
| Route-based active nav state | Manually tracking clicks | `usePathname()` hook | Handles browser back/forward, direct URL access, always accurate |
| Environment variable loading | Custom .env parsing | Next.js built-in `process.env` | Automatic NEXT_PUBLIC_ prefix handling, TypeScript support |
| Image optimization | `<img>` tags | `next/image` component | Automatic lazy loading, WebP conversion, responsive srcsets |

**Key insight:** Next.js 16 and Convex both provide heavily optimized primitives that handle edge cases (SSR hydration, caching, validation) that would take weeks to implement correctly. Using framework defaults prevents entire classes of bugs.

## Common Pitfalls

### Pitfall 1: Async Dynamic APIs Not Awaited
**What goes wrong:** Code that worked in Next.js 15 throws errors in Next.js 16 when accessing `params`, `searchParams`, `cookies()`, or `headers()` synchronously.

**Why it happens:** Next.js 16 made these APIs async to enable streaming and better concurrency. The change allows the framework to start rendering while params are being resolved.

**How to avoid:** Always await dynamic APIs and mark components as `async`.

**Warning signs:**
- TypeScript errors: "Property 'x' does not exist on type 'Promise<...>'"
- Runtime errors: "Cannot read property of undefined"

**Fix:**
```typescript
// ❌ Wrong (Next.js 15 style)
export default function Page({ params, searchParams }) {
  const id = params.id;
  return <div>{id}</div>;
}

// ✅ Correct (Next.js 16)
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string }>
}) {
  const { id } = await params;
  const search = await searchParams;
  return <div>{id}</div>;
}

// For cookies/headers
export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  // ...
}
```

**Automated fix:** Run `npx @next/codemod@canary upgrade latest` to auto-convert synchronous usage to async.

### Pitfall 2: Missing `<html>` and `<body>` Tags in Root Layout
**What goes wrong:** Next.js build fails with error: "The root layout is required and must define `<html>` and `<body>` tags."

**Why it happens:** App Router requires explicit `<html>` and `<body>` tags in `app/layout.tsx` because Next.js doesn't automatically wrap your content like Pages Router did. This gives you control over attributes (lang, className for dark mode).

**How to avoid:** Always include both tags in root layout.

**Warning signs:**
- Build error: "Missing required HTML tags"
- Multiple app folders in project causing confusion

**Fix:**
```typescript
// ❌ Wrong
export default function RootLayout({ children }) {
  return <div>{children}</div>
}

// ✅ Correct
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Pitfall 3: Tailwind v4 PostCSS Not Configured
**What goes wrong:** Tailwind classes don't work, build fails with "unknown at-rule @import 'tailwindcss'" or PostCSS errors.

**Why it happens:** Tailwind v4 requires `@tailwindcss/postcss` plugin instead of direct `tailwindcss` plugin. The PostCSS plugin moved to a separate package in v4.

**How to avoid:** Install `@tailwindcss/postcss` and configure `postcss.config.mjs` before first build.

**Warning signs:**
- CSS classes not applying
- PostCSS plugin errors in build output
- "Failed to load tailwindcss as a PostCSS plugin"

**Fix:**
```bash
# Install correct packages
npm install -D tailwindcss@next @tailwindcss/postcss@next postcss@latest
```

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```css
/* app/globals.css */
@import "tailwindcss";
/* NOT the old @tailwind directives */
```

### Pitfall 4: Convex Schema Without Indexes on Queried Fields
**What goes wrong:** Queries work in development but are slow or fail in production with large datasets. Error: "Query does not satisfy indexes."

**Why it happens:** Convex requires indexes for efficient queries. Without indexes, queries scan entire tables. During prototyping without schema, all queries work, but once you add schema, you must define indexes for filtered fields.

**How to avoid:** Add `.index()` for every field you query/filter by, especially in `where()` clauses.

**Warning signs:**
- Slow query performance
- Dashboard warnings about missing indexes
- Production errors not seen in dev

**Fix:**
```typescript
// ❌ Wrong - no index on slug field
export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    title: v.string(),
  }),
});

// ✅ Correct - index on queried field
export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    title: v.string(),
  }).index("by_slug", ["slug"]),
});
```

### Pitfall 5: Using `sm:` Prefix for Mobile Styles
**What goes wrong:** Styles intended for mobile screens don't apply on mobile devices.

**Why it happens:** Tailwind is mobile-first. Unprefixed utilities apply to all screen sizes starting from mobile. `sm:` applies at 640px and above (tablet+), not mobile.

**How to avoid:** Use unprefixed utilities for mobile base styles, then layer breakpoint prefixes for larger screens.

**Warning signs:**
- Layout broken on mobile but works on desktop
- Styles "skipping" the mobile viewport

**Fix:**
```typescript
// ❌ Wrong - sm: applies at 640px+, nothing styles 0-639px
<div className="sm:flex sm:flex-col sm:gap-4">

// ✅ Correct - unprefixed for mobile (0px+), md: for desktop (768px+)
<div className="flex flex-col gap-4 md:flex-row md:gap-8">
```

### Pitfall 6: Convex `useQuery()` in Server Component
**What goes wrong:** Error: "useQuery is not a function" or "Hooks can only be called inside a Client Component."

**Why it happens:** Convex's `useQuery()` is a React hook, which only works in Client Components. Server Components cannot use hooks.

**How to avoid:** Mark components using Convex hooks as `"use client"` or fetch data in Server Component using Convex's HTTP API (advanced).

**Warning signs:**
- Hook-related errors in Server Components
- "Attempted to call useQuery() from the server"

**Fix:**
```typescript
// ❌ Wrong - Server Component trying to use hook
export default function ProjectsList() {
  const projects = useQuery(api.projects.list);
  return <div>{/* ... */}</div>
}

// ✅ Correct - Client Component with "use client"
"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProjectsList() {
  const projects = useQuery(api.projects.list);
  return <div>{/* ... */}</div>
}
```

### Pitfall 7: Environment Variables Not Prefixed with `NEXT_PUBLIC_`
**What goes wrong:** `process.env.CONVEX_URL` is `undefined` in client-side code, breaking Convex connection.

**Why it happens:** Next.js only exposes environment variables to the browser if they're prefixed with `NEXT_PUBLIC_`. Server-side variables remain private.

**How to avoid:** Use `NEXT_PUBLIC_` prefix for any variable needed in browser code (like Convex URL).

**Warning signs:**
- Variables work on server but not client
- ConvexReactClient initialization fails
- "Invalid URL" errors in browser console

**Fix:**
```bash
# .env.local

# ❌ Wrong - not exposed to browser
CONVEX_URL=https://...

# ✅ Correct - available in browser
NEXT_PUBLIC_CONVEX_URL=https://...
```

```typescript
// ConvexClientProvider.tsx
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL! // Must have NEXT_PUBLIC_ prefix
);
```

## Code Examples

Verified patterns from official sources:

### Complete Root Layout with Dark Theme
```typescript
// Source: https://nextjs.org/docs/app/getting-started/layouts-and-pages
// app/layout.tsx
import type { Metadata } from 'next'
import { ConvexClientProvider } from './ConvexClientProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'My Portfolio',
    template: '%s | My Portfolio',
  },
  description: 'Personal portfolio showcasing projects and skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-50 antialiased">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
```

### Tailwind v4 Global CSS
```css
/* Source: https://tailwindcss.com/blog/tailwindcss-v4 */
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Dark theme color palette */
  --color-gray-950: #0a0a0b;
  --color-gray-900: #18181b;
  --color-gray-800: #27272a;
  --color-gray-50: #fafafa;

  /* Custom fonts if needed */
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Enable dark mode variant */
@custom-variant dark (&:where(.dark, .dark *));

/* Base styles */
body {
  font-family: var(--font-sans);
}
```

### Responsive Header Component
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/use-pathname
// components/navigation/Header.tsx
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/stack', label: 'Stack' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-xl font-bold">
            Portfolio
          </Link>

          <ul className="flex flex-wrap gap-4 md:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-gray-300 ${
                      isActive
                        ? 'text-white font-semibold border-b-2 border-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
```

### Convex Schema for Portfolio
```typescript
// Source: https://docs.convex.dev/database/schemas
// convex/schema.ts
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
```

### Basic Convex Query Function
```typescript
// Source: https://docs.convex.dev/quickstart/nextjs
// convex/projects.ts
import { query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .collect();
  },
});

export const getFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) =>
        q.eq("featured", true).eq("status", "published")
      )
      .collect();
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `pages/` directory | `app/` directory (App Router) | Next.js 13 (2022) | Layouts, streaming, React Server Components enabled |
| Synchronous `params`, `cookies()` | Async (must await) | Next.js 16 (Oct 2025) | Breaking change - all code must await dynamic APIs |
| `tailwind.config.js` | CSS `@theme` directive | Tailwind v4 (2025) | Configuration in CSS, 3-8x faster builds |
| Webpack | Turbopack | Next.js 16 (default) | 2-5x faster builds, opt-out with `--webpack` flag |
| Node.js 18 support | Node.js 20.9+ required | Next.js 16 | Must upgrade Node version before upgrading Next |
| TypeScript 5.0 | TypeScript 5.1+ | Next.js 16 | Must upgrade TypeScript to 5.1 or higher |
| `@tailwind` directives in CSS | `@import "tailwindcss"` | Tailwind v4 | Single import replaces base/components/utilities |
| Manual content paths config | Automatic detection | Tailwind v4 | No more `content: []` array in config |

**Deprecated/outdated:**
- **Pages Router:** Still supported but not recommended for new projects. App Router is the future.
- **`next lint` command:** Removed in Next.js 16, use ESLint directly (`npx eslint .`)
- **AMP support:** Completely removed in Next.js 16
- **`next/legacy/image`:** Use `next/image` instead (automatic optimization)
- **`images.domains`:** Use `images.remotePatterns` for external images
- **Runtime config (`serverRuntimeConfig`):** Use environment variables instead

## Open Questions

Things that couldn't be fully resolved:

1. **Tailwind v4 Production Stability**
   - What we know: Tailwind v4 is in beta (stable beta), used by many production apps, 3-8x faster than v3
   - What's unclear: Official v4 stable release date, any remaining breaking changes before stable
   - Recommendation: Proceed with v4 beta as specified in requirements. Monitor Tailwind blog for stable release. If issues arise, v3 is stable fallback.

2. **Convex Schema Migration Strategy**
   - What we know: Convex recommends prototyping without schema, then adding schema later
   - What's unclear: Best approach for adding schema to existing data with production traffic
   - Recommendation: Define schema from start in Phase 1 since data model is specified in PRD. Avoids migration complexity.

3. **Mobile Breakpoint (375px) Coverage**
   - What we know: Tailwind's default mobile-first approach starts at 0px, first breakpoint `sm:` is 640px
   - What's unclear: Whether 375px (iPhone SE) needs explicit handling vs. relying on unprefixed utilities
   - Recommendation: Use unprefixed utilities for mobile base (covers 0-639px including 375px). Test on actual device to confirm no gaps.

4. **Next.js 16 TypeScript Upgrade Impact**
   - What we know: TypeScript 5.1+ required, `params`/`searchParams` now typed as Promises
   - What's unclear: Whether IDE/editor support has caught up with async params pattern (autocomplete, refactoring)
   - Recommendation: Ensure VS Code with latest TypeScript extension. If autocomplete breaks, explicitly type params: `Promise<{ id: string }>`.

## Sources

### Primary (HIGH confidence)
- [Next.js 16 Official Release Notes](https://nextjs.org/blog/next-16) - Version requirements, breaking changes
- [Next.js Installation Guide](https://nextjs.org/docs/app/getting-started/installation) - Official setup commands
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) - File organization
- [Next.js Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16) - Migration guide
- [Next.js Missing Root Layout Tags](https://nextjs.org/docs/messages/missing-root-layout-tags) - Required HTML structure
- [Next.js Dynamic APIs Async](https://nextjs.org/docs/messages/sync-dynamic-apis) - Async params/cookies/headers
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4) - v4 installation and changes
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design) - Mobile-first breakpoints
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) - Dark theme configuration
- [Convex Next.js Quickstart](https://docs.convex.dev/quickstart/nextjs) - Official integration guide
- [Convex Schemas](https://docs.convex.dev/database/schemas) - Schema definition and validators
- [Convex + WorkOS AuthKit](https://docs.convex.dev/auth/authkit/) - Authentication setup (Phase 2)

### Secondary (MEDIUM confidence)
- [Implementing Dark Mode with Tailwind v4 and Next.js](https://www.thingsaboutweb.dev/en/posts/dark-mode-with-tailwind-v4-nextjs) - Dark theme patterns
- [Next.js 16 Practical Guide](https://dev.to/wadizaatour/nextjs-16-practical-guide-whats-new-how-to-configure-locally-and-examples-10em) - Setup walkthrough
- [Convex Schema Best Practices Gist](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339) - Community guidelines
- [Next.js Folder Structure Best Practices (2026)](https://www.codebydeep.com/blog/next-js-folder-structure-best-practices-for-scalable-applications-2026-guide) - Organization patterns
- [Responsive Design Superpowers: Tailwind CSS 4 with Next.js 15](https://medium.com/@sureshdotariya/responsive-design-superpowers-tailwind-css-4-with-next-js-15-4920329508ec) - Responsive patterns

### Tertiary (LOW confidence - marked for validation)
- [10 Performance Mistakes in Next.js 16](https://medium.com/@sureshdotariya/10-performance-mistakes-in-next-js-16-that-are-killing-your-app-and-how-to-fix-them-2facfab26bea) - Performance pitfalls (couldn't fetch, marked LOW)
- [Stop Next.js 16 Crashes: Fixing searchParams Errors](https://www.buildwithmatija.com/blog/stop-nextjs-16-from-crashing-on-searchparams) - Async params troubleshooting

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations from official documentation and release notes
- Architecture: HIGH - Patterns verified with official Next.js and Convex docs
- Pitfalls: HIGH - Breaking changes documented in official upgrade guides and error pages
- Tailwind v4: MEDIUM - Beta status, but stable enough for production per official blog
- Convex best practices: MEDIUM - Official docs supplemented by community patterns

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days - stable stack, Next.js 16 just released Oct 2025)
**Next.js version researched:** 16.0
**Tailwind version researched:** 4.0 (beta)
**Convex version researched:** Latest (rolling release model)
