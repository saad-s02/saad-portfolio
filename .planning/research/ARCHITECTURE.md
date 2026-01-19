# Architecture Patterns

**Domain:** Personal Portfolio Website with Admin Panel
**Researched:** 2026-01-18

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Public    │  │   Admin     │  │   Contact   │    │
│  │   Pages     │  │   Panel     │  │    Form     │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          │ (Read)          │ (Auth + CRUD)   │ (Mutation)
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼───────────┐
│               NEXT.JS APP ROUTER                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Server Components (RSC)                          │   │
│  │  - Fetch data at build/request time               │   │
│  │  - Zero client JS for static content              │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Client Components ('use client')                 │   │
│  │  - Admin forms with react-hook-form               │   │
│  │  - Animations with Framer Motion                  │   │
│  │  - Real-time queries with Convex reactive hooks   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware                                        │   │
│  │  - Auth protection for /admin/* routes            │   │
│  │  - WorkOS session validation                      │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────┬─────────────────┬────────────────────┘
                    │                 │
          (Convex   │                 │ (WorkOS Auth)
           Client)  │                 │
                    │                 │
┌───────────────────▼─────────────────▼────────────────────┐
│                  EXTERNAL SERVICES                        │
│  ┌─────────────────────┐    ┌────────────────────────┐  │
│  │   CONVEX BACKEND    │    │   WORKOS AUTHKIT       │  │
│  │  ┌───────────────┐  │    │  ┌──────────────────┐ │  │
│  │  │  Database     │  │    │  │  Auth UI         │ │  │
│  │  │  - projects   │  │    │  │  - Login/Logout  │ │  │
│  │  │  - resume     │  │    │  │  - Session Mgmt  │ │  │
│  │  │  - changelog  │  │    │  │  - Email Allowlist│ │  │
│  │  │  - contacts   │  │    │  └──────────────────┘ │  │
│  │  └───────────────┘  │    └────────────────────────┘  │
│  │  ┌───────────────┐  │                                 │
│  │  │ Server Fns    │  │                                 │
│  │  │ - queries     │  │                                 │
│  │  │ - mutations   │  │                                 │
│  │  │ - actions     │  │                                 │
│  │  └───────────────┘  │                                 │
│  └─────────────────────┘                                 │
└───────────────────────────────────────────────────────────┘
                    │
                    │ (Deploy on merge)
                    │
┌───────────────────▼───────────────────────────────────────┐
│                 VERCEL HOSTING                             │
│  - Edge Network (global CDN)                              │
│  - Automatic HTTPS                                         │
│  - Preview deployments per PR                             │
│  - Environment variables                                   │
│  - Build + Deploy on git push                             │
└────────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Public Pages (RSC)** | Render portfolio content (projects, resume, about) | Convex (read queries), Vercel CDN |
| **Admin Panel (Client)** | Content management UI (CRUD for projects, resume) | Convex (mutations), WorkOS (auth) |
| **Contact Form (Client)** | Submit contact inquiries | Convex (mutation for storage) |
| **Auth Middleware** | Protect /admin/* routes, validate WorkOS session | WorkOS AuthKit, Next.js routing |
| **Convex Backend** | Database + server functions (queries, mutations, actions) | Next.js app, external services (if needed) |
| **WorkOS AuthKit** | Handle authentication UI, session management, email allowlist | Next.js middleware, admin panel |
| **Vercel Hosting** | Serve Next.js app globally, build/deploy automation | GitHub (CI/CD), Convex (deploy integration) |

### Data Flow

**Public page request (Server Component):**
```
1. User visits /projects
2. Next.js Server Component executes
3. Convex fetchQuery runs at build/request time
4. Data fetched from Convex backend
5. HTML rendered with data
6. Sent to user (zero client JS for data)
```

**Admin panel interaction (Client Component):**
```
1. User navigates to /admin/projects
2. Middleware checks WorkOS session
3. If valid, admin panel loads (Client Component)
4. Convex useQuery hook subscribes to projects
5. Real-time updates via WebSocket
6. User edits project
7. Form submits → Convex useMutation
8. Convex validates + saves to database
9. All subscribed clients receive update (real-time)
```

**Contact form submission:**
```
1. User fills contact form
2. react-hook-form validates (zod schema)
3. On submit → Convex mutation (api.contacts.create)
4. Convex server function executes:
   - Rate limit check (max 5/day per email)
   - Honeypot validation
   - Save to contactSubmissions table
5. Success response → show confirmation
6. Admin can view in /admin/contacts
```

**Authentication flow:**
```
1. User clicks "Admin" link
2. Middleware detects no session
3. Redirect to WorkOS login UI
4. User enters email
5. WorkOS checks email allowlist
6. If allowed → magic link or password login
7. WorkOS redirects to /auth/callback
8. Session cookie set
9. Redirect to /admin/projects
```

## Patterns to Follow

### Pattern 1: Server Component by Default
**What:** Use Server Components (default in App Router) for static/semi-static content
**When:** Pages that don't need interactivity (project list, about, resume)
**Why:** Zero client JavaScript, faster initial load, better SEO

**Example:**
```typescript
// app/projects/page.tsx (Server Component by default)
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export default async function ProjectsPage() {
  // Runs at build time or request time (not in browser)
  const projects = await fetchQuery(api.projects.listPublished)

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  )
}
```

### Pattern 2: Client Components for Interactivity
**What:** Mark components with 'use client' when they need browser APIs or interactivity
**When:** Forms, animations, real-time data, event handlers
**Why:** Server Components can't use useState, useEffect, browser APIs

**Example:**
```typescript
// app/admin/projects/edit-form.tsx
'use client'
import { useForm } from 'react-hook-form'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export function ProjectEditForm({ project }) {
  const form = useForm({ defaultValues: project })
  const updateProject = useMutation(api.projects.update)

  const onSubmit = async (data) => {
    await updateProject({ id: project._id, ...data })
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

### Pattern 3: Auth Middleware for Route Protection
**What:** Use Next.js middleware to protect routes before page loads
**When:** Admin routes that require authentication
**Why:** Prevents unauthorized access, redirects before rendering

**Example:**
```typescript
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs'

export default authkitMiddleware({
  // Protect all /admin routes
  matcher: ['/admin/:path*'],
  redirectUri: '/auth/login',
})
```

### Pattern 4: Optimistic Updates with Convex
**What:** Update UI immediately, sync with backend in background
**When:** Admin panel mutations where user expects instant feedback
**Why:** Better perceived performance, hides network latency

**Example:**
```typescript
'use client'
import { useOptimisticMutation } from '@/lib/convex-hooks'

export function ToggleFeaturedButton({ projectId, featured }) {
  const toggleFeatured = useOptimisticMutation(api.projects.toggleFeatured)

  const handleClick = () => {
    // UI updates immediately
    toggleFeatured({ id: projectId, featured: !featured })
    // Backend syncs in background
  }

  return <button onClick={handleClick}>...</button>
}
```

### Pattern 5: Progressive Enhancement for Forms
**What:** Forms work without JavaScript, enhanced with JS
**When:** Contact form (public-facing)
**Why:** Accessibility, resilience to JS errors

**Example:**
```typescript
// app/contact/page.tsx
import { api } from '@/convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'

export default function ContactPage() {
  async function submitForm(formData: FormData) {
    'use server'
    // Works even if JS fails
    await fetchMutation(api.contacts.create, {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    })
  }

  return <form action={submitForm}>...</form>
}
```

### Pattern 6: Compound Components for Complex UI
**What:** Split complex components into composable pieces
**When:** Project card, admin forms, navigation
**Why:** Reusability, testability, clarity

**Example:**
```typescript
// components/project-card.tsx
export function ProjectCard({ project }) {
  return (
    <div>
      <ProjectCard.Image src={project.screenshots[0]} />
      <ProjectCard.Title>{project.title}</ProjectCard.Title>
      <ProjectCard.Summary>{project.summary}</ProjectCard.Summary>
      <ProjectCard.Stack stack={project.stack} />
    </div>
  )
}

ProjectCard.Image = ({ src }) => <img src={src} />
ProjectCard.Title = ({ children }) => <h3>{children}</h3>
// etc.
```

### Pattern 7: Co-locate Related Code
**What:** Keep related code together (component + styles + tests)
**When:** Always
**Why:** Easier to find, modify, delete

**Example:**
```
components/
  project-card/
    index.tsx          # Main component
    project-card.test.tsx
    styles.module.css  # If not using Tailwind
    types.ts           # Component-specific types
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client Component for Static Content
**What:** Using 'use client' when Server Component would work
**Why bad:** Increases bundle size, slower initial load, worse SEO
**Instead:** Default to Server Component, add 'use client' only when needed

**Bad:**
```typescript
'use client'
export default function AboutPage() {
  return <div>Static content...</div>
}
```

**Good:**
```typescript
// No 'use client' needed
export default function AboutPage() {
  return <div>Static content...</div>
}
```

### Anti-Pattern 2: Fetching Data in Client Components
**What:** Using useEffect to fetch data that could be fetched server-side
**Why bad:** Waterfall loading (HTML → JS → Data), worse UX
**Instead:** Fetch in Server Component or use Convex reactive queries

**Bad:**
```typescript
'use client'
export default function ProjectsPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects)
  }, [])

  return <div>{projects.map(...)}</div>
}
```

**Good:**
```typescript
// Server Component
export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.listPublished)
  return <div>{projects.map(...)}</div>
}
```

### Anti-Pattern 3: Building REST API Routes
**What:** Creating `/api/*` route handlers when Convex handles backend
**Why bad:** Redundant layer, more code to maintain, no real-time
**Instead:** Use Convex server functions directly

**Bad:**
```typescript
// app/api/projects/route.ts
export async function GET() {
  const projects = await db.query('projects').collect()
  return Response.json(projects)
}

// Frontend
const res = await fetch('/api/projects')
const projects = await res.json()
```

**Good:**
```typescript
// convex/projects.ts
export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db.query('projects').collect()
  }
})

// Frontend (Server Component)
const projects = await fetchQuery(api.projects.listPublished)

// Frontend (Client Component)
const projects = useQuery(api.projects.listPublished)
```

### Anti-Pattern 4: Manual Session Management
**What:** Building custom auth logic when WorkOS handles it
**Why bad:** Security risks, maintenance burden, reinventing wheel
**Instead:** Use WorkOS middleware + session helpers

**Bad:**
```typescript
export async function GET(req: Request) {
  const token = req.cookies.get('auth_token')
  const user = await validateToken(token) // Manual validation
  if (!user) return Response.redirect('/login')
  // ...
}
```

**Good:**
```typescript
// middleware.ts handles auth automatically
export default authkitMiddleware({
  matcher: ['/admin/:path*']
})

// In protected route
import { getUser } from '@workos-inc/authkit-nextjs'

export default async function AdminPage() {
  const user = await getUser()
  // WorkOS guarantees user exists here
}
```

### Anti-Pattern 5: Prop Drilling Through Many Layers
**What:** Passing props through 4+ component levels
**Why bad:** Hard to refactor, easy to break, verbose
**Instead:** Use React Context for deeply nested state, or Convex queries at consumption point

**Bad:**
```typescript
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} /> {/* 4 levels deep */}
    </Sidebar>
  </Layout>
