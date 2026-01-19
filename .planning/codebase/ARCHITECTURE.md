# Architecture

**Analysis Date:** 2026-01-18

## Pattern Overview

**Overall:** Full-Stack Server Components with Backend-as-a-Service

**Key Characteristics:**
- Next.js App Router with React Server Components for rendering
- Convex handles all backend logic (database queries and mutations)
- WorkOS AuthKit provides authentication middleware
- Clear separation between public pages (read-only) and admin panel (authenticated mutations)
- GitHub Actions + Claude Code automation for CI/CD pipeline

## Layers

**Presentation Layer (Public Pages):**
- Purpose: Render portfolio content for visitors
- Location: `app/` (App Router pages)
- Contains: Page components, layouts, client components for interactivity
- Depends on: Convex queries (read-only)
- Used by: End users, recruiters, hiring managers
- Notable: `/`, `/about`, `/resume`, `/projects`, `/projects/[slug]`, `/stack`, `/contact`

**Presentation Layer (Admin Panel):**
- Purpose: Protected content management interface
- Location: `app/admin/`
- Contains: Admin dashboard, CRUD interfaces for projects/resume/changelog
- Depends on: WorkOS auth middleware, Convex mutations
- Used by: Authenticated site owner only
- Notable: Email allowlist enforces single-user access

**Backend Layer (Convex):**
- Purpose: Database and server function execution
- Location: `convex/`
- Contains: Schema definitions, queries, mutations, rate limiting logic
- Depends on: Convex runtime
- Used by: Both public and admin presentation layers
- Notable: Single source of truth for all data (projects, resume, changelog, contact submissions)

**Authentication Layer:**
- Purpose: Protect admin routes and gate draft content
- Location: Middleware in `app/` (likely `middleware.ts`)
- Contains: WorkOS AuthKit integration, email allowlist validation
- Depends on: WorkOS service
- Used by: Admin routes, draft visibility logic

**Automation Layer:**
- Purpose: CI/CD pipeline and GitHub automation
- Location: `.github/workflows/`, `.claude/commands/`
- Contains: GitHub Actions, Claude Code slash commands
- Depends on: GitHub API, Claude Code SDK
- Used by: Development workflow (Issue → PR → Review → Merge → Deploy)

## Data Flow

**Public Page Rendering:**

1. User requests page (e.g., `/projects`)
2. Next.js Server Component fetches data via Convex query
3. Only published content returned (draft filter applied)
4. Server renders HTML with data
5. Client hydrates with interactivity (Framer Motion animations)

**Admin Content Update:**

1. Admin navigates to `/admin/projects`
2. WorkOS middleware validates authentication + email allowlist
3. Admin modifies project via form
4. Form submission triggers Convex mutation
5. Convex validates and updates database
6. Admin UI reflects updated state

**Contact Form Submission:**

1. User fills form on `/contact` page
2. Form submits to Convex mutation (with honeypot and rate limiting)
3. Convex stores submission in `contactSubmissions` table
4. Success confirmation displayed to user

**Automation Workflow:**

1. Issue opened on GitHub
2. Claude Code `/spec` command generates plan
3. Claude Code `/implement` command creates branch, commits, opens PR
4. CI runs: lint, typecheck, tests, build
5. Claude Code `/review` command performs review (required check)
6. On approval + CI pass: merge allowed
7. Merge triggers: Vercel deploy + changelog update (via Convex mutation or file)

**State Management:**
- Server state managed by Convex (single source of truth)
- Client state minimal (form inputs, UI toggles)
- No global client state library (React Server Components handle most state)

## Key Abstractions

**Project:**
- Purpose: Represents a portfolio project with metadata and content
- Examples: `convex/schema.ts` (definition), `app/projects/[slug]/page.tsx` (consumption)
- Pattern: Document model with slug-based routing, draft/published status, featured flag

**Resume:**
- Purpose: Structured resume data (experience, education, skills)
- Examples: `convex/schema.ts` (definition), `app/resume/page.tsx` (consumption)
- Pattern: Single-document model updated atomically

**Changelog Entry:**
- Purpose: Represents a deployment/release with PR metadata
- Examples: `convex/schema.ts` (definition), `app/stack/page.tsx` (display)
- Pattern: Auto-generated on PR merge, linked to GitHub PR and commit

**Contact Submission:**
- Purpose: Stores contact form messages
- Examples: `convex/schema.ts` (definition), admin panel (review interface)
- Pattern: Simple CRUD with status tracking (new/archived)

## Entry Points

**Next.js Application:**
- Location: `app/layout.tsx`, `app/page.tsx`
- Triggers: HTTP requests to Vercel
- Responsibilities: Route handling, page rendering, layout composition

**Convex Backend:**
- Location: `convex/_generated/server.ts` (generated), `convex/schema.ts` (entry for schema)
- Triggers: Convex client calls from Next.js
- Responsibilities: Execute queries/mutations, enforce data validation

**GitHub Actions (CI/CD):**
- Location: `.github/workflows/ci.yml`, `.github/workflows/claude-author.yml`, `.github/workflows/claude-reviewer.yml`
- Triggers: PR open, PR synchronize, push to main
- Responsibilities: Run checks, invoke Claude Code, trigger deploys

**Claude Code Slash Commands:**
- Location: `.claude/commands/spec.md`, `.claude/commands/implement.md`, `.claude/commands/review.md`, `.claude/commands/release-note.md`
- Triggers: Manual invocation via Claude Code interface
- Responsibilities: Issue analysis, code generation, PR review, changelog generation

## Error Handling

**Strategy:** Layered error handling with user-friendly messages in UI

**Patterns:**
- Convex mutations throw descriptive errors (e.g., "Project slug already exists")
- Next.js error boundaries catch rendering errors (`error.tsx` files)
- Contact form rate limiting returns user-friendly error messages
- Admin panel validates input before submission (client-side + server-side)
- WorkOS authentication failures redirect to login page

## Cross-Cutting Concerns

**Logging:** Convex runtime logging for backend operations, Vercel logs for Next.js requests

**Validation:** Convex schema validation for all mutations, TypeScript types for compile-time safety

**Authentication:** WorkOS middleware on all `/admin/*` routes, email allowlist checked on admin access, draft content visibility gated by auth status

---

*Architecture analysis: 2026-01-18*
