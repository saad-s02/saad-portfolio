---
phase: 06-seo-and-deployment
plan: 01
subsystem: seo
tags: [next.js, metadata, seo, sitemap, robots.txt, opengraph]

# Dependency graph
requires:
  - phase: 02-04
    provides: Project detail pages with generateStaticParams
  - phase: 01-02
    provides: App Router layout structure
provides:
  - Root layout metadata with OpenGraph and robots config
  - Metadata exports for all static pages (home, about, resume, projects, stack, contact)
  - Dynamic metadata generation for project detail pages
  - Dynamic sitemap.xml fetching published projects from Convex
  - robots.txt blocking admin routes from search indexing
affects: [all-public-pages, search-engines, social-media]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Next.js 16 Metadata API for static and dynamic pages
    - Dynamic sitemap generation with Convex fetchQuery
    - Middleware unauthenticatedPaths for SEO file access
    - OpenGraph and Twitter Card meta tags for social sharing
    - Canonical URLs for all pages

key-files:
  created:
    - app/sitemap.ts
    - app/robots.ts
  modified:
    - app/layout.tsx
    - app/page.tsx
    - app/about/page.tsx
    - app/resume/page.tsx
    - app/projects/page.tsx
    - app/projects/[slug]/page.tsx
    - app/stack/page.tsx
    - app/contact/page.tsx
    - proxy.ts

key-decisions:
  - "Root layout uses title template '%s | Portfolio' for consistent page titles"
  - "Home page uses title: null to inherit layout default"
  - "All metadata URLs use placeholder 'https://yourdomain.com' for production replacement"
  - "Project 404 pages return robots: { index: false }"
  - "Sitemap fetches projects at build time with lastModified from _creationTime"
  - "Middleware allows unauthenticated access to /robots.txt and /sitemap.xml"
  - "Dynamic routes use generateMetadata with Metadata return type"
  - "Static routes use export const metadata: Metadata pattern"

patterns-established:
  - "Static metadata: export const metadata: Metadata = {...}"
  - "Dynamic metadata: export async function generateMetadata(): Promise<Metadata>"
  - "Sitemap: MetadataRoute.Sitemap with static + dynamic entries"
  - "Robots: MetadataRoute.Robots with disallow rules"

# Metrics
duration: 8min
completed: 2026-01-24
---

# Phase 06 Plan 01: SEO Metadata & Sitemap Summary

**Comprehensive SEO metadata across all pages using Next.js Metadata API, dynamic sitemap from Convex, and robots.txt configuration**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-24T09:14:27Z
- **Completed:** 2026-01-24T09:22:39Z
- **Tasks:** 3 (all auto)
- **Files created:** 2
- **Files modified:** 9

## Accomplishments
- Added SEO metadata to all 7 public pages with unique titles and descriptions
- Enhanced root layout with OpenGraph, Twitter Card, and robots configuration
- Implemented dynamic metadata for project detail pages using generateMetadata
- Created dynamic sitemap.xml fetching all published projects from Convex
- Created robots.txt blocking admin/auth/api routes from search engine indexing
- Fixed middleware to allow search engine access to SEO files

## Task Commits

Each task was committed atomically:

1. **Task 1: Add metadata to root layout and static pages** - `1faf329` (feat)
2. **Task 2: Add dynamic metadata to project detail pages** - `07a1fca` (feat)
3. **Task 3: Create dynamic sitemap and robots.txt** - `232e905` (feat)

**Plan metadata:** (to be committed)

## Files Created/Modified

**Created:**
- `app/sitemap.ts` - Dynamic sitemap with static pages + Convex-fetched projects
- `app/robots.ts` - Search engine crawling rules with disallow paths

**Modified:**
- `app/layout.tsx` - Enhanced with OpenGraph, Twitter Card, and robots config
- `app/page.tsx` - Added metadata with canonical URL (title: null for layout default)
- `app/about/page.tsx` - Added metadata with description and OpenGraph tags
- `app/resume/page.tsx` - Added metadata with description and OpenGraph tags
- `app/projects/page.tsx` - Added metadata with description and OpenGraph tags
- `app/projects/[slug]/page.tsx` - Enhanced generateMetadata with canonical URL and robots config for 404s
- `app/stack/page.tsx` - Added metadata with description and OpenGraph tags
- `app/contact/page.tsx` - Added metadata with description and OpenGraph tags
- `proxy.ts` - Added /robots.txt and /sitemap.xml to unauthenticatedPaths

## Decisions Made

### Title Template Pattern
**Decision:** Root layout uses title template '%s | Portfolio' with default 'Portfolio'
**Rationale:** Creates consistent page titles like "About | Portfolio", "Projects | Portfolio". Home page uses null to show just "Portfolio". Reduces duplication across page metadata.

### Placeholder Domain for Production
**Decision:** All absolute URLs use 'https://yourdomain.com' placeholder
**Rationale:** Will be replaced with actual production domain during deployment. Makes metadata configuration environment-agnostic. Avoids hardcoding localhost or staging URLs.

### Dynamic Metadata for Project Pages
**Decision:** Use generateMetadata with Promise<Metadata> return type for [slug] routes
**Rationale:** Next.js 16 automatically memoizes fetchQuery calls - generateMetadata and page component share same data fetch. No duplicate queries. Enables dynamic per-project titles and descriptions.

### Project 404 SEO Blocking
**Decision:** generateMetadata returns robots: { index: false } for missing projects
**Rationale:** Prevents search engines from indexing 404 pages. Reduces crawl budget waste. Improves SEO quality signals.