</App>
```

**Good:**
```typescript
// Create context
const UserContext = createContext()

// Provide at top
<UserContext.Provider value={user}>
  <App>...</App>
</UserContext.Provider>

// Consume at leaf
function UserMenu() {
  const user = useContext(UserContext)
}

// Or with Convex: fetch where needed
function UserMenu() {
  const user = useQuery(api.users.getCurrentUser)
}
```

### Anti-Pattern 6: Mixing Business Logic in Components
**What:** Complex logic directly in component render
**Why bad:** Hard to test, hard to reuse, messy code
**Instead:** Extract to utility functions or Convex server functions

**Bad:**
```typescript
export function ProjectList({ projects }) {
  return (
    <div>
      {projects
        .filter(p => p.status === 'published')
        .filter(p => !p.archived)
        .sort((a, b) => b.featured - a.featured)
        .map(p => <ProjectCard project={p} />)
      }
    </div>
  )
}
```

**Good:**
```typescript
// convex/projects.ts
export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('projects')
      .filter(q =>
        q.and(
          q.eq(q.field('status'), 'published'),
          q.eq(q.field('archived'), false)
        )
      )
      .order('desc')
      .collect()
  }
})

// Component
export function ProjectList() {
  const projects = useQuery(api.projects.listPublished)
  return <div>{projects?.map(p => <ProjectCard project={p} />)}</div>
}
```

### Anti-Pattern 7: Tight Coupling to Convex Schema
**What:** Using Convex types directly in UI components
**Why bad:** Schema changes break UI, hard to test
**Instead:** Define UI types separately, map Convex data to UI types

**Bad:**
```typescript
// Component directly depends on Convex schema
function ProjectCard({ project }: { project: Doc<'projects'> }) {
  return <div>{project.title}</div>
}
```

**Good:**
```typescript
// UI type
type ProjectCardProps = {
  title: string
  summary: string
  stack: string[]
}

