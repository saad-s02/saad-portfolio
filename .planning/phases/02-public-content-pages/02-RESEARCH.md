# Phase 2: Public Content Pages - Research

**Researched:** 2026-01-19
**Domain:** Next.js App Router with Convex backend, portfolio content rendering
**Confidence:** HIGH

## Summary

Phase 2 involves building public-facing portfolio pages using Next.js 15 App Router with Convex as the backend. The research confirms that the optimal architecture pattern is:

1. **Server Components by default** - Fetch data server-side using Convex's `preloadQuery` or `fetchQuery`
2. **Strategic client boundaries** - Use "use client" only for interactive elements (Framer Motion animations, filters)
3. **Index-optimized queries** - Leverage Convex's compound indexes (by_status, by_featured) for efficient filtering
4. **Progressive enhancement** - Use Suspense boundaries for granular loading states and streaming

The existing foundation (Convex schema with indexes, dark theme, ConvexClientProvider) aligns perfectly with 2026 best practices. The main additions needed are: Framer Motion for animations, proper SEO metadata, and Convex query functions.

**Primary recommendation:** Build all pages as async Server Components that use Convex `preloadQuery` for initial data + reactivity, wrap interactive UI sections in small Client Components, and use Tailwind's mobile-first grid patterns for responsive layouts.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15+ (App Router) | React framework with RSC | Industry standard for SSR, built-in optimization, native async components |
| Convex | 1.31.5+ | Backend + real-time database | Already integrated, provides reactive queries + server rendering support |
| Framer Motion | 11.x | Declarative animations | Industry standard for React animations, excellent performance, whileInView support |
| Tailwind CSS | 4.x (beta) | Utility-first styling | Already integrated, v4 CSS-first approach aligns with dark theme implementation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | Built-in | Image optimization | All project screenshots, automatically optimizes for responsive layouts |
| React cache | Built-in React 19 | Request deduplication | Shared data between generateMetadata and page component |
| @next/og | Built-in | Dynamic OG images | Generate project-specific social preview images |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Framer Motion | GSAP | GSAP more powerful but React-unfriendly, Framer Motion more declarative |
| preloadQuery | fetchQuery only | fetchQuery simpler but loses client-side reactivity |
| Suspense boundaries | loading.tsx only | loading.tsx easier but less granular control |

**Installation:**
```bash
npm install framer-motion
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── page.tsx                 # Home (Server Component with preloadQuery)
├── about/page.tsx           # About (Server Component, static content)
├── resume/page.tsx          # Resume (Server Component with preloadQuery)
├── projects/
│   ├── page.tsx            # Project index (Server Component with preloadQuery)
│   └── [slug]/page.tsx     # Project detail (dynamic route with generateStaticParams)
├── stack/page.tsx          # Stack/Automation (Server Component, static diagrams)
└── components/
    ├── home/
    │   ├── HeroSection.tsx         # Server Component
    │   ├── FeaturedProjects.tsx    # Client Component (animations)
    │   └── AutomationTeaser.tsx    # Client Component (animations)
    ├── projects/
    │   ├── ProjectCard.tsx         # Client Component (hover animations)
    │   ├── ProjectGrid.tsx         # Server Component (layout)
    │   └── ProjectDetail.tsx       # Server Component (content)
    └── resume/
        ├── ResumeSection.tsx       # Server Component
        └── SkillsGrid.tsx          # Server Component
```

### Pattern 1: Server Component with Convex Data Fetching
**What:** Async Server Component using `preloadQuery` for initial render + client reactivity
**When to use:** Any page that displays Convex data and needs real-time updates
**Example:**
```typescript
// Source: https://docs.convex.dev/client/nextjs/app-router/server-rendering
// app/projects/page.tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export default async function ProjectsPage() {
  const preloadedProjects = await preloadQuery(api.projects.listPublished);

  return (
    <div>
      <h1>Projects</h1>
      <ProjectGrid preloadedProjects={preloadedProjects} />
    </div>
  );
}

// components/projects/ProjectGrid.tsx
"use client";
import { usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ preloadedProjects }) {
  const projects = usePreloadedQuery(preloadedProjects);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
```

