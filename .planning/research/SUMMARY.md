# Research Summary: Personal Portfolio Website

**Domain:** Personal portfolio with admin panel and automation showcase
**Researched:** 2026-01-18
**Overall confidence:** HIGH (core stack), MEDIUM (supporting features)

## Executive Summary

The standard 2025-2026 stack for modern personal portfolio websites centers on **Next.js 16 App Router** with **Server Components**, **Tailwind CSS v4** for styling, and **Framer Motion** for premium animations. The key architectural insight is that most portfolio content should be server-rendered for performance and SEO, with client components reserved for interactive features (forms, animations, admin panels).

For this specific project, the differentiator is the **admin panel + automation workflow showcase**. This requires backend infrastructure (Convex provides reactive database + server functions) and authentication (WorkOS AuthKit with email allowlist). The automation story (Issue → Claude PR → Review → Merge → Deploy → Changelog) is the unique selling point that distinguishes this from generic portfolio templates.

**Critical success factors:**
1. **Mobile-first design** - 50%+ of recruiters view portfolios on phones
2. **Performance budget** - Dark animations must be GPU-accelerated (transform/opacity only)
3. **Security in depth** - Auth checks in both middleware AND Convex mutations
4. **Build order discipline** - Public pages before admin panel (content before tools)

The tech stack is **well-established and production-proven** for portfolio-scale projects. The main risks are around **custom automation** (preventing infinite changelog loops), **Framer Motion performance** (avoiding jank on mid-range devices), and **contact form spam** (multi-layer protection required).

## Key Findings

**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4 + Framer Motion + Convex + WorkOS + Vercel

**Architecture:** Server Component-first with client islands for interactivity. Middleware-based auth protection. Convex provides both database and API layer (no REST routes needed).

**Critical pitfall:** Infinite changelog loop (bot commits triggering automation repeatedly). Prevention: skip markers in commit messages, check commit author before running workflow.

## Implications for Roadmap

Based on research, suggested phase structure:

### 1. **Foundation (Week 1: 3-5 days)**
**Rationale:** Can't build anything without Next.js scaffold + Convex schema

**Addresses:**
- Next.js 16 App Router setup with TypeScript
- Tailwind CSS v4 configuration (dark theme defaults)
- Convex initialization + schema definition (projects, resume, contacts, changelog tables)
- Basic layout components (header, footer)

**Avoids:**
- **Pitfall:** Starting admin before public pages (build foundation for public content first)
- **Pitfall:** Poor dark mode contrast (set accessible color palette in tailwind.config from day 1)

### 2. **Public Content Pages (Week 1-2: 5-7 days)**
**Rationale:** Core value proposition - recruiters need to see portfolio content

**Addresses:**
- Home page (hero, highlights, featured projects)
- About page (narrative, strengths)
- Projects index + detail pages
- Resume page (web-native from Convex data)
- Basic Convex queries (published projects only)

**Avoids:**
- **Pitfall:** Building admin before having public pages (content visible to users first)
- **Pitfall:** Hydration mismatches (use Server Components, avoid browser APIs in SSR)
- **Pitfall:** Mobile responsiveness theater (test on real devices, 44px touch targets)

**Research flag:** Standard Next.js patterns, unlikely to need deeper research

### 3. **Contact Form (Week 2: 1-2 days)**
**Rationale:** Quick win, completes public user journey

**Addresses:**
- Contact form with react-hook-form + zod validation
- Convex mutation for storage
- Multi-layer spam protection (honeypot + rate limit + time trap)

**Avoids:**
- **CRITICAL Pitfall:** Contact form spam apocalypse (implement all protection layers day 1)
- **Pitfall:** No loading states (disable submit button during processing)

**Research flag:** Standard form patterns, no additional research needed

### 4. **Auth + Admin Panel (Week 2-3: 5-7 days)**
**Rationale:** Enables content management, builds on existing public pages

