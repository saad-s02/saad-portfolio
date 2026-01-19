# Automated Personal Portfolio Website

## What This Is

A personal portfolio and resume website with an admin panel for content management and a highly visible Stack/Automation page showcasing an end-to-end AI-driven development workflow. Built with Next.js (App Router), featuring 3-6 curated projects, structured resume data, and a dark minimalist aesthetic with premium animations.

## Core Value

The Stack/Automation page demonstrating a verifiable automated engineering workflow (Issue → Claude PR → Claude Review Gate → CI → Merge → Deploy → Changelog) is the key differentiator that sets this portfolio apart and demonstrates engineering enablement capabilities.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Home page with hero, highlights, featured projects, automation teaser, and contact CTA
- [ ] About page with narrative and strengths
- [ ] Resume page rendered from structured Convex data
- [ ] Projects index page with 3-6 curated projects
- [ ] Project detail pages with problem/approach/constraints/impact/stack/links structure
- [ ] Stack/Automation page with architecture and automation pipeline diagrams (planned workflow, no live evidence widgets in v1)
- [ ] Contact form with Convex storage, honeypot spam protection, and rate limiting
- [ ] Admin panel for managing projects, resume, and changelog
- [ ] WorkOS AuthKit authentication with email allowlist (admin-only access)
- [ ] Draft/published status for projects (drafts only visible when authenticated)
- [ ] Featured flag for projects (top 3 appear on homepage)
- [ ] Dark, minimalist, high-contrast aesthetic throughout
- [ ] Subtle refined animations using Framer Motion (smooth page transitions, gentle scroll reveals, understated hover effects inspired by Apple/Linear)
- [ ] Fully responsive mobile and desktop layouts
- [ ] Deployed to Vercel with Convex backend integration
- [ ] Basic SEO: per-page title/description, OpenGraph tags, sitemap, robots.txt, canonical URLs

### Out of Scope

- Automated PR authoring (Issue→PR) — deferred to post-v1
- PR review gate automation (Claude reviewer bot) — deferred to post-v1
- Live evidence widgets on Stack page (CI badges, deployment status, last Claude approval) — deferred to post-v1
- Codex PR reviews in GitHub — deferred to post-v1
- Blog or writing section — not needed for v1
- Multi-environment staging beyond PR previews — not needed for v1
- Advanced accessibility requirements — basic usability only for v1
- PDF resume export — may add later

## Context

**Target Audience:**
- Recruiters: Need fast scan of highlights and featured projects
- Hiring managers: Want deep dive on automation + engineering enablement approach

**Content Status:**
Real content is ready for projects and resume sections. Will be added via Admin panel after deployment.

**Project Scale:**
Small curated portfolio (3-6 projects) focused on quality over quantity. Featured projects highlighted on homepage.

**Design References:**
Subtle refined animation style similar to Apple and Linear - smooth, understated, professional. Dark theme with high contrast for readability.

## Constraints

- **Privacy**: No client names or sensitive metrics exposed publicly in projects or content
- **Tech Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Convex (database + server functions), WorkOS AuthKit, Vercel hosting
- **Auth Model**: Email allowlist enforces admin-only access; only allowlisted email can log into admin panel
- **Design**: Dark + minimalist aesthetic is non-negotiable; must feel premium and refined
- **Responsive**: Mobile and desktop support required; must work well on both
- **Security**: Secrets only in GitHub/Vercel secret stores; contact form rate limiting required; changelog loop prevention (bot commits must not trigger new changelog entries)
- **Draft Visibility**: Draft projects never appear on public pages, only visible when authenticated

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Defer automation to post-v1 | Build and deploy site first, add Claude Code workflow after site is live and proven | — Pending |
| Stack page shows planned diagrams only in v1 | Can't show live automation evidence before automation exists; diagrams explain vision | — Pending |
| WorkOS AuthKit for auth | Simple admin-only model with email allowlist; don't need full user management | — Pending |
| Convex for backend | Real-time capabilities, integrated deployment with Vercel, simple schema definition | — Pending |
| 3-6 projects with featured flag | Small curated portfolio with clear homepage highlights; quality over quantity | — Pending |

---
*Last updated: 2026-01-18 after initialization*