### Pattern 2: Dynamic Routes with Static Generation
**What:** Use `generateStaticParams` to pre-render project detail pages at build time
**When to use:** Dynamic routes with known set of slugs (projects, blog posts)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
// app/projects/[slug]/page.tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  // Fetch all published project slugs at build time
  const projects = await fetchQuery(api.projects.listPublished);
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.screenshots[0] ? [project.screenshots[0]] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const preloadedProject = await preloadQuery(api.projects.getBySlug, { slug });

  // Check if project exists (preloadedQueryResult extracts value)
  const project = preloadedQueryResult(preloadedProject);
  if (!project) {
    notFound();
  }

  return <ProjectDetail preloadedProject={preloadedProject} />;
}
```

### Pattern 3: Client Component Boundaries for Animations
**What:** Wrap only interactive/animated sections in "use client" components
**When to use:** Framer Motion animations, hover effects, scroll reveals
**Example:**
```typescript
// Source: https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/
"use client";
import { motion } from "framer-motion";

export function ProjectCard({ project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gray-900 rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-gray-400 mt-2">{project.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.map(tech => (
            <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
```

### Pattern 4: Convex Query with Index Filtering
**What:** Use `.withIndex()` for efficient status/featured filtering
**When to use:** Filtering published vs draft, featured projects, any indexed field
**Example:**
```typescript
// Source: https://docs.convex.dev/database/reading-data/indexes/
// convex/projects.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const listFeatured = query({
  handler: async (ctx) => {
    // by_featured index is ["featured", "status"]
    return await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) =>
        q.eq("featured", true).eq("status", "published")
      )
      .order("desc")
      .take(3);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});
