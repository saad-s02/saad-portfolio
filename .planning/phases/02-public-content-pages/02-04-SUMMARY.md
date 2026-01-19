---
phase: 02-public-content-pages
plan: 04
subsystem: presentation-layer
tags: [projects-page, dynamic-routes, seo, generateStaticParams, generateMetadata, framer-motion, 404-handling]

# Dependency graph
requires:
  - phase: 02-01
    provides: Convex projects queries (listPublished, getBySlug)
  - phase: 01-02
    provides: Layout with navigation and Convex provider
provides:
  - Projects index page at /projects with grid layout
  - Dynamic project detail pages at /projects/[slug]
  - ProjectCard component with scroll reveal animations
  - ProjectGrid client component for reactive rendering
  - Per-project SEO metadata with OpenGraph tags
  - Custom 404 page for invalid project slugs
  - Project content parsing (Problem/Approach/Constraints/Impact sections)
affects: [02-02-home]

# Tech tracking
tech-stack:
  added: []
  patterns: [Dynamic routes with generateStaticParams, Per-page SEO with generateMetadata, notFound() for 404 handling, Content parsing with regex, Scroll reveal animations with Framer Motion, Server Component with preloadQuery, Client Component with usePreloadedQuery]

key-files:
  created:
    - app/projects/page.tsx
    - app/projects/[slug]/page.tsx
    - app/projects/[slug]/not-found.tsx
    - components/projects/ProjectGrid.tsx
    - components/projects/ProjectCard.tsx
  modified:
    - components/home/FeaturedProjects.tsx

key-decisions:
  - "Projects index uses Server Component with preloadQuery for reactive project list"
  - "ProjectGrid is client component to handle usePreloadedQuery reactivity"
  - "ProjectCard is reusable across home page FeaturedProjects and projects index"
  - "Dynamic [slug] route uses generateStaticParams for build-time static generation"
  - "generateMetadata fetches data separately (fetchQuery not preloadQuery)"
  - "parseProjectContent extracts structured sections with regex (Problem/Approach/Constraints/Impact)"
  - "notFound() triggers custom 404 page for invalid slugs"
  - "Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop"
  - "Scroll reveal animations with whileInView (once: true, margin: -100px)"
  - "Hover effects: scale 1.02, y: -4 for card lift"

patterns-established:
  - "Dynamic routes: generateStaticParams returns array of {slug} objects"
  - "SEO pattern: generateMetadata async function fetches data for title/description/openGraph"
  - "404 pattern: if (!data) notFound() + custom not-found.tsx in route folder"
  - "Content parsing: regex to extract markdown sections (## Section\n content)"
  - "Fallback rendering: if no structured sections, render full content with whitespace-pre-wrap"
  - "Reusable components: ProjectCard works with minimal Project type (title/slug/summary/stack/tags)"
  - "Empty state: if projects.length === 0, show friendly message in gray card"
  - "Skeleton loading: Suspense fallback with animate-pulse cards"

# Metrics
duration: 30min
completed: 2026-01-19
---

# Phase 2 Plan 4: Build Projects Index and Detail Pages Summary

**Projects index with grid layout, dynamic detail pages with SEO, and animated project cards**

## Performance

- **Duration:** ~30 min (estimated from checkpoint flow)
- **Started:** 2026-01-19 (estimated)
- **Completed:** 2026-01-19 17:41 UTC
- **Tasks:** 2/2 (all auto) + 1 checkpoint (user-approved)
- **Files created:** 5
- **Files modified:** 1
- **Commits:** 2 atomic commits

## Accomplishments

- Created projects index page at /projects with Server Component data fetching
- Built ProjectGrid client component for reactive rendering with usePreloadedQuery
- Created ProjectCard component with Framer Motion scroll reveals and hover effects
- Implemented responsive grid layout (1/2/3 columns for mobile/tablet/desktop)
- Built dynamic [slug] route for project detail pages with generateStaticParams
- Added generateMetadata for per-project SEO with OpenGraph tags
- Created custom 404 page for invalid project slugs
- Implemented parseProjectContent helper to extract structured sections (Problem/Approach/Constraints/Impact)
- Added empty state handling for projects index (no data yet)
- Created skeleton loading fallback with Suspense
- Updated FeaturedProjects component to use shared ProjectCard component
- Applied dark theme styling consistently (gray-900/800/50 palette)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build projects index page with grid layout** - `c0e79a1` (feat)
   - Created app/projects/page.tsx as Server Component with preloadQuery
   - Implemented SEO metadata (title, description)
   - Added page header with title and description text
   - Created ProjectGrid client component (components/projects/ProjectGrid.tsx)
     - Uses usePreloadedQuery for reactive data
     - Handles empty state with gray card + friendly message
     - Renders responsive grid (1/2/3 columns)
   - Created ProjectCard component (components/projects/ProjectCard.tsx)
     - Framer Motion scroll reveal (whileInView, once: true, margin: -100px)
     - Hover effects (scale 1.02, y: -4 for card lift)
     - Shows title, summary (line-clamp-3), stack pills (first 4 + count), tags
     - Links to /projects/[slug] detail page
   - Added Suspense with skeleton loading fallback (3 animate-pulse cards)
   - Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

