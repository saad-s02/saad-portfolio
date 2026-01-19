---
phase: 02-public-content-pages
plan: 01
subsystem: data-layer
tags: [convex, framer-motion, queries, animations, indexes]

# Dependency graph
requires:
  - phase: 01-02
    provides: Convex backend with schema and indexes
provides:
  - Convex query functions for projects (listPublished, listFeatured, getBySlug)
  - Convex query function for resume (get)
  - Framer Motion library for animations
affects: [02-02-home, 02-03-about, 02-04-resume, 02-05-projects, 02-06-stack]

# Tech tracking
tech-stack:
  added: [framer-motion@12.27.0]
  patterns: [Convex query with withIndex for efficient filtering, Single-document table query pattern]

key-files:
  created:
    - convex/projects.ts
    - convex/resume.ts
  modified:
    - package.json
    - package-lock.json
    - convex/_generated/api.d.ts

key-decisions:
  - "All project queries use withIndex() for efficient filtering (by_status, by_featured, by_slug)"
  - "Featured projects limited to top 3 using .take(3) for homepage display"
  - "Resume query uses simple .first() pattern since table has single document"
  - "Framer Motion 12.27.0 selected for scroll reveals and hover animations"

patterns-established:
  - "Query pattern: withIndex() for status filtering instead of .filter() to avoid table scans"
  - "Query pattern: Compound index by_featured enables filtering both featured=true AND status=published"
  - "Query pattern: Single-document tables use .first() without indexes"

# Metrics
duration: 3min
completed: 2026-01-19
---

# Phase 2 Plan 1: Convex Queries & Framer Motion Setup Summary

**Convex query functions for projects and resume data with index-optimized filtering, plus Framer Motion library ready for page animations**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-19 05:39:49 UTC
- **Completed:** 2026-01-19 05:42:27 UTC
- **Tasks:** 3/3 (all auto)
- **Files modified:** 4

## Accomplishments
- Framer Motion 12.27.0 installed for declarative animations
- Created 3 Convex query functions for projects (listPublished, listFeatured, getBySlug)
- Created 1 Convex query function for resume (get)
- All queries deployed successfully to Convex dev environment
- TypeScript compilation verified with no errors
- All queries use withIndex() for efficient database filtering

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Framer Motion for page animations** - `612c8ab` (chore)
   - Installed framer-motion@12.27.0 dependency
   - Updated package.json and package-lock.json
   - Verified installation with npm list

2. **Task 2: Create Convex query functions for projects** - `45cea62` (feat)
   - Created convex/projects.ts with 3 query functions
   - listPublished: uses by_status index for published-only filtering
   - listFeatured: uses by_featured compound index for featured+published filtering, limited to 3 results
   - getBySlug: uses by_slug index for O(1) slug lookups
   - Updated convex/_generated/api.d.ts with new API types

3. **Task 3: Create Convex query function for resume** - `d58fb23` (included in CI fix commit)
   - Created convex/resume.ts with single query function
   - get: returns first document from resume table (single-document pattern)
   - Updated convex/_generated/api.d.ts with new API types

## Files Created/Modified

### Created
- `convex/projects.ts` - 3 query functions using index-optimized patterns
- `convex/resume.ts` - Single-document query pattern

### Modified
- `package.json` - Added framer-motion@12.27.0
- `package-lock.json` - Updated dependency tree
- `convex/_generated/api.d.ts` - Auto-generated API types for new queries

## Decisions Made

**1. All project queries use withIndex() for efficient filtering**
- Rationale: Research confirmed that .filter() scans entire table while .withIndex() uses database indexes defined in schema. Critical for performance with 100+ projects.
- Impact: Queries will remain fast even as project count grows. Pattern established for all future Convex queries.

**2. Featured projects query limited to top 3 with .take(3)**
- Rationale: Home page only displays 3 featured projects. Using .take(3) limits database results instead of fetching all and slicing client-side.
- Impact: Reduces data transfer and improves home page performance.

**3. Resume uses simple .first() without index**
- Rationale: Resume table is single-document (only one resume exists). No index needed for single-document queries.
- Impact: Simpler query pattern. Establishes precedent for other single-document tables (if added).

**4. Framer Motion 12.27.0 for animations**
- Rationale: Research confirmed Framer Motion as industry standard for React animations with excellent App Router support. Version 12.27.0 is latest stable with whileInView support for scroll reveals.
- Impact: Enables declarative animations throughout Phase 2 pages. Sets foundation for Design & Animations phase (Phase 5).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Task 3 completed in intermediate commit**
- **Found during:** Task 3 execution
- **Issue:** convex/resume.ts was already committed in commit d58fb23 ("Fix ci pipeline") before my Task 3 commit
- **Fix:** Verified existing file matches plan specification exactly, documented as deviation
- **Files affected:** convex/resume.ts
- **Commit:** d58fb23 (not created by this execution)
- **Impact:** Task 3 effectively complete, but not in atomic commit as planned. No functionality difference.

## Issues Encountered

**1. Intermediate commit included Task 3 work**
- Issue: Between Task 2 and Task 3, an external commit (d58fb23) was made that included convex/resume.ts
- Resolution: Verified the committed code matches plan specification. Documented as deviation rather than re-creating file.
- Impact: Task 3 atomic commit skipped, but functionality complete and correct.

## Convex Query API Reference

The following queries are now available via `api.projects.*` and `api.resume.*`:

### Projects Queries
```typescript
// List all published projects (for projects index page)
api.projects.listPublished()
// Returns: Project[] ordered by _creationTime desc

// Get top 3 featured published projects (for home page)
api.projects.listFeatured()
// Returns: Project[] (max 3) ordered by _creationTime desc

// Get single project by slug (for project detail pages)
api.projects.getBySlug({ slug: string })
// Returns: Project | null
```

### Resume Query
```typescript
// Get resume data (single document)
api.resume.get()
// Returns: Resume | null
```

### Index Usage Verification
- listPublished: Uses `by_status` index ["status"]
- listFeatured: Uses `by_featured` compound index ["featured", "status"]
- getBySlug: Uses `by_slug` index ["slug"]
- resume.get: No index (single document, .first() pattern)

## Next Phase Readiness

**Ready for Phase 2 continuation (Plans 02-02 through 02-06):**
- Framer Motion installed and ready for import in Client Components
- All data queries operational for home, resume, projects pages
- Index-optimized queries ensure fast performance
- TypeScript types auto-generated for type-safe query usage

**Phase 2 next plans can now:**
- Build Home page with FeaturedProjects component using api.projects.listFeatured
- Build Resume page with data from api.resume.get
- Build Projects index page using api.projects.listPublished
- Build Project detail pages using api.projects.getBySlug
- Add Framer Motion animations for scroll reveals and hover effects
- Use Next.js preloadQuery pattern for server-side rendering with client reactivity

**No blockers identified.**

---
*Phase: 02-public-content-pages*
*Completed: 2026-01-19*