```

### Pattern 5: Suspense Boundaries for Progressive Loading
**What:** Use `<Suspense>` for granular loading states per section
**When to use:** Different sections load at different speeds, want skeleton UI
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/linking-and-navigating
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <Suspense fallback={<HighlightsSkeleton />}>
        <HighlightsSection />
      </Suspense>

      <Suspense fallback={<ProjectCardsSkeleton />}>
        <FeaturedProjects />
      </Suspense>

      <AutomationTeaser />
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Multiple preloadQuery calls on same page:** Can return inconsistent data (different database snapshots). Use single preloadQuery and pass data down, or use fetchQuery for static content.
- **Entire page as Client Component:** Loses server rendering benefits, increases bundle size. Only mark interactive sections.
- **Using .filter() for status checks:** Scans entire table. Use .withIndex("by_status") instead.
- **Forgetting viewport={{ once: true }}:** Animations retrigger on scroll up/down, causing distraction.
- **Not awaiting params in dynamic routes:** TypeScript error in Next.js 15. Always `const { slug } = await params`.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom srcset generator | next/image component | Handles responsive images, format detection (WebP/AVIF), lazy loading, CLS prevention automatically |
| Scroll reveal animations | IntersectionObserver + state | Framer Motion whileInView | Handles viewport detection, animation orchestration, performance optimization out-of-box |
| Loading states | Manual loading flags | Suspense boundaries + loading.tsx | Native streaming support, automatic error boundaries, built into Next.js |
| 404 handling | Custom error checking | notFound() function + not-found.tsx | Proper HTTP status codes, SEO-friendly, integrated with Next.js routing |
| Request deduplication | Manual caching logic | React cache() function | Automatic deduplication within render pass, works with Convex queries |
| SEO metadata | Manual meta tags | generateMetadata function | Type-safe, supports async data fetching, OG image generation, automatic deduplication |
| Responsive grids | Custom breakpoint CSS | Tailwind grid utilities | Mobile-first, consistent breakpoints (sm/md/lg/xl), minimal bundle size |

**Key insight:** Next.js 15 + React 19 provide native solutions for most data fetching, loading, and error handling patterns. Reinventing these creates maintenance burden and loses performance optimizations.

## Common Pitfalls

### Pitfall 1: ConvexReactClient in Server Components
**What goes wrong:** Trying to use `useQuery` or `useMutation` in Server Components causes "cannot use hooks in Server Component" error
**Why it happens:** Convex React hooks require client-side ConvexProvider context, Server Components don't have access
**How to avoid:** Use `preloadQuery` or `fetchQuery` in Server Components, pass result to Client Component that uses `usePreloadedQuery`
**Warning signs:** Import from "convex/react" in file without "use client" directive

### Pitfall 2: Missing Indexes for Status Filtering
**What goes wrong:** Query to filter published projects becomes slow with 100+ projects
**Why it happens:** `.filter()` scans entire table, doesn't use indexes. Schema has indexes but query doesn't reference them
**How to avoid:** Always use `.withIndex("by_status", q => q.eq("status", "published"))` instead of `.filter(q => q.eq(q.field("status"), "published"))`
**Warning signs:** Convex dashboard shows high query latency, no index usage in query plan

### Pitfall 3: Framer Motion Animation Thrashing
**What goes wrong:** Cards animate every time user scrolls up/down past them, causing distraction
**Why it happens:** Default whileInView reruns animation whenever element enters viewport
**How to avoid:** Add `viewport={{ once: true }}` to motion components for scroll-triggered animations
**Warning signs:** Animations feel repetitive, users complain about "jittery" scrolling

### Pitfall 4: Client-Side Data Fetching for Initial Render
**What goes wrong:** Page shows loading spinner on first visit, poor SEO, slower perceived performance
**Why it happens:** Using `useQuery` in Client Component without preloading forces client-side fetch
**How to avoid:** Use `preloadQuery` in parent Server Component, pass to Client Component via `usePreloadedQuery`
**Warning signs:** "Loading..." visible in view source, Lighthouse scores penalize FCP/LCP

### Pitfall 5: Dynamic Routes Without generateStaticParams
**What goes wrong:** Project detail pages render on-demand at request time, increasing latency
**Why it happens:** Next.js defaults to dynamic rendering for [slug] routes without generateStaticParams
**How to avoid:** Export `generateStaticParams` from page.tsx to pre-render all known project routes at build time
**Warning signs:** Build output shows "λ" (lambda) instead of "○" (static) for project routes

### Pitfall 6: Missing notFound() Checks
**What goes wrong:** Accessing /projects/invalid-slug shows blank page or error instead of 404
**Why it happens:** Query returns null/undefined but component tries to render without checking
**How to avoid:** Check if query result is null after preloadQuery, call `notFound()` if missing
**Warning signs:** Console errors about "cannot read property of null", incorrect HTTP 200 status for missing resources

### Pitfall 7: Oversized Images in Project Screenshots
**What goes wrong:** Project pages load slowly due to large unoptimized images
**Why it happens:** Using `<img>` tag instead of `next/image`, no responsive sizing
**How to avoid:** Use `<Image>` component with `sizes` prop for responsive images, let Next.js optimize formats
**Warning signs:** Lighthouse flags large image payloads, slow LCP scores

### Pitfall 8: Non-Responsive Grid Layouts
**What goes wrong:** Project cards look cramped on mobile, too sparse on desktop
**Why it happens:** Fixed grid-cols-3 without responsive modifiers
**How to avoid:** Use mobile-first pattern: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
**Warning signs:** Horizontal scrolling on mobile, cards too small to read

## Code Examples

Verified patterns from official sources:

### Home Page with Multiple Sections
```typescript
// Source: https://nextjs.org/docs/app/getting-started/fetching-data
// app/page.tsx
import { Suspense } from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { AutomationTeaser } from "@/components/home/AutomationTeaser";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata = {
  title: "Home",
  description: "Personal portfolio showcasing projects and engineering automation",
};