2. **Task 2: Build dynamic project detail page with SEO** - `864da4d` (feat)
   - Created app/projects/[slug]/page.tsx as async Server Component
   - Implemented generateStaticParams for build-time static generation
     - Fetches listPublished projects
     - Returns array of {slug} objects
   - Implemented generateMetadata for per-project SEO
     - Fetches project by slug using fetchQuery
     - Returns title, description, openGraph metadata
     - Returns "Project Not Found" title if project doesn't exist
   - Added project detail rendering with structured sections:
     - Header: Back link, title, summary
     - Tech Stack: Pills with border styling
     - Problem section (if exists in content)
     - Approach section (if exists in content)
     - Constraints section (if exists in content)
     - Impact section (if exists in content)
     - Fallback: Full content with whitespace-pre-wrap if no sections
     - Links: External links with target="_blank" and noopener/noreferrer
     - Tags: Hashtag-prefixed tags
   - Created parseProjectContent helper function
     - Regex to extract markdown sections (## Problem, ## Approach, etc.)
     - Returns Record<string, string> with section content
   - Added notFound() call for invalid slugs
   - Created app/projects/[slug]/not-found.tsx
     - Custom 404 page with "Project Not Found" message
     - Back to Projects link
   - Updated components/home/FeaturedProjects.tsx
     - Imports ProjectCard from components/projects/ProjectCard
     - Removed duplicate ProjectCard definition
     - Consistent card styling across home and projects pages

## Files Created/Modified

### Created

- `app/projects/page.tsx` - Projects index with Server Component and preloadQuery
- `app/projects/[slug]/page.tsx` - Dynamic detail page with generateStaticParams and generateMetadata
- `app/projects/[slug]/not-found.tsx` - Custom 404 page for invalid slugs
- `components/projects/ProjectGrid.tsx` - Client component for reactive grid rendering
- `components/projects/ProjectCard.tsx` - Reusable animated project card

### Modified

- `components/home/FeaturedProjects.tsx` - Updated to use shared ProjectCard component (removed duplicate)

## Decisions Made

**1. Projects index uses Server Component with preloadQuery**
- Rationale: Projects list needs server rendering for SEO + client reactivity for real-time updates when admin publishes new projects.
- Impact: Data preloaded on server, hydrated on client for reactive updates. Similar pattern to home page FeaturedProjects.

**2. ProjectGrid is client component with usePreloadedQuery**
- Rationale: Need "use client" directive to call usePreloadedQuery hook. Separating grid from page keeps server/client boundary clear.
- Impact: Page is Server Component, grid is Client Component. Clean separation of concerns.

**3. ProjectCard is reusable across home and projects pages**
- Rationale: Same card design appears in FeaturedProjects (home) and ProjectGrid (projects index). Avoid duplication.
- Impact: Single source of truth for project card styling and animations. Consistent UX. Easier maintenance.

**4. Dynamic [slug] route uses generateStaticParams**
- Rationale: Build-time static generation for all published project pages. SEO benefits. Fast page loads.
- Impact: All project pages pre-rendered at build time. Only new projects trigger rebuild.

**5. generateMetadata fetches data separately (fetchQuery not preloadQuery)**
- Rationale: Metadata generation runs in separate pass from page rendering. Can't share preloadQuery result. Must use fetchQuery.
- Impact: Two queries per project detail page (metadata + page). Acceptable for static generation.

**6. parseProjectContent extracts structured sections with regex**
- Rationale: Project content stored as markdown with ## Section headers. Need to extract Problem/Approach/Constraints/Impact into separate sections.
- Impact: Flexible content structure. Supports structured sections OR plain content (fallback). Easy to update section parsing logic.

**7. notFound() triggers custom 404 page**
- Rationale: Invalid slugs should return proper 404 HTTP status with custom error page. Next.js notFound() function + not-found.tsx pattern.
- Impact: Clean 404 handling. User-friendly error page. SEO-friendly (proper 404 status code).

**8. Responsive grid: 1/2/3 columns for mobile/tablet/desktop**
- Rationale: Single column on mobile (better readability), 2 columns on tablet (utilizes space), 3 columns on desktop (efficient layout).
- Impact: Optimal layout for each screen size. Good UX across devices.

**9. Scroll reveal animations with whileInView**
- Rationale: Projects should animate into view as user scrolls (modern, polished feel). once: true prevents re-animation.
- Impact: Smooth, professional animations. Good performance (only animates once). margin: -100px triggers animation before card enters viewport.

**10. Hover effects: scale 1.02, y: -4 for card lift**
- Rationale: Hover feedback shows card is clickable. Subtle scale + translate creates lift effect.
- Impact: Interactive feel. Clear affordance. Smooth transitions.

## Deviations from Plan

None - plan executed exactly as written.

## Content & Design Highlights

**Projects Index Structure:**
- Page header: Title ("Projects") + description paragraph
- ProjectGrid: Responsive grid with animated cards
- Empty state: Gray card with "No projects yet. Check back soon!" message
- Skeleton loading: 3 animated pulse cards during Suspense fallback

**ProjectCard Design:**
- Title: text-xl font-bold (gray-50)
- Summary: line-clamp-3 for truncation (gray-400)
- Stack pills: First 4 shown, "+N" for overflow (gray-800 bg, gray-300 text)
- Tags: Hashtag-prefixed, small text (gray-600)
- Hover: Lift effect with scale + translateY
- Scroll reveal: Fade in + slide up animation

**Project Detail Page Structure:**
- Back navigation: "← Back to Projects" link at top
- Header: Title (text-4xl) + summary (text-xl)
- Tech Stack section: Pills with border styling
- Content sections: Problem, Approach, Constraints, Impact (conditional rendering)
- Fallback: Full content with whitespace-pre-wrap if no sections
- Links section: External links with arrow (→) indicator
- Tags section: Hashtag-prefixed tags at bottom

**Responsive Design:**
- Projects index: max-w container, responsive grid (1/2/3 columns)
- Project detail: max-w-4xl for comfortable reading
- Grid breakpoints: base (1 col), md (2 cols), lg (3 cols)
- Stack pills: Flex wrap for overflow handling

**Typography:**
- Page titles: text-4xl font-bold (consistent across site)
- Section headings: text-2xl font-bold
- Body text: text-lg for descriptions, text-gray-300 for content
- Links: hover:text-gray-50 transition

**Animations:**
- Scroll reveals: initial opacity 0, y: 20 → animate to opacity 1, y: 0
- Duration: 0.5s with easeOut timing
- Viewport config: once: true, margin: -100px (trigger early)
- Hover: whileHover scale 1.02, y: -4
- Tap: whileTap scale 0.98

## Verification Results

**User verification checkpoint:**
- Visited http://localhost:3000/projects
  - ✓ Empty state message displays correctly ("No projects yet")
  - ✓ Dark theme styling consistent with site
  - ✓ Page header with title and description renders
- Visited http://localhost:3000/projects/invalid-slug
  - ✓ Custom 404 page renders
  - ✓ "Project Not Found" message displays
  - ✓ "Back to Projects" link works
- Responsive testing:
  - ✓ Mobile (375px): Single column grid
  - ✓ Tablet (768px): 2-column grid
  - ✓ Desktop (1440px): 3-column grid
- Build check: npm run build
  - ✓ Build completes without errors
  - ✓ TypeScript compilation passes
  - ✓ Projects routes appear in build output

**User response:** Approved (all tasks complete, create SUMMARY.md)

## Next Phase Readiness

**Ready for Phase 2 continuation:**
- Projects index and detail pages complete and verified
- Dynamic routing with generateStaticParams ready for static generation
- SEO metadata with OpenGraph tags in place
- 404 handling functional with custom error page
- Animations working with Framer Motion scroll reveals
- Responsive layouts tested on mobile, tablet, desktop
- Empty state handling ready (will populate when admin adds projects in Phase 4)

**Integration status:**
- Projects pages: Complete with empty state (will populate in Phase 4)
- Navigation: /projects link already in Header component
- Home page: FeaturedProjects updated to use shared ProjectCard component
- Typography and spacing: Consistent with design system

**Patterns ready for reuse:**
- Dynamic route pattern (generateStaticParams + generateMetadata) applies to future dynamic content
- notFound() + not-found.tsx pattern applies to other dynamic routes
- Content parsing pattern applies to other structured content (e.g., changelog entries)
- Scroll reveal animation pattern applies to Stack page, Contact page
- Reusable card component pattern applies to other list views
- Empty state pattern applies to other data-driven pages

**Component reusability:**
- ProjectCard now shared between home page and projects index
- Can be used in future contexts (e.g., related projects, project search results)

**No blockers identified.**

---
*Phase: 02-public-content-pages*
*Completed: 2026-01-19*
