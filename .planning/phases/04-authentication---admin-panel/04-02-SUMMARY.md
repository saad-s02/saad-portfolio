---
phase: 04-authentication---admin-panel
plan: 02
subsystem: database
tags: [convex, authentication, authorization, mutations, admin]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Convex schema and backend setup
  - phase: 04-01
    provides: WorkOS AuthKit integration (auth context for mutations)
provides:
  - Complete admin data access layer for projects, resume, changelog, contact submissions
  - Authentication verification at data boundary (defense-in-depth)
  - 11 admin operations (6 projects, 1 resume, 2 changelog, 2 contact submissions)
affects: [04-03-admin-ui, 04-04-admin-forms]

# Tech tracking
tech-stack:
  added: []
  patterns: [auth-verified-mutations, upsert-pattern-single-document, admin-query-pattern]

key-files:
  created:
    - convex/changelog.ts
    - convex/contactSubmissions.ts
  modified:
    - convex/projects.ts
    - convex/resume.ts

key-decisions:
  - "All admin mutations verify ctx.auth.getUserIdentity() for defense-in-depth security"
  - "Resume update mutation uses upsert pattern (patch if exists, insert if not)"
  - "Admin queries use listAll naming convention to distinguish from public queries"
  - "Quick toggle mutations (updateStatus, updateFeatured, updateVisibility) for common admin actions"

patterns-established:
  - "Auth verification pattern: const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error('Unauthorized');"
  - "Admin queries always verify auth, public queries don't"
  - "Separate admin queries from public queries (listAll vs listPublished)"
  - "Upsert pattern for single-document tables (resume)"

# Metrics
duration: 4min
completed: 2026-01-20
---

# Phase 4 Plan 2: Admin Mutations Summary

**Complete admin data access layer with auth verification in all mutations for projects, resume, changelog, and contact submissions**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-20T03:14:08Z
- **Completed:** 2026-01-20T03:17:59Z
- **Tasks:** 3
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments
- Projects table has 6 admin operations: listAll, create, update, remove, updateStatus, updateFeatured
- Resume table has update mutation with upsert logic (patch if exists, insert if not)
- Changelog table has listAll query and updateVisibility mutation
- Contact submissions table has listAll query and updateStatus mutation
- All 11 operations verify authentication with ctx.auth.getUserIdentity()

## Task Commits

Each task was committed atomically:

1. **Task 1: Add admin mutations to projects.ts** - `0195485` (feat)
2. **Task 2: Add admin mutation to resume.ts** - `f4833fb` (feat)
3. **Task 3: Add admin operations to changelog.ts and contactSubmissions.ts** - `a612099` (feat)

## Files Created/Modified
- `convex/projects.ts` - Added 6 admin operations (listAll query, create/update/remove mutations, updateStatus/updateFeatured toggles)
- `convex/resume.ts` - Added update mutation with upsert logic for single-document table
- `convex/changelog.ts` - Created with listAll query and updateVisibility mutation
- `convex/contactSubmissions.ts` - Created with listAll query and updateStatus mutation

## Decisions Made

**1. Defense-in-depth authentication verification**
- All admin mutations verify `ctx.auth.getUserIdentity()` at the data access layer
- Complements middleware protection (CVE-2025-29927 bypass mitigation)
- Unauthorized requests throw "Unauthorized" error

**2. Resume upsert pattern**
- Resume table is single-document, needs upsert behavior
- Check if document exists with `.first()`
- Patch existing document or insert new one
- Prevents duplicate resume documents

**3. Admin query naming convention**
- Use `listAll` to distinguish from public queries (listPublished, listFeatured)
- Makes it clear which queries return sensitive data (drafts, archived)
- Consistent pattern across all tables

**4. Quick toggle mutations**
- Separate mutations for common admin actions (updateStatus, updateFeatured, updateVisibility)
- Enables optimistic UI updates in admin panel
- Reduces payload size vs full update mutation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required. Authentication context from 04-01 (WorkOS AuthKit) will be used by these mutations.

## Next Phase Readiness

**Ready for:**
- Plan 04-03: Admin UI layout and navigation
- Plan 04-04: Admin forms (can now call these mutations)

**Provides:**
- Complete CRUD operations for all admin content
- Authentication enforcement at data boundary
- Quick toggle mutations for optimistic UI updates

**Notes:**
- Mutations expect authentication context from WorkOS AuthKit (04-01)
- Email allowlist enforcement will be added in future plan if needed
- Currently verifies identity exists, can add isAdmin claim check later

---
*Phase: 04-authentication---admin-panel*
*Completed: 2026-01-20*