export default async function HomePage() {
  // Preload featured projects for client-side reactivity
  const preloadedFeatured = await preloadQuery(api.projects.listFeatured);

  return (
    <div className="space-y-16">
      <HeroSection />
      <HighlightsSection />

      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-900 rounded-lg" />}>
        <FeaturedProjects preloadedProjects={preloadedFeatured} />
      </Suspense>

      <AutomationTeaser />
      <ContactCTA />
    </div>
  );
}
```

### Resume Page with Convex Data
```typescript
// Source: https://docs.convex.dev/client/nextjs/app-router/server-rendering
// app/resume/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ResumeSection } from "@/components/resume/ResumeSection";

export const metadata = {
  title: "Resume",
  description: "Professional experience, skills, and education",
};

export default async function ResumePage() {
  // fetchQuery for non-reactive data (resume doesn't change in real-time)
  const resume = await fetchQuery(api.resume.get);

  if (!resume) {
    return <div>Resume data not available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
        <ul className="list-disc list-inside space-y-2">
          {resume.highlights.map((highlight, i) => (
            <li key={i} className="text-gray-300">{highlight}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Experience</h2>
        {resume.experience.map((exp, i) => (
          <ResumeSection key={i} experience={exp} />
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resume.skills.map((skillGroup, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-2">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-gray-800 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

### Animated Project Card with Framer Motion
```typescript
// Source: https://blog.logrocket.com/react-scroll-animations-framer-motion/
// components/projects/ProjectCard.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ProjectCard({ project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800
                     hover:border-gray-700 transition-colors"
        >
          {project.screenshots[0] && (
            <div className="relative h-48 bg-gray-800">
              <Image
                src={project.screenshots[0]}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-400 mb-4 line-clamp-2">{project.summary}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.stack.slice(0, 4).map(tech => (
                <span key={tech} className="px-2 py-1 bg-gray-800 rounded text-sm">
                  {tech}
                </span>
              ))}
              {project.stack.length > 4 && (
                <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                  +{project.stack.length - 4}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500">#{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
```

### Responsive Grid Layout
```typescript
// Source: https://tailwindflex.com/@amit/responsive-card-grid
// components/projects/ProjectGrid.tsx
"use client";
import { usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ preloadedProjects }) {
  const projects = usePreloadedQuery(preloadedProjects);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
```

### Convex Query Functions
```typescript
// Source: https://docs.convex.dev/database/reading-data/indexes/
// convex/projects.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// List all published projects
export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

// Get top 3 featured projects for homepage
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

// Get single project by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});
```

### Resume Query
```typescript
// convex/resume.ts
import { query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    // Resume table is single-document, get first entry
    return await ctx.db.query("resume").first();
  },
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| getServerSideProps | async Server Components | Next.js 13 (2022) | Simpler syntax, better streaming, no props serialization |
| useEffect + fetch | Server Components + preloadQuery | React 18 (2022) | Server-side rendering, no loading flicker, better SEO |
| custom useSWR hooks | Convex useQuery + preloadQuery | Convex 1.8 (2024) | Real-time subscriptions, integrated with Next.js SSR |
| Tailwind config JS | @theme directive + CSS variables | Tailwind 4.0 (2024) | CSS-native, better dark mode, simpler customization |
| AnimatePresence for routes | FrozenRouter workaround | Next.js 13+ App Router | Page transitions still not officially supported, requires workarounds |
| Image loading="lazy" | next/image priority prop | Next.js 13+ | Automatic optimization, responsive srcset, better LCP |
| Manual 404 checks | notFound() function | Next.js 13 (2022) | Proper HTTP status, cleaner code, integrated error handling |

**Deprecated/outdated:**
- **getStaticProps/getServerSideProps:** Replaced by async Server Components and fetch with cache options
- **next/legacy/image:** Replaced by next/image with automatic optimization
- **Tailwind v3 JS config for dark mode:** v4 uses CSS @theme directive and data attributes
- **Manual React.lazy + Suspense:** Next.js now handles code splitting automatically for Client Components

## Open Questions

Things that couldn't be fully resolved:

1. **Framer Motion Page Transitions in App Router**
   - What we know: Official support still missing, community uses FrozenRouter pattern or next-transition-router library
   - What's unclear: Whether to implement page transitions for v1 or defer to future enhancement
   - Recommendation: Defer page transitions to post-v1. Focus on scroll reveals and hover animations which are well-supported. Page transitions require workarounds that may break with Next.js updates.

2. **Convex preloadQuery Data Consistency**
   - What we know: Multiple preloadQuery calls can return data from different database snapshots (not transactional)
   - What's unclear: Best pattern when homepage needs both featured projects AND resume highlights
   - Recommendation: Use single preloadQuery for featured projects (reactive), fetchQuery for resume highlights (static). Or create combined Convex query that returns both from same snapshot.

3. **Static vs Dynamic Rendering for Project Details**
   - What we know: generateStaticParams enables static rendering at build time
   - What's unclear: Whether to statically generate all projects or render on-demand (projects may be added via admin panel)
   - Recommendation: Use generateStaticParams for initial set, enable dynamicParams: true to allow new projects to render on-demand. Configure ISR with revalidate if needed.

4. **Framer Motion Bundle Size Impact**
   - What we know: Framer Motion is ~60KB gzipped, only needed in Client Components
   - What's unclear: Whether to lazy-load Framer Motion or include in main bundle
   - Recommendation: Include in main bundle for v1 (homepage featured projects need it immediately). Consider lazy loading for project detail pages if bundle analysis shows concern.

## Sources

### Primary (HIGH confidence)
- [Next.js App Router Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data) - Server Components, caching, streaming patterns
- [Next.js Metadata & OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) - generateMetadata, ImageResponse
- [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling) - notFound(), error boundaries
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) - "use client" boundaries
- [Convex React Integration](https://docs.convex.dev/client/react) - useQuery, useMutation, useAction hooks
- [Convex Next.js Server Rendering](https://docs.convex.dev/client/nextjs/app-router/server-rendering) - preloadQuery, fetchQuery patterns
- [Convex Indexes](https://docs.convex.dev/database/reading-data/indexes/) - withIndex, compound indexes
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - Optimization, responsive images
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - Static generation for dynamic routes

### Secondary (MEDIUM confidence)
- [LogRocket: Framer Motion Scroll Animations](https://blog.logrocket.com/react-scroll-animations-framer-motion/) - whileInView patterns
- [Maxime Heckel: Advanced Framer Motion Patterns](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/) - Variants, orchestration
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) - v4 @theme directive
- [Medium: Tailwind v4 Themes](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20429) - CSS variables approach
- [Dev.to: Next.js Streaming Guide](https://dev.to/boopykiki/a-complete-nextjs-streaming-guide-loadingtsx-suspense-and-performance-9g9) - loading.tsx vs Suspense
- [Tailwindflex: Responsive Grid Examples](https://tailwindflex.com/@amit/responsive-card-grid) - Portfolio card layouts

### Tertiary (LOW confidence)
- [Medium: Next.js 15 Guide](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7) - General patterns (needs verification)
- [Medium: React Server Components](https://medium.com/@123ajaybisht/react-server-components-vs-client-components-when-to-use-what-bcec46cacded) - High-level concepts
- Various community blog posts on Framer Motion + App Router page transitions (workaround-based, may break)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js/Convex docs, existing project already uses these
- Architecture: HIGH - Patterns verified with official documentation and current best practices
- Framer Motion animations: MEDIUM - Library well-documented, but App Router page transitions lack official support
- Pitfalls: HIGH - Based on official docs warnings and community-reported issues

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (30 days - stable ecosystem, Next.js/Convex APIs unlikely to change)
