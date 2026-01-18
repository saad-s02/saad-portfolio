# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an automated personal portfolio website built with Next.js (App Router) that showcases an end-to-end AI-driven development workflow. The site includes public portfolio pages and a protected admin panel for content management.

**Key differentiator:** This project features a highly visible Stack/Automation section demonstrating the workflow: Issue → Claude PR → Claude Review Gate → CI → Merge → Deploy → Changelog.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Convex (database + server functions)
- **Auth:** WorkOS AuthKit (admin-only access via email allowlist)
- **Hosting:** Vercel (with Convex deploy integration)
- **Automation:** Claude Code GitHub Actions + repo slash commands

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check
npm test             # Run test suite
```

### Convex
```bash
npx convex dev       # Start Convex development backend
npx convex deploy    # Deploy Convex functions to production
```

## Architecture

### Data Flow
1. **Public pages** → Convex queries (read-only) → Render content
2. **Admin panel** → WorkOS auth gate → Convex mutations → Update content
3. **Contact form** → Convex mutation (with rate limiting) → Store submission

### Key Data Models (Convex)

**projects table:**
- Supports draft/published status
- `featured` boolean for homepage display
- Structured with title, summary, stack[], tags[], links[], screenshots[], content

**resume table:**
- Single-document structure with highlights[], experience[], education[], skills[]
- Updated via Admin panel

**changelog table:**
- Auto-populated on PR merge
- Fields: date, title, summary, prNumber, commitSha, type (feature|fix|chore), visible

**contactSubmissions table:**
- Stores form submissions with status tracking (new|archived)

### Authentication & Authorization
- WorkOS AuthKit handles authentication
- Email allowlist enforces admin-only access
- All `/admin/*` routes protected by auth middleware
- Draft projects only visible when authenticated

### Automation Components

The repository includes Claude Code automation via GitHub Actions and slash commands in `.claude/commands/`:

- `/spec` — Convert issue to mini spec + plan + acceptance criteria
- `/implement` — Implement plan and open/update PR
- `/review` — Perform structured review with APPROVE/REQUEST_CHANGES verdict
- `/release-note` — Generate changelog entry

**Automation workflow:**
1. **Issue → PR:** Claude creates branch, commits changes, opens PR with detailed description
2. **PR Review Gate:** Claude review is a required check; PR cannot merge without APPROVE verdict
3. **CI Checks:** lint, typecheck, tests, build all must pass
4. **On Merge:** Auto-deploy to Vercel + changelog update

### Page Structure

- `/` — Home (hero, highlights, featured projects, automation teaser)
- `/about` — Narrative + strengths
- `/resume` — Structured resume from Convex data
- `/projects` — Filterable project index
- `/projects/[slug]` — Project detail pages
- `/stack` — Architecture diagrams + automation evidence widgets
- `/contact` — Form with honeypot + rate limiting
- `/admin/*` — Protected content management (projects, resume, changelog)

### Critical Constraints

- **No client/sensitive metric exposure:** Projects must not reveal client names or confidential data
- **Changelog loop prevention:** Bot commits must not trigger additional changelog updates
- **Admin access:** Only allowlisted email can access admin panel
- **Draft visibility:** Draft projects never appear on public pages

## Development Guidelines

### When Adding Features
1. Check if the feature requires admin capabilities (add to `/admin/*` routes)
2. Determine if new Convex schema is needed (update `convex/schema.ts`)
3. Consider animation opportunities (Framer Motion for page transitions, scroll reveals, hovers)
4. Ensure mobile responsiveness (dark, minimalist, high-contrast aesthetic)

### When Modifying Automation
- Test changelog generation to prevent infinite loops
- Ensure Claude reviewer logic aligns with project standards
- Update slash command documentation if behavior changes

### SEO Requirements
- Every page needs title/description metadata
- Include OpenGraph tags for social sharing
- Maintain sitemap.xml and robots.txt

### CI/CD
- All PRs get Vercel preview deployments
- Required checks: lint, typecheck, tests, build, Claude review
- Production deploy triggers automatically on merge to `main`
- Convex deploys integrated via Vercel environment variables
