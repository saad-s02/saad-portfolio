# Requirements: Automated Personal Portfolio Website

**Defined:** 2026-01-18
**Core Value:** Stack/Automation page demonstrating automated workflow is the key differentiator

## v1 Requirements

### Foundation
- [ ] **FOUND-01**: Next.js 16 App Router project with TypeScript configured
- [ ] **FOUND-02**: Tailwind CSS v4 installed with dark theme as default
- [ ] **FOUND-03**: Convex initialized with schema for projects, resume, changelog, contactSubmissions tables
- [ ] **FOUND-04**: Responsive layout system working on mobile and desktop breakpoints
- [ ] **FOUND-05**: Navigation header with Home, About, Resume, Projects, Stack, Contact links

### Home Page
- [ ] **HOME-01**: Hero section with name, role, and positioning statement
- [ ] **HOME-02**: Highlights section with 3-6 key bullet points
- [ ] **HOME-03**: Featured projects section showing top 3 projects (from featured flag)
- [ ] **HOME-04**: Automation teaser section with link to Stack/Automation page
- [ ] **HOME-05**: Contact CTA section with link to contact form

### About Page
- [ ] **ABOUT-01**: Narrative section with background and approach
- [ ] **ABOUT-02**: Strengths section highlighting key capabilities
- [ ] **ABOUT-03**: Enablement framing that aligns with target audience (engineering managers)

### Resume Page
- [ ] **RESUME-01**: Highlights section rendered from Convex resume data
- [ ] **RESUME-02**: Experience section with company, role, dates, and bullets
- [ ] **RESUME-03**: Education section rendered from Convex data
- [ ] **RESUME-04**: Skills section grouped by category
- [ ] **RESUME-05**: Web-native layout optimized for scanning

### Projects
- [ ] **PROJ-01**: Projects index page lists all published projects
- [ ] **PROJ-02**: Each project card shows title, summary, stack, and tags
- [ ] **PROJ-03**: Project detail page accessible at /projects/[slug]
- [ ] **PROJ-04**: Project detail shows problem, approach, constraints, impact sections
- [ ] **PROJ-05**: Project detail shows stack as list of technologies
- [ ] **PROJ-06**: Project detail shows links (GitHub, live demo, etc.)
- [ ] **PROJ-07**: Project detail shows screenshots/images
- [ ] **PROJ-08**: Draft projects never appear on public pages (filtered in Convex queries)
- [ ] **PROJ-09**: Featured projects appear on home page (top 3 by featured flag)

### Stack/Automation Page
- [ ] **STACK-01**: Architecture diagram showing Next.js/Vercel + Convex + WorkOS
- [ ] **STACK-02**: Automation pipeline diagram showing Issue → PR → Review → CI → Merge → Deploy → Changelog workflow
- [ ] **STACK-03**: Explanation text describing the automated workflow concept

### Contact
- [ ] **CONTACT-01**: Contact form with name, email, message fields
- [ ] **CONTACT-02**: Form validation using zod schema
- [ ] **CONTACT-03**: Form submits to Convex mutation for storage
- [ ] **CONTACT-04**: Honeypot field for spam protection (hidden from real users)
- [ ] **CONTACT-05**: Rate limiting prevents rapid submissions
- [ ] **CONTACT-06**: Email fallback link visible if form unavailable
- [ ] **CONTACT-07**: Success message shown after successful submission
- [ ] **CONTACT-08**: Loading state while form is submitting

