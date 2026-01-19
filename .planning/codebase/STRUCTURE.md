# Codebase Structure

**Analysis Date:** 2026-01-18

## Directory Layout

```
saad-portfolio/
├── .claude/                # Claude Code automation config
│   ├── commands/          # Slash commands (spec, implement, review, release-note)
│   └── settings.local.json
├── .github/               # GitHub Actions workflows
│   └── workflows/         # CI/CD automation (ci.yml, claude-author.yml, claude-reviewer.yml)
├── .planning/             # Project planning and codebase docs
│   └── codebase/         # Architecture and structure documentation
├── app/                   # Next.js App Router application
│   ├── (public)/         # Public pages group
│   │   ├── page.tsx      # Home page
│   │   ├── about/        # About page
│   │   ├── resume/       # Resume page
│   │   ├── projects/     # Projects index and detail pages
│   │   │   └── [slug]/   # Dynamic project detail routes
│   │   ├── stack/        # Stack/Automation evidence page
│   │   └── contact/      # Contact form page
│   ├── admin/            # Protected admin panel
│   │   ├── layout.tsx    # Admin layout with auth check
│   │   ├── projects/     # Project management CRUD
│   │   ├── resume/       # Resume editor
│   │   └── changelog/    # Changelog management
│   ├── layout.tsx        # Root layout (global styles, fonts, metadata)
│   ├── error.tsx         # Error boundary
│   └── not-found.tsx     # 404 page
├── components/           # Shared React components
│   ├── ui/              # UI primitives (buttons, forms, cards)
│   └── layout/          # Layout components (header, footer, nav)
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema definitions
│   ├── projects.ts      # Project queries and mutations
│   ├── resume.ts        # Resume queries and mutations
│   ├── changelog.ts     # Changelog queries and mutations
│   ├── contact.ts       # Contact form mutation with rate limiting
│   └── _generated/      # Convex generated files (auto-generated, not edited)
├── lib/                 # Utility libraries
│   ├── convex.ts        # Convex client setup
│   ├── workos.ts        # WorkOS client configuration
│   └── utils.ts         # Shared utility functions
├── public/              # Static assets
│   ├── images/          # Images (screenshots, diagrams)
│   └── favicon.ico      # Site favicon
├── middleware.ts        # Next.js middleware (WorkOS auth gate)
├── package.json         # npm dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
├── convex.json          # Convex project configuration
├── CLAUDE.md            # Claude Code project guidance
├── automated-portfolio-prd.md  # Product requirements
└── README.md            # Project readme
```

## Directory Purposes

**`.claude/`:**
- Purpose: Claude Code automation configuration
- Contains: Slash command definitions, local settings
- Key files: `commands/spec.md`, `commands/implement.md`, `commands/review.md`, `commands/release-note.md`, `settings.local.json`

**`.github/workflows/`:**
- Purpose: GitHub Actions CI/CD pipelines
- Contains: Workflow definitions for CI checks, Claude automation, deployment
- Key files: `ci.yml` (lint/typecheck/test/build), `claude-author.yml` (Issue→PR), `claude-reviewer.yml` (PR review gate)

**`.planning/codebase/`:**
- Purpose: Codebase documentation for GSD commands
- Contains: Architecture, structure, conventions, testing, tech stack docs
- Key files: `ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `STACK.md`, `INTEGRATIONS.md`, `CONCERNS.md`

**`app/`:**
- Purpose: Next.js App Router application code
- Contains: Pages, layouts, route groups, API routes (if needed)
- Key files: `layout.tsx` (root layout), `page.tsx` (home), `middleware.ts` (auth)

**`app/(public)/`:**
- Purpose: Public-facing pages (no auth required)
- Contains: Home, About, Resume, Projects, Stack, Contact pages
- Key files: `page.tsx`, `about/page.tsx`, `resume/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `stack/page.tsx`, `contact/page.tsx`

**`app/admin/`:**
- Purpose: Protected admin panel for content management
- Contains: Project CRUD, resume editor, changelog management
- Key files: `layout.tsx` (auth check), `projects/page.tsx`, `resume/page.tsx`, `changelog/page.tsx`

**`components/`:**
- Purpose: Reusable React components
- Contains: UI primitives, layout components, feature components
- Key files: `ui/Button.tsx`, `ui/Card.tsx`, `layout/Header.tsx`, `layout/Footer.tsx`