// Map Convex to UI type
function ProjectCard({ project }: ProjectCardProps) {
  return <div>{project.title}</div>
}

// Parent component handles mapping
const projects = useQuery(api.projects.listPublished)
return projects?.map(p => (
  <ProjectCard
    key={p._id}
    title={p.title}
    summary={p.summary}
    stack={p.stack}
  />
))
```

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Database queries** | Convex free tier sufficient | Add indexes for common queries | Likely still fine (Convex scales automatically) |
| **Image hosting** | Next.js Image Optimization (Vercel) | Same (automatic WebP, caching) | Consider CDN for images (Vercel handles this) |
| **Contact form spam** | Honeypot + rate limit | Add reCAPTCHA if needed | May need more robust spam detection |
| **Admin concurrency** | Single admin (you) | Still single admin | If multi-admin, add optimistic locking |
| **Build time** | < 1 min | ISR for projects (don't rebuild all) | ISR + on-demand revalidation |
| **Bundle size** | Code splitting by route | Same + lazy load Framer Motion | Audit dependencies, remove unused |
| **Real-time connections** | Convex handles | Convex handles | Convex handles (WebSocket scaling automatic) |

**Key insight:** Portfolio sites don't scale like SaaS. You're not expecting millions of concurrent users. Standard Next.js + Convex patterns handle typical portfolio traffic with zero optimization.

**When to optimize:**
- Never for user count (portfolio won't have scaling issues)
- Always for load time (affects all users)
- When admin panel feels slow (add loading states, optimistic updates)

## Database Schema Design (Convex)

### Schema Structure
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  projects: defineTable({
    slug: v.string(),
    title: v.string(),
    summary: v.string(),
    content: v.string(), // Markdown or rich text
    stack: v.array(v.string()),
    tags: v.array(v.string()),
    screenshots: v.array(v.string()), // URLs or file IDs
    links: v.array(v.object({
      label: v.string(),
      url: v.string(),
    })),
    startDate: v.optional(v.string()), // ISO date
    endDate: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('published')),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_status', ['status'])
    .index('by_featured', ['featured', 'status']),

  resume: defineTable({
    highlights: v.array(v.string()),
    experience: v.array(v.object({
      company: v.string(),
      role: v.string(),
      startDate: v.string(),
      endDate: v.optional(v.string()),
      bullets: v.array(v.string()),
    })),
    education: v.array(v.object({
      institution: v.string(),
      degree: v.string(),
      field: v.string(),
      year: v.string(),
    })),
    skills: v.array(v.object({
      category: v.string(),
      items: v.array(v.string()),
    })),
    updatedAt: v.number(),
  }),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    status: v.union(v.literal('new'), v.literal('archived')),
    createdAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_email', ['email']),

  changelog: defineTable({
    date: v.number(),
    title: v.string(),
    summary: v.string(),
    prNumber: v.optional(v.number()),
    commitSha: v.optional(v.string()),
    type: v.union(
      v.literal('feature'),
      v.literal('fix'),
      v.literal('chore'),
      v.literal('content')
    ),
    visible: v.boolean(),
  })
    .index('by_date', ['date'])
    .index('by_visible', ['visible', 'date']),
})
```