### Authentication
- [x] **AUTH-01**: WorkOS AuthKit integrated for authentication
- [x] **AUTH-02**: Email allowlist configured (only allowlisted emails can access admin)
- [x] **AUTH-03**: Auth middleware protects all /admin/* routes
- [x] **AUTH-04**: Login redirects to admin dashboard after successful auth
- [x] **AUTH-05**: Logout functionality available in admin panel
- [x] **AUTH-06**: Session persists across browser refresh

### Admin Panel
- [x] **ADMIN-01**: Admin dashboard layout with navigation to Projects, Resume, Changelog sections
- [x] **ADMIN-02**: Projects list shows all projects (published and draft)
- [x] **ADMIN-03**: Create new project form with all required fields
- [x] **ADMIN-04**: Edit existing project form pre-populated with current data
- [x] **ADMIN-05**: Delete project with confirmation dialog
- [x] **ADMIN-06**: Toggle draft/published status for projects
- [x] **ADMIN-07**: Toggle featured flag for projects
- [x] **ADMIN-08**: Resume editor for highlights, experience, education, skills sections
- [x] **ADMIN-09**: Changelog list showing all entries
- [x] **ADMIN-10**: Toggle visibility for changelog entries
- [x] **ADMIN-11**: All Convex mutations verify auth context before executing

### Design & Animations
- [ ] **DESIGN-01**: Dark color scheme applied to all pages
- [ ] **DESIGN-02**: Minimalist aesthetic with clean typography and spacing
- [ ] **DESIGN-03**: High contrast text (minimum 4.5:1 ratio for WCAG AA)
- [ ] **DESIGN-04**: Framer Motion page transitions between routes
- [ ] **DESIGN-05**: Scroll-triggered reveal animations for content sections
- [ ] **DESIGN-06**: Subtle hover effects on interactive elements
- [ ] **DESIGN-07**: Animations use GPU-only properties (transform/opacity)
- [ ] **DESIGN-08**: prefers-reduced-motion support for accessibility

### SEO & Metadata
- [x] **SEO-01**: Each page has unique title tag
- [x] **SEO-02**: Each page has meta description
- [x] **SEO-03**: OpenGraph tags for social sharing (og:title, og:description, og:image)
- [x] **SEO-04**: sitemap.xml generated with all public pages
- [x] **SEO-05**: robots.txt configured to allow indexing
- [x] **SEO-06**: Canonical URLs set for all pages

### Deployment
- [x] **DEPLOY-01**: Site deployed to Vercel with custom domain
- [x] **DEPLOY-02**: Convex backend deployed and connected to Vercel
- [x] **DEPLOY-03**: Environment variables configured (WorkOS keys, Convex URL)
- [x] **DEPLOY-04**: Automatic deployment on push to main branch
- [x] **DEPLOY-05**: Preview deployments created for pull requests

## v2 Requirements

Deferred to post-v1 (automation phase).

### Automation
- **AUTO-01**: Claude Code slash commands (/ spec, /implement, /review, /release-note)
- **AUTO-02**: GitHub Actions workflow for Claude PR review bot
- **AUTO-03**: PR review bot posts APPROVE or REQUEST_CHANGES verdict
- **AUTO-04**: PR cannot merge without Claude approval (required check)
- **AUTO-05**: Changelog automatically updated on PR merge to main
- **AUTO-06**: Changelog loop prevention (skip markers, author checks, file detection)
- **AUTO-07**: Auto-labeling for issues and PRs
- **AUTO-08**: CI required checks (lint, typecheck, test, build)

### Stack Page Enhancements
- **STACK-04**: Live evidence widget showing latest deployment commit
- **STACK-05**: CI badge(s) showing build status
- **STACK-06**: Last Claude approval timestamp from PR metadata

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog or writing section | Not needed for v1; risk of looking stale if not maintained |
| Multi-environment staging | PR previews sufficient; no need for separate staging environment |
| Advanced accessibility | Basic usability only for v1; WCAG AA compliance for contrast but not full audit |
| PDF resume export | Web-native resume sufficient for v1; can add later if requested |
| Searchable/filterable projects | Only 3-6 projects, not enough to warrant search/filter UI |
| Real-time features | Reactive Convex queries provide some real-time, but no WebSocket indicators needed |
| Interactive project demos | Static screenshots sufficient for v1; embedded demos high complexity |
| Social media feeds | Links to profiles sufficient; embedded feeds are distracting and slow |
| Analytics dashboard | Use Vercel Analytics privately; no need for public metrics display |
| Multi-page forms | Contact form is single page with 3 fields; keep simple |
| OAuth login options | Email/password via WorkOS sufficient for single admin |
| Image upload in admin | Static file paths in v1; can add cloud storage later |
| Markdown editor for projects | Plain textarea sufficient for v1; rich editing can be added later |
| Draft preview mode | Drafts only visible when authenticated; no special preview mode needed |
| Changelog RSS feed | Simple list view sufficient for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| HOME-01 | Phase 2 | Pending |
| HOME-02 | Phase 2 | Pending |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| HOME-05 | Phase 2 | Pending |
| ABOUT-01 | Phase 2 | Pending |
| ABOUT-02 | Phase 2 | Pending |
| ABOUT-03 | Phase 2 | Pending |
| RESUME-01 | Phase 2 | Pending |
| RESUME-02 | Phase 2 | Pending |
| RESUME-03 | Phase 2 | Pending |
| RESUME-04 | Phase 2 | Pending |
| RESUME-05 | Phase 2 | Pending |
| PROJ-01 | Phase 2 | Pending |
| PROJ-02 | Phase 2 | Pending |
| PROJ-03 | Phase 2 | Pending |
| PROJ-04 | Phase 2 | Pending |
| PROJ-05 | Phase 2 | Pending |
| PROJ-06 | Phase 2 | Pending |
| PROJ-07 | Phase 2 | Pending |
| PROJ-08 | Phase 2 | Pending |
| PROJ-09 | Phase 2 | Pending |
| STACK-01 | Phase 2 | Pending |
| STACK-02 | Phase 2 | Pending |
| STACK-03 | Phase 2 | Pending |
| CONTACT-01 | Phase 3 | Pending |
| CONTACT-02 | Phase 3 | Pending |
| CONTACT-03 | Phase 3 | Pending |
| CONTACT-04 | Phase 3 | Pending |
| CONTACT-05 | Phase 3 | Pending |
| CONTACT-06 | Phase 3 | Pending |
| CONTACT-07 | Phase 3 | Pending |
| CONTACT-08 | Phase 3 | Pending |
| AUTH-01 | Phase 4 | Pending |
| AUTH-02 | Phase 4 | Pending |
| AUTH-03 | Phase 4 | Pending |
| AUTH-04 | Phase 4 | Pending |
| AUTH-05 | Phase 4 | Pending |
| AUTH-06 | Phase 4 | Pending |
| ADMIN-01 | Phase 4 | Pending |
| ADMIN-02 | Phase 4 | Pending |
| ADMIN-03 | Phase 4 | Pending |
| ADMIN-04 | Phase 4 | Pending |
| ADMIN-05 | Phase 4 | Pending |
| ADMIN-06 | Phase 4 | Pending |
| ADMIN-07 | Phase 4 | Pending |
| ADMIN-08 | Phase 4 | Pending |
| ADMIN-09 | Phase 4 | Pending |
| ADMIN-10 | Phase 4 | Pending |
| ADMIN-11 | Phase 4 | Pending |
| DESIGN-01 | Phase 5 | Complete |
| DESIGN-02 | Phase 5 | Complete |
| DESIGN-03 | Phase 5 | Complete |
| DESIGN-04 | Phase 5 | Complete |
| DESIGN-05 | Phase 5 | Complete |
| DESIGN-06 | Phase 5 | Complete |
| DESIGN-07 | Phase 5 | Complete |
| DESIGN-08 | Phase 5 | Complete |
| SEO-01 | Phase 6 | Complete |
| SEO-02 | Phase 6 | Complete |
| SEO-03 | Phase 6 | Complete |
| SEO-04 | Phase 6 | Complete |
| SEO-05 | Phase 6 | Complete |
| SEO-06 | Phase 6 | Complete |
| DEPLOY-01 | Phase 6 | Complete |
| DEPLOY-02 | Phase 6 | Complete |
| DEPLOY-03 | Phase 6 | Complete |
| DEPLOY-04 | Phase 6 | Complete |
| DEPLOY-05 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 66 total
- Mapped to phases: 66
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-18*
*Last updated: 2026-01-18 after initial definition*