**`convex/`:**
- Purpose: Backend database and server functions
- Contains: Schema, queries, mutations, business logic
- Key files: `schema.ts`, `projects.ts`, `resume.ts`, `changelog.ts`, `contact.ts`

**`lib/`:**
- Purpose: Utility libraries and shared helpers
- Contains: Client setup, utility functions, type definitions
- Key files: `convex.ts`, `workos.ts`, `utils.ts`

**`public/`:**
- Purpose: Static assets served directly
- Contains: Images, fonts, diagrams, favicon
- Key files: `images/`, `favicon.ico`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout with global styles, fonts, metadata
- `app/page.tsx`: Home page (hero, highlights, featured projects, CTA)
- `middleware.ts`: WorkOS authentication middleware for `/admin/*` routes

**Configuration:**
- `package.json`: npm dependencies and scripts (dev, build, lint, typecheck, test)
- `tsconfig.json`: TypeScript compiler options (strict mode, path aliases)
- `tailwind.config.ts`: Tailwind CSS customization (dark theme, colors, fonts)
- `next.config.js`: Next.js configuration (image domains, redirects)
- `convex.json`: Convex project configuration (project ID)

**Core Logic:**
- `convex/schema.ts`: Defines all database tables (projects, resume, changelog, contactSubmissions)
- `convex/projects.ts`: Project queries (list, get by slug) and mutations (create, update, delete)
- `convex/resume.ts`: Resume query and mutation (single document)
- `convex/contact.ts`: Contact form mutation with rate limiting and spam protection

**Testing:**
- `__tests__/`: Unit and integration tests (co-located with features or in dedicated directory)
- `jest.config.js` or `vitest.config.ts`: Test framework configuration
- `*.test.ts` or `*.spec.ts`: Test files

## Naming Conventions

**Files:**
- Page files: `page.tsx` (App Router convention)
- Layout files: `layout.tsx` (App Router convention)
- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `ProjectCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`, `slugify.ts`)
- Convex files: `camelCase.ts` (e.g., `projects.ts`, `resume.ts`)

**Directories:**
- Route groups: `(groupName)/` (e.g., `(public)/` for public pages)
- Dynamic routes: `[param]/` (e.g., `[slug]/` for project detail pages)
- Components: `kebab-case/` or `camelCase/` (e.g., `ui/`, `layout/`)
- Feature modules: `camelCase/` (e.g., `projects/`, `resume/`)

## Where to Add New Code

**New Public Page:**
- Primary code: `app/(public)/[page-name]/page.tsx`
- Layout (if custom): `app/(public)/[page-name]/layout.tsx`
- Tests: `__tests__/app/[page-name].test.tsx` or co-located `app/(public)/[page-name]/page.test.tsx`

**New Admin Feature:**
- Primary code: `app/admin/[feature]/page.tsx`
- Convex mutations: `convex/[feature].ts`
- Tests: `__tests__/convex/[feature].test.ts`

**New Convex Table:**
- Schema: Add to `convex/schema.ts`
- Queries/Mutations: Create `convex/[tableName].ts`
- TypeScript types: Exported from Convex schema (auto-generated)

**New Component:**
- UI primitive: `components/ui/[ComponentName].tsx`
- Feature component: `components/[feature]/[ComponentName].tsx`
- Layout component: `components/layout/[ComponentName].tsx`

**Utilities:**
- Shared helpers: `lib/utils.ts` or new file `lib/[utilName].ts`
- Convex helpers: `convex/[helperName].ts`

**GitHub Actions Workflow:**
- New workflow: `.github/workflows/[workflow-name].yml`
- Update existing: `.github/workflows/ci.yml` (for CI checks)

**Claude Code Slash Command:**
- New command: `.claude/commands/[command-name].md`
- Follow Claude Code command structure (description, instructions, prompts)

## Special Directories

**`convex/_generated/`:**
- Purpose: Convex auto-generated TypeScript types and client code
- Generated: Yes (by Convex CLI)
- Committed: No (added to .gitignore)

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes (by Next.js build process)
- Committed: No (added to .gitignore)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by npm install)
- Committed: No (added to .gitignore)

**`.planning/`:**
- Purpose: Project planning documents and codebase analysis
- Generated: Partially (codebase docs generated by `/gsd:map-codebase`)
- Committed: Yes (tracked in git for reference)

---

*Structure analysis: 2026-01-18*