### Sitemap Build-Time Generation
**Decision:** Sitemap fetches projects with fetchQuery at build time (or request time if dynamic)
**Rationale:** Search engines recrawl sitemaps periodically. Perfect freshness not required. Build-time generation reduces runtime overhead. Sitemap updates on each deployment.

### Middleware SEO File Access
**Decision:** Added /robots.txt and /sitemap.xml to unauthenticatedPaths in proxy.ts
**Rationale:** WorkOS middleware was redirecting all routes (including SEO files) to auth. Search engines need direct access to these files. Critical for discoverability.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed middleware blocking SEO file access**
- **Found during:** Task 3 verification
- **Issue:** WorkOS authkitMiddleware was redirecting /robots.txt and /sitemap.xml to authentication, blocking search engine access
- **Fix:** Added both paths to unauthenticatedPaths array in proxy.ts
- **Files modified:** proxy.ts
- **Commit:** 232e905 (included in Task 3 commit)
- **Rationale:** Without this fix, search engines cannot access critical SEO files. This is a bug preventing core functionality, not an enhancement.

## Issues Encountered

None. All tasks completed successfully with one critical bug fix for middleware configuration.

- TypeScript compilation passed for all metadata configurations
- Build succeeded with sitemap.xml and robots.txt in route list
- Dev server verification confirmed both files accessible at /sitemap.xml and /robots.txt
- Sitemap includes all 6 static pages with appropriate priorities (home: 1, projects: 0.9, about/resume: 0.8, stack: 0.7, contact: 0.5)
- Robots.txt blocks /admin/, /auth/, /api/ from indexing and references sitemap

## Verification Results

### Automated Verification
✓ Build completed without metadata errors
✓ TypeScript compilation passed
✓ Route list shows /robots.txt and /sitemap.xml
✓ Dev server accessible at localhost:3000
✓ robots.txt returns User-Agent, Allow, Disallow, Sitemap directives
✓ sitemap.xml returns valid XML with urlset structure

### Metadata Verification
✓ All 7 public pages have metadata exports
✓ Root layout has title template and OpenGraph config
✓ Home page uses title: null (inherits "Portfolio")
✓ All pages have unique descriptions
✓ All pages have OpenGraph title, description, type, url
✓ All pages have canonical URLs
✓ Project detail pages have generateMetadata function
✓ Project 404 pages return robots: { index: false }

### Sitemap Verification
✓ Sitemap includes 6 static pages with priorities and change frequencies
✓ Sitemap dynamically fetches published projects from Convex
✓ Each project entry has url, lastModified, changeFrequency, priority
✓ lastModified uses project._creationTime for accurate timestamps

### Robots.txt Verification
✓ User-Agent: * (targets all search engines)
✓ Allow: / (allows crawling homepage)
✓ Disallow: /admin/, /auth/, /api/ (blocks sensitive routes)
✓ Sitemap: https://yourdomain.com/sitemap.xml (references sitemap)

## Next Phase Readiness

### What's Ready
- **SEO metadata complete:** All pages have unique titles, descriptions, OpenGraph tags
- **Dynamic sitemap active:** Fetches published projects from Convex at build time
- **Search engine access configured:** Middleware allows /robots.txt and /sitemap.xml
- **Social sharing ready:** OpenGraph and Twitter Card tags on all pages
- **Canonical URLs set:** All pages have absolute canonical URLs

### Next Steps
**Remaining Phase 6 work:**
- Plan 06-02: Vercel deployment configuration and environment variables
- Plan 06-03: Production domain setup and metadata URL replacement

### No Blockers
All SEO requirements covered. Site is discoverable and shareable. Ready for deployment.

---

## Technical Notes

### Metadata API Patterns

**Static pages use const export:**
```typescript
export const metadata: Metadata = {
  title: "About",
  description: "...",
  openGraph: { ... },
  alternates: { canonical: "..." },
};
```

**Dynamic pages use async function:**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchQuery(...);
  return {
    title: `${data.title} | Projects`,
    description: data.summary,
    openGraph: { url: `https://yourdomain.com/...` },
    alternates: { canonical: `https://yourdomain.com/...` },
  };
}
```

### Sitemap Generation

Sitemap combines static and dynamic entries:
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [{ url: ..., priority: 1, changeFrequency: 'monthly' }];
  const projects = await fetchQuery(api.projects.listPublished);
  const projectPages = projects.map(p => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(p._creationTime),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...staticPages, ...projectPages];
}
```

### Next.js 16 Fetch Memoization

generateMetadata and page component share the same fetchQuery:
- Next.js automatically deduplicates identical fetch requests
- No performance penalty for calling fetchQuery in both places
- Both functions get the same data without double fetching

### Middleware Configuration for SEO

WorkOS middleware needs explicit unauthenticated paths:
```typescript
unauthenticatedPaths: [
  '/',
  '/about',
  // ... other public routes
  '/robots.txt',  // Critical for search engines
  '/sitemap.xml', // Critical for search engines
]
```

### Search Engine Crawling Priorities

Sitemap priorities guide search engine crawl budget allocation:
- **1.0:** Homepage (most important)
- **0.9:** Projects index (main content area)
- **0.8:** About, Resume (profile pages)
- **0.7:** Stack, Individual projects (supporting content)
- **0.5:** Contact (low-traffic utility page)

---

*Phase: 06-seo-and-deployment*
*Completed: 2026-01-24*