**Key design decisions:**
- **Single resume document** (not multiple rows) - simplifies queries
- **Indexes on common filters** (status, featured, visible) - fast queries
- **Timestamps as numbers** (Unix epoch) - easier sorting, no timezone issues
- **Enum types with v.union** - type safety, prevents invalid data
- **Optional fields** - flexibility without null handling

## File Organization

```
portfolio/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Layout group for public pages
│   │   │   ├── layout.tsx            # Public layout (header, footer)
│   │   │   ├── page.tsx              # Home
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── resume/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Project index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Project detail
│   │   │   ├── stack/
│   │   │   │   └── page.tsx          # Stack/Automation page
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── admin/                    # Protected layout
│   │   │   ├── layout.tsx            # Admin layout (auth check)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Project list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── resume/
│   │   │   │   └── page.tsx
│   │   │   └── changelog/
│   │   │       └── page.tsx
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts          # WorkOS callback handler
│   │   ├── layout.tsx                # Root layout
│   │   ├── global.css                # Tailwind imports
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── animated/                 # Framer Motion wrappers
│   │   │   ├── page-transition.tsx
│   │   │   ├── scroll-reveal.tsx
│   │   │   └── hover-card.tsx
│   │   ├── forms/                    # react-hook-form forms
│   │   │   ├── project-form.tsx
│   │   │   ├── resume-form.tsx
│   │   │   └── contact-form.tsx
│   │   ├── project-card.tsx
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── lib/
│   │   ├── convex.ts                 # Convex client setup
│   │   ├── utils.ts                  # Helpers (clsx, date formatting)
│   │   └── validations.ts            # Zod schemas
│   └── types/
│       └── index.ts                  # Shared TypeScript types
├── convex/
│   ├── _generated/                   # Auto-generated by Convex
│   ├── schema.ts                     # Database schema
│   ├── projects.ts                   # Project queries/mutations
│   ├── resume.ts                     # Resume queries/mutations
│   ├── contacts.ts                   # Contact form mutations
│   ├── changelog.ts                  # Changelog queries
│   ├── auth.ts                       # Auth helpers
│   └── http.ts                       # HTTP endpoints (if needed)
├── public/
│   ├── projects/                     # Project images
│   │   ├── project-1/
│   │   │   ├── hero.jpg
│   │   │   └── screenshot-1.jpg
│   │   └── ...
│   ├── favicon.ico
│   └── robots.txt
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD (lint, typecheck, test)
├── middleware.ts                     # Auth middleware
├── convex.json                       # Convex config
├── next.config.mjs                   # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json
```