**Addresses:**
- WorkOS AuthKit integration
- Auth middleware (protect /admin/* routes)
- Admin layout + navigation
- Project CRUD (create, edit, delete, draft/publish, toggle featured)
- Resume editor (structured data)

**Avoids:**
- **CRITICAL Pitfall:** Admin panel security theater (auth checks in BOTH middleware AND Convex mutations)
- **Pitfall:** Middleware not matching routes (use `matcher: ['/admin/:path*']`)
- **Pitfall:** Hardcoding allowlist emails (store in Convex or env vars)
- **Pitfall:** No breadcrumbs in admin (add navigation context)

**Research flag:** May need deeper WorkOS research for email allowlist implementation details

### 5. **Animations + Polish (Week 3: 3-4 days)**
**Rationale:** Elevates perceived quality, differentiates from templates

**Addresses:**
- Framer Motion page transitions
- Scroll-triggered reveals
- Hover micro-interactions
- Dark theme refinement

**Avoids:**
- **CRITICAL Pitfall:** Animation performance death spiral (GPU-only properties, test on mid-range Android)
- **Pitfall:** Over-animating (subtle Apple/Linear-style, not flashy)

**Research flag:** Standard Framer Motion patterns, but performance testing critical

### 6. **Automation Layer (Week 4: 5-7 days)**
**Rationale:** Key differentiator, showcases engineering enablement skills

**Addresses:**
- Claude slash commands (`.claude/commands/spec`, `/implement`, `/review`, `/release-note`)
- GitHub Actions for Claude reviewer bot (APPROVE/REQUEST_CHANGES verdict)
- Changelog automation (on PR merge to main)
- Auto-labeling for issues/PRs

**Avoids:**
- **CRITICAL Pitfall:** Infinite changelog loop (skip markers, check commit author, test on feature branch first)
- **Pitfall:** Bot commits revealing secrets (audit commit messages)

**Research flag:** Likely needs research on GitHub Actions + Claude slash command patterns, loop prevention strategies

### 7. **Stack/Automation Page (Week 4: 2-3 days)**
**Rationale:** Showcases automation workflow, depends on automation being live

**Addresses:**
- Architecture diagrams (Next.js ↔ Convex ↔ WorkOS ↔ Vercel)
- Automation pipeline diagram (Issue → Claude → PR → Review → CI → Merge → Deploy)
- Evidence widgets (latest deployment, CI badges, last Claude approval)
- Live changelog display

**Avoids:**
- **Pitfall:** Static content only (include live data from GitHub API and Convex)

**Research flag:** May need GitHub API research for evidence widgets

### 8. **SEO + Hardening (Week 5: 3-5 days)**
**Rationale:** Production readiness, discoverability

**Addresses:**
- Metadata API (title, description, OpenGraph for all pages)
- sitemap.xml + robots.txt
- Error boundaries
- 404 page
- Loading states and skeletons
- Performance audit (Lighthouse)

**Avoids:**
- **Pitfall:** Draft leakage via sitemap (filter published only)
- **Pitfall:** Missing alt text (screen reader compatibility)
- **Pitfall:** Poor error messages (friendly UX, not raw errors)

**Research flag:** Standard Next.js SEO patterns, no additional research needed

## Phase Ordering Rationale

**Why this order:**

1. **Foundation → Public Pages** - Can't show content without scaffold, can't attract visitors without content
2. **Public Pages → Contact Form** - Complete the public user journey before building admin tools
3. **Contact Form → Admin Panel** - Validate public site works before building management layer
4. **Admin Panel → Animations** - Functional first, polish second
5. **Animations → Automation** - User-facing complete before behind-the-scenes workflow
6. **Automation → Stack Page** - Can't showcase automation before it exists
7. **Stack Page → SEO** - Content complete before optimization pass

**Critical dependencies:**
- **Foundation blocks everything** (can't build without Next.js + Convex)
- **Auth blocks admin panel** (can't manage content without auth)
- **Automation blocks Stack page** (can't show evidence of non-existent automation)

**Parallelization opportunities:**
- Animations can be built in parallel with automation (independent workstreams)
- SEO metadata can be added as pages are built (don't wait for phase 8)

## Research Flags for Phases

| Phase | Research Needed? | Confidence | Reason |
|-------|------------------|------------|--------|
| **Phase 1: Foundation** | No | HIGH | Standard Next.js + Convex setup, well-documented |
| **Phase 2: Public Pages** | No | HIGH | Server Components + Convex queries, established patterns |
| **Phase 3: Contact Form** | No | HIGH | Standard form + spam protection patterns |
| **Phase 4: Auth + Admin** | Maybe | MEDIUM | WorkOS email allowlist implementation may need verification |
| **Phase 5: Animations** | No | HIGH | Framer Motion patterns known, but performance testing critical |
| **Phase 6: Automation** | Yes | MEDIUM | GitHub Actions + Claude integration, loop prevention strategies |
| **Phase 7: Stack Page** | Maybe | MEDIUM | GitHub API for evidence widgets may need research |
| **Phase 8: SEO + Hardening** | No | HIGH | Standard Next.js metadata API patterns |

**Recommendation:** Schedule deeper research for:
- **Phase 4:** WorkOS AuthKit email allowlist configuration
- **Phase 6:** GitHub Actions changelog automation (preventing infinite loops)
- **Phase 7:** GitHub API for deployment status, PR metadata

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Next.js 16, React 19, Tailwind v4 verified via official docs (Jan 2026) |
| **Features** | MEDIUM | Table stakes understood, but specific 2026 trends not verified (no WebSearch) |
| **Architecture** | HIGH | Next.js App Router patterns verified, Convex/WorkOS based on training data |
| **Pitfalls** | HIGH | Next.js hydration, auth middleware, spam prevention are established patterns |

**Verified sources:**
- Next.js Documentation (v16.1.3 confirmed Jan 2026)
- React Documentation (v19.2 confirmed Jan 2026)
- Tailwind CSS Documentation (v4.1 confirmed Jan 2026)
- Vercel Documentation (hosting features confirmed Jan 2026)

**Unverified (training data):**
- Convex API specifics (schema syntax, mutation patterns)
- WorkOS AuthKit API (email allowlist, middleware config)
- Framer Motion version/API (assumed v11.x based on training)
- Supporting library versions (react-hook-form, zod, etc.)

**Recommendation:** Before implementation, verify:
1. Convex schema API at docs.convex.dev
2. WorkOS AuthKit patterns at workos.com/docs
3. Framer Motion current version at framer.com/motion
4. Check npm for latest versions of supporting libraries

## Gaps to Address

### Areas where research was inconclusive:

1. **Convex rate limiting patterns** - Training data suggests storing timestamps and filtering, but optimal pattern unclear. Check Convex docs for built-in rate limiting features.

2. **WorkOS email allowlist UI** - Unclear if allowlist is configured in WorkOS dashboard vs application code. Verify current best practice.

3. **Framer Motion performance benchmarks** - No quantitative data on "what's too much animation." Recommendation: build conservatively, test on mid-range Android ($300-400 range device).

4. **GitHub Actions Claude integration** - Assumed slash commands work via GitHub Actions, but specific implementation pattern unclear. May need Claude Code documentation.

5. **Changelog automation loop prevention** - Multiple strategies mentioned (skip markers, author checks, file change detection), but best practice unclear. Test all strategies on feature branch.

### Topics needing phase-specific research later:

- **Phase 4:** WorkOS AuthKit + Convex auth context integration (how to pass auth to Convex queries/mutations)
- **Phase 6:** Claude Code slash commands syntax and GitHub Actions integration patterns
- **Phase 7:** GitHub API rate limits and authentication for fetching PR/deployment data
- **Phase 6-7:** Preventing infinite loops in changelog automation (circuit breaker patterns)

### Known unknowns:

- Current trends in portfolio design aesthetics for 2026 (dark mode prevalence, animation styles)
- Actual spam bot sophistication in 2026 (honeypot effectiveness may have changed)
- Convex pricing tiers and storage limits (affects image storage strategy)
- WorkOS pricing and email allowlist limits (affects multi-admin plans)

## Next Steps for Implementation

### Before starting Phase 1:

1. **Verify library versions:**
   - Run `npm info next version` to confirm Next.js 16.x is stable
   - Check docs.convex.dev for current schema API
   - Review workos.com/docs for AuthKit setup

2. **Set up accounts:**
   - Create Convex account and project
   - Create WorkOS account and configure AuthKit application
   - Create Vercel account and connect to GitHub repo

3. **Environment setup:**
   - Initialize Next.js project: `npx create-next-app@latest`
   - Initialize Convex: `npx convex dev`
   - Configure WorkOS environment variables

### During implementation:

1. **Test on real devices frequently** - Don't wait until Phase 8 to discover mobile issues
2. **Commit atomic changes** - Each feature should be independently testable
3. **Deploy to staging early** - Catch production-only issues (env vars, build failures)
4. **Monitor performance from Phase 2** - Run Lighthouse on every page as built
5. **Security audit in Phase 4** - Test auth protection with Postman/curl before moving on

### Key decision points:

- **Phase 4:** Choose Convex table vs environment variables for email allowlist
- **Phase 5:** Determine animation budget (max complexity) based on mid-range device testing
- **Phase 6:** Choose changelog storage (Convex table vs CHANGELOG.md file)
- **Phase 7:** Decide on evidence widget data freshness (real-time vs cached)

## Final Recommendations

### Do this:

✅ **Start with Next.js App Router defaults** - Server Components, built-in optimizations, metadata API
✅ **Use Convex for everything backend** - Don't build REST API, don't use Prisma + separate DB
✅ **Test mobile on real devices** - Borrow iPhone and Android, test touch targets and performance
✅ **Build public pages first** - Content before tools, launch before perfecting
✅ **GPU-only animations** - Transform and opacity only, test on mid-range Android
✅ **Multi-layer spam protection** - Honeypot + rate limit + time trap from day 1
✅ **Auth in depth** - Check in both middleware AND Convex mutations
✅ **Prevent changelog loops** - Skip markers + author checks + file detection

### Don't do this:

❌ **Don't build admin before public pages** - Recruiters need content, not your CMS
❌ **Don't animate layout properties** - Width/height/margin cause jank, only transform/opacity
❌ **Don't trust client-side auth alone** - Always verify in backend
❌ **Don't hardcode allowlist emails** - Use database or environment variables
❌ **Don't skip spam protection** - You WILL get overwhelmed immediately
❌ **Don't test only on your dev machine** - Borrow real devices, test performance
❌ **Don't expose client names** - Anonymize everything, check NDAs

### When in doubt:

- **Performance:** Use Next.js defaults, optimize only when Lighthouse reports issues
- **Architecture:** Server Component unless you need interactivity
- **Security:** Check auth in backend, never trust client
- **Design:** Subtle animations > flashy effects, high contrast > aesthetic grays
- **Scope:** Launch with less, iterate based on feedback

## Sources

This research synthesizes findings from:

### Verified (HIGH confidence):
- Next.js Documentation - v16.1.3, App Router, Server Components (verified Jan 2026)
- React Documentation - v19.2, React Server Components (verified Jan 2026)
- Tailwind CSS Documentation - v4.1, dark mode, zero-runtime (verified Jan 2026)
- Vercel Documentation - hosting, preview deployments, environment variables (verified Jan 2026)

### Training Data (MEDIUM confidence):
- Convex architecture patterns (as of Jan 2025)
- WorkOS AuthKit integration (as of Jan 2025)
- Framer Motion API (as of Jan 2025)
- Portfolio website best practices (as of Jan 2025)
- Next.js hydration patterns (as of Jan 2025)
- Form spam protection strategies (as of Jan 2025)

### Project Context (HIGH confidence):
- automated-portfolio-prd.md requirements
- CLAUDE.md project specifications
- Technology stack constraints

### Gaps:
- Web search unavailable (could not verify 2026 trends, current blog posts, recent releases)
- Context7 unavailable (could not query library-specific docs)
- No access to Convex/WorkOS current documentation

**Overall assessment:** Research is sufficient to begin implementation with confidence. High-risk areas (auth security, changelog loops, spam protection) have multiple prevention strategies documented. Main unknowns are around specific API details (WorkOS allowlist config, Convex rate limiting) that can be verified during implementation.
