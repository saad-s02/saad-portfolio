# Roadmap: Automated Personal Portfolio Website

**Created:** 2026-01-18
**Depth:** Standard (6 phases)
**Coverage:** 66/66 v1 requirements mapped

## Overview

This roadmap delivers a personal portfolio website with admin panel and automation showcase in 6 phases. The Stack/Automation page demonstrating the automated workflow (Issue → Claude PR → Review → CI → Merge → Deploy → Changelog) is the key differentiator. Each phase delivers a complete, verifiable capability that builds toward the full vision.

## Phase 1: Foundation

**Goal:** Project scaffold and infrastructure ready for building public pages

**Dependencies:** None (starting point)

**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05

**Plans:** 2 plans

Plans:
- [ ] 01-01-PLAN.md — Initialize Next.js 16 + TypeScript and configure Tailwind v4
- [ ] 01-02-PLAN.md — Initialize Convex backend and create dark-themed layout with navigation

**Success Criteria:**
1. Developer can run `npm run dev` and see Next.js app at localhost:3000
2. Developer can run `npx convex dev` and interact with local Convex backend
3. All pages show dark theme by default with proper contrast
4. Site layout renders correctly on both mobile (375px) and desktop (1440px) viewports
5. Navigation header appears on all pages with links to Home, About, Resume, Projects, Stack, Contact

---

## Phase 2: Public Content Pages

**Goal:** Visitors can view portfolio content, projects, resume, and automation vision

**Dependencies:** Phase 1 (requires Next.js scaffold and Convex schema)

**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, ABOUT-01, ABOUT-02, ABOUT-03, RESUME-01, RESUME-02, RESUME-03, RESUME-04, RESUME-05, PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, PROJ-06, PROJ-07, PROJ-08, PROJ-09, STACK-01, STACK-02, STACK-03

**Plans:** 5 plans

Plans:
- [ ] 02-01-PLAN.md — Install Framer Motion and create Convex query functions
- [ ] 02-02-PLAN.md — Build home page with hero, highlights, featured projects, automation teaser, and contact CTA
- [ ] 02-03-PLAN.md — Build About and Resume pages
- [ ] 02-04-PLAN.md — Build projects index and dynamic detail pages
- [ ] 02-05-PLAN.md — Build Stack/Automation page with architecture and pipeline diagrams

**Success Criteria:**
1. Visitor can navigate to home page and see hero, highlights, featured projects, automation teaser, and contact CTA
2. Visitor can view About page with narrative and strengths sections
3. Visitor can view Resume page with highlights, experience, education, and skills rendered from Convex data
4. Visitor can browse projects index and click through to individual project detail pages showing problem/approach/impact/stack/links
5. Visitor can view Stack/Automation page with architecture and pipeline diagrams explaining the planned workflow
6. Only published projects appear on public pages (drafts are filtered out)

---

## Phase 3: Contact Form

**Goal:** Visitors can submit contact inquiries with spam protection

**Dependencies:** Phase 1 (requires Convex for storage)

**Requirements:** CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04, CONTACT-05, CONTACT-06, CONTACT-07, CONTACT-08

**Plans:** 2 plans

Plans:
- [ ] 03-01-PLAN.md — Set up form libraries, create validation schema, and build ContactForm UI
- [ ] 03-02-PLAN.md — Implement Convex mutation with honeypot and rate limiting for spam protection

**Success Criteria:**
1. Visitor can fill out contact form with name, email, and message fields
2. Form validates input and shows error messages for invalid data
3. Form submission stores data in Convex contactSubmissions table
4. Visitor sees success message after successful submission
5. Rapid repeated submissions are blocked by rate limiting (prevents spam)
6. Email fallback link is visible if form is unavailable

---

## Phase 4: Authentication & Admin Panel

**Goal:** Admin can securely manage portfolio content through web interface

**Dependencies:** Phase 1 (requires Convex schema), Phase 2 (admin manages content that exists)

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06, ADMIN-07, ADMIN-08, ADMIN-09, ADMIN-10, ADMIN-11

**Plans:** 5 plans

Plans:
- [ ] 04-01-PLAN.md — WorkOS AuthKit setup with middleware and auth routes
- [ ] 04-02-PLAN.md — Convex admin mutations with authentication verification
- [ ] 04-03-PLAN.md — Admin layout with sidebar navigation and dashboard
- [ ] 04-04-PLAN.md — Projects admin (list, create, edit, delete, toggles)
- [ ] 04-05-PLAN.md — Resume, Changelog, and Contact Submissions admin

**Success Criteria:**
1. Only allowlisted email addresses can access `/admin/*` routes (unauthenticated users are redirected to login)
2. Admin can log in via WorkOS AuthKit and session persists across browser refresh
3. Admin can create, edit, and delete projects through web forms
4. Admin can toggle draft/published status and featured flag for projects
5. Admin can edit resume data (highlights, experience, education, skills) through structured forms
6. Admin can view changelog entries and toggle their visibility
7. All Convex mutations verify authentication before executing (security in depth)

---

## Phase 5: Design & Animations

**Goal:** Site feels premium and refined with smooth animations and dark aesthetic

**Dependencies:** Phase 2 (animating content that exists)

**Requirements:** DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-07, DESIGN-08

**Plans:** 0 plans

**Success Criteria:**
1. All pages use dark color scheme with high contrast text (4.5:1 minimum ratio)
2. Page transitions between routes are smooth and use Framer Motion
3. Content sections reveal on scroll with subtle animation
4. Interactive elements (buttons, links, cards) have understated hover effects
5. Animations use GPU-only properties (transform/opacity) and feel smooth on mid-range devices
6. Users with `prefers-reduced-motion` setting see static content without animations

---

## Phase 6: SEO & Deployment

**Goal:** Site is discoverable, production-ready, and automatically deployed

**Dependencies:** Phase 1-5 (deploying complete site)

**Requirements:** SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05

**Plans:** 0 plans

**Success Criteria:**
1. Every page has unique title and meta description visible in browser tab and search results
2. Social media shares show OpenGraph image, title, and description
3. Search engines can discover all public pages via sitemap.xml
4. Site is live at custom domain with HTTPS
5. Pushing to main branch triggers automatic deployment to production
6. Pull requests generate preview deployments with unique URLs
7. Convex backend is deployed and connected to production Vercel deployment

---

## Progress

| Phase | Status | Requirements | Completion |
|-------|--------|--------------|------------|
| Phase 1: Foundation | Pending | 5 | 0% |
| Phase 2: Public Content Pages | Pending | 26 | 0% |
| Phase 3: Contact Form | Pending | 8 | 0% |
| Phase 4: Authentication & Admin Panel | Pending | 17 | 0% |
| Phase 5: Design & Animations | Pending | 8 | 0% |
| Phase 6: SEO & Deployment | Pending | 11 | 0% |

**Overall Progress:** 0/66 requirements complete (0%)

---

## Notes

**Build Order Discipline:** Public pages before admin panel. Content before tools. Launch before perfecting.

**Critical Pitfalls to Avoid:**
- Infinite changelog loop (bot commits triggering automation) - defer automation to post-v1
- Contact form spam - implement all protection layers (honeypot + rate limit + time trap)
- Auth security theater - verify in both middleware AND Convex mutations
- Animation performance - GPU-only properties, test on mid-range devices

**Post-v1 Scope:**
Automation phase (Claude Code slash commands, GitHub Actions review bot, changelog automation) is deferred to post-v1. Phase 2 Stack page shows planned workflow diagrams without live evidence widgets in v1.

---

*Last updated: 2026-01-19*