**Organization principles:**
- **Route-based folder structure** in `app/`
- **Layout groups** `(public)` for shared layouts without URL segment
- **Colocation** of related components (forms/, animated/)
- **Separation of concerns** (UI components, Convex logic, types)
- **Convex functions** mirror data model (projects.ts for projects table)

## Deployment Architecture

```
GitHub Repository
       │
       │ (Push to main)
       ▼
┌──────────────────┐
│  GitHub Actions  │
│  - Lint          │
│  - Typecheck     │
│  - Tests         │
│  - Build         │
└────────┬─────────┘
         │
         │ (On success)
         ▼
┌──────────────────────────┐
│  Vercel Build            │
│  1. npm install          │
│  2. npm run build        │
│  3. npx convex deploy    │ ◄─── Convex CLI deploys functions
│  4. Next.js static gen   │
└────────┬─────────────────┘
         │
         │ (Deploy to edge)
         ▼
┌──────────────────────────┐
│  Vercel Edge Network     │
│  - Global CDN            │
│  - HTTPS                 │
│  - Environment variables │
└────────┬─────────────────┘
         │
         │ (User request)
         ▼
    User Browser
```

**Key points:**
- **Convex deploys automatically** during Vercel build (via `npx convex deploy` in build script)
- **Environment variables** injected by Vercel (CONVEX_DEPLOYMENT, WORKOS_CLIENT_ID, etc.)
- **Preview deployments** get separate Convex dev deployments (or share production data, configurable)
- **GitHub Actions** run in parallel with Vercel (required checks)

## Sources

**Architecture patterns:**
- Next.js App Router patterns (verified: official Next.js docs, Jan 2026)
- Convex architecture (training data, verify at docs.convex.dev)
- WorkOS integration (training data, verify at workos.com/docs)
- Server/Client Component split (React 19 patterns, verified Jan 2026)

**Confidence:** HIGH for Next.js patterns (verified), MEDIUM for Convex/WorkOS specifics (training data)

**Verification needed:**
- Convex schema API (v validator syntax may have changed)
- WorkOS AuthKit middleware setup (API may differ)
- Current best practices for Convex + Next.js integration (2026)
