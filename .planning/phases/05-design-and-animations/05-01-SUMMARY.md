---
phase: 05-design-and-animations
plan: 01
subsystem: animations
tags: [framer-motion, animations, accessibility, scroll-reveal, page-transitions]

# Dependency graph
requires:
  - phase: 02-01
    provides: Framer Motion 12.27.0 installed and ProjectCard animation pattern
  - phase: 01-02
    provides: App Router layout structure (layout.tsx)
provides:
  - FadeIn scroll reveal wrapper with reduced motion support
  - SlideIn directional scroll reveal wrapper (4 directions)
  - PageTransition route-level animation wrapper
  - Global page transition via app/template.tsx
affects: [all-public-pages, all-admin-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Client component animation wrappers for server components
    - template.tsx for page transitions (not layout.tsx)
    - useReducedMotion hook for WCAG 2.1 accessibility
    - GPU-only animations (transform/opacity)
    - whileInView with Intersection Observer for scroll reveals

key-files:
  created:
    - components/animations/FadeIn.tsx
    - components/animations/SlideIn.tsx
    - components/animations/PageTransition.tsx
    - app/template.tsx
  modified: []

key-decisions:
  - "FadeIn and SlideIn are client components with useReducedMotion"
  - "Server components can import animation wrappers without 'use client' directive"
  - "template.tsx creates new instance on navigation (enables animation lifecycle)"
  - "layout.tsx would persist across routes (breaks animation)"
  - "Short duration (0.3s) for page transitions keeps navigation feeling fast"
  - "viewport.once prevents re-animation on scroll up (better performance)"
  - "margin: -100px triggers animation before element enters viewport"
  - "Moderate x/y values (20-30px) prevent janky mobile animations"

patterns-established:
  - "Animation wrappers: Client components that server components can compose with"
  - "Accessibility-first: All animations conditional on !shouldReduceMotion"
  - "Page transitions: template.tsx + PageTransition pattern"
  - "Scroll reveals: whileInView with once: true, margin: -100px"

# Metrics
duration: 6min
completed: 2026-01-24
---

# Phase 05 Plan 01: Animation Infrastructure Summary

**Reusable animation wrapper components (FadeIn, SlideIn, PageTransition) with accessibility support and global page transitions**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-24T07:52:50Z
- **Completed:** 2026-01-24T07:58:23Z
- **Tasks:** 3 (all auto)
- **Files created:** 4

## Accomplishments
- Created three reusable animation wrapper components with accessibility support
- Established animation infrastructure for entire application
- Implemented global page transition system using template.tsx pattern
- All animations respect prefers-reduced-motion for WCAG 2.1 compliance

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FadeIn scroll reveal wrapper** - `ab854f5` (feat)
2. **Task 2: Create SlideIn directional scroll reveal wrapper** - `0744417` (feat)
3. **Task 3: Create PageTransition wrapper and app/template.tsx** - `78f547b` (feat)

**Plan metadata:** (to be committed)

## Files Created/Modified

**Created:**
- `components/animations/FadeIn.tsx` - Scroll reveal wrapper with opacity: 0, y: 20 fade-in effect
- `components/animations/SlideIn.tsx` - Directional scroll reveal (left/right/up/down) with x/y offset
- `components/animations/PageTransition.tsx` - Route-level fade transition for navigation
- `app/template.tsx` - Global page transition wrapper using PageTransition component

## Decisions Made

### Client Component Wrappers for Server Components
**Decision:** Animation components are client components ("use client") that server components can import
**Rationale:** Framer Motion requires "use client" for motion hooks. Wrapper pattern prevents marking entire pages as client components, preserving SSR benefits.

### template.tsx for Page Transitions (Not layout.tsx)
**Decision:** Use template.tsx instead of layout.tsx for route-level animations
**Rationale:** template.tsx creates new instance on navigation, enabling animation lifecycle. layout.tsx persists across routes and breaks animation trigger.

### useReducedMotion for Accessibility
**Decision:** All animation components check useReducedMotion() hook and disable animations if true
**Rationale:** WCAG 2.1 compliance. Users with prefers-reduced-motion enabled see instant content (no animation), preventing vestibular disorders/motion sickness.

### Short Duration for Page Transitions
**Decision:** Page transitions use 0.3s duration, scroll reveals use 0.5s
**Rationale:** Page transitions should feel fast, not cinematic. Frequent navigation with long animations feels sluggish. Scroll reveals can be slightly longer as they're one-time events.

### viewport.once Prevents Re-animation
**Decision:** All scroll reveal components use viewport={{ once: true }}
**Rationale:** Better performance. Content doesn't re-animate when scrolling up/down repeatedly. Animation serves to introduce content, not distract from it.

### Moderate Animation Values for Mobile Performance
**Decision:** x/y offsets limited to 20-30px, not 50-100px
**Rationale:** Large animation values cause janky performance on mobile devices with limited GPU. Subtle animations feel smoother on low-end devices.

## Deviations from Plan

None - plan executed exactly as written.

All animation components implemented according to specification:
- FadeIn with opacity/y fade-in effect
- SlideIn with 4-direction support
- PageTransition for route-level animations
- template.tsx wired to PageTransition globally

## Issues Encountered

None. All tasks completed successfully on first attempt.

- TypeScript compilation passed for all components
- ESLint validation passed with no errors
- Dev server started successfully with template.tsx
- Animation components export correctly for import by server components

## Verification Results

### Automated Verification
✓ TypeScript compilation passed (npx tsc --noEmit)
✓ ESLint validation passed (npm run lint)
✓ Dev server started successfully
✓ template.tsx script loaded in HTML output
✓ All animation components created in components/animations/ directory

### Component Exports Verified
✓ FadeIn exports successfully with props: children, delay
✓ SlideIn exports successfully with props: children, direction, delay
✓ PageTransition exports successfully with props: children
✓ Template exports default function with children prop

### Accessibility Verification
✓ All components use useReducedMotion() hook
✓ Conditional animation state: shouldReduceMotion ? {} : { animation }
✓ Users with prefers-reduced-motion enabled will see no animations

## Next Phase Readiness

### What's Ready
- **Animation infrastructure complete:** All reusable wrappers created
- **Page transitions active:** Global template.tsx wired to PageTransition
- **Accessibility support:** prefers-reduced-motion detection working
- **Server component compatibility:** Server pages can use animation wrappers

### Next Steps
**Remaining Phase 5 work:**
- Plan 05-02: Apply animations to existing pages (Home, About, Projects, Stack)
- Plan 05-03: Refine dark theme colors for WCAG AA contrast
- Plan 05-04: Add hover effects to interactive elements
- Plan 05-05: Polish responsive layouts and mobile UX

### No Blockers
All animation components working. Ready to apply to existing pages.

---

## Technical Notes

### Animation Component Pattern
All animation wrappers follow consistent pattern:
```typescript
"use client";
import { motion, useReducedMotion } from "framer-motion";

export function AnimationWrapper({ children, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { ...animation }}
      whileInView={shouldReduceMotion ? {} : { ...animation }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

### Server Component Usage
Server components can import and use animation wrappers:
```typescript
// app/about/page.tsx (Server Component)
import { FadeIn } from "@/components/animations/FadeIn";

export default function AboutPage() {
  return (
    <FadeIn>
      <h1>About Me</h1>
      <p>Content here...</p>
    </FadeIn>
  );
}
```

### template.tsx Lifecycle
template.tsx creates new instance on every route navigation:
1. User clicks link to new route
2. Next.js unmounts current template instance
3. Next.js mounts new template instance
4. PageTransition triggers initial → animate transition
5. Page content fades in smoothly

### Performance Characteristics
- **whileInView:** Uses Intersection Observer (off main thread, 0.5kb)
- **viewport.once:** Prevents repeated animations (reduces GPU work)
- **margin: -100px:** Pre-triggers animation for perceived faster reveal
- **transform/opacity only:** GPU-accelerated properties (60fps)
- **Short durations:** 0.3-0.5s prevents animation fatigue

---

*Phase: 05-design-and-animations*
*Completed: 2026-01-24*
