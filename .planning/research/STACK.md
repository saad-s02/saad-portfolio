# Technology Stack

**Project:** Personal Portfolio Website with Admin Panel
**Researched:** 2026-01-18
**Overall confidence:** HIGH (Core stack), MEDIUM (Supporting libraries)

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Next.js** | 16.x (App Router) | Full-stack React framework | Industry standard for portfolio sites in 2026. App Router provides server components, streaming, built-in caching, and excellent DX. Version 16.x is current stable (verified: 16.1.3 as of Jan 2026). |
| **React** | 19.x | UI library | React 19.x is current stable (verified: v19.2). Server Components, Suspense, and concurrent features are production-ready. |
| **TypeScript** | 5.x | Type safety | Essential for maintainability. Next.js has first-class TypeScript support with `typedRoutes` config for type-safe navigation. |
| **Node.js** | 20.x LTS | Runtime | Long-term support version compatible with all modern tooling. |

**Confidence:** HIGH - All versions verified via official documentation (Next.js docs, React.dev)

**Why App Router over Pages Router:**
- Server Components reduce client bundle size
- Built-in streaming and Suspense
- Nested layouts eliminate layout duplication
- Route handlers replace API routes with better patterns
- Future-proof (Pages Router in maintenance mode)

### Styling & Animation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Tailwind CSS** | 4.x | Utility-first CSS | Current version 4.1 (verified Jan 2026). V4 has zero-runtime, improved dark mode with system preference detection, seamless Vite/Next.js integration. Perfect for dark minimalist aesthetic. |
| **Framer Motion** | 11.x | Animation library | Industry standard for React animations. Provides page transitions, scroll-triggered reveals, gesture-based interactions, layout animations. Declarative API fits React mental model. |
| **clsx** | 2.x | Conditional classes | Tiny utility (1KB) for dynamic className composition with Tailwind. |

**Confidence:** HIGH (Tailwind verified), MEDIUM (Framer Motion version based on training data)

**Why Framer Motion over alternatives:**
- **vs CSS animations:** Declarative, JavaScript-based, easier to orchestrate complex sequences
- **vs GSAP:** Better React integration, smaller bundle, modern API
- **vs React Spring:** More intuitive API, better documentation, active development

**Dark mode strategy:**
- Tailwind v4's built-in dark mode with `dark:` prefix
- System preference detection via `prefers-color-scheme`
- Optional: `next-themes` for persistent user preference (adds 2KB, provides seamless SSR-safe theme switching)

### Database & Backend
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Convex** | Latest | Real-time database + server functions | Modern BaaS (Backend-as-a-Service) designed for TypeScript. Provides: reactive queries (real-time updates), server functions (backend logic), file storage, scheduled jobs, full-text search. Zero-config deployment, excellent DX, built-in optimistic updates. Ideal for portfolio sites where you want admin panel without building REST/GraphQL API. |

**Confidence:** MEDIUM - Convex is actively developed but less mainstream than Firebase/Supabase. Verify current version and features at docs.convex.dev.

**Why Convex over alternatives:**
- **vs Firebase:** Better TypeScript support, simpler data modeling, no NoSQL quirks
- **vs Supabase:** Simpler than full Postgres, better real-time story, less infrastructure overhead
- **vs Prisma + Vercel Postgres:** No ORM complexity, no migration management, instant reactivity
- **vs tRPC + Prisma:** Less boilerplate, no API layer needed, built-in real-time

**Convex advantages for portfolio sites:**
- Admin panel updates reflect immediately (reactive queries)
- No API routes needed (Convex functions are backend)
- Type-safe from database to frontend
- Built-in auth integration (works with WorkOS)
- Deployment integrated with Vercel (no separate backend host)

### Authentication
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **WorkOS AuthKit** | Latest | Authentication for admin panel | Enterprise-grade auth with email allowlist support. Provides: OAuth SSO, magic links, email/password, session management. Critical feature: can restrict access to specific email addresses (admin-only requirement). WorkOS handles auth UI, session tokens, and security. |

**Confidence:** MEDIUM - WorkOS is production-ready but verify email allowlist implementation in docs.

**Why WorkOS over alternatives:**
- **vs NextAuth/Auth.js:** More robust for production, better enterprise features, managed UI
- **vs Clerk:** Comparable, but WorkOS has stronger B2B/admin-only use case
- **vs Firebase Auth:** Better admin controls, email allowlist is first-class feature
- **vs Auth0:** Simpler pricing, better DX for Next.js

**Email allowlist implementation:**
- Configure allowed email domains/addresses in WorkOS dashboard
- Middleware checks session + email on `/admin/*` routes
- Convex server functions verify auth context before mutations

### Hosting & Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vercel** | N/A | Hosting & deployment | Built by Next.js creators, zero-config deployment, automatic preview environments for PRs, edge network for global performance. Integrated environment variables, analytics, and CI/CD. |

**Confidence:** HIGH - Verified via Vercel docs.

**Vercel advantages:**
- Push to `main` = automatic production deploy
- Every PR gets preview URL (crucial for Claude automation workflow)
- Edge network for fast global delivery
- Automatic HTTPS, custom domains
- Environment variables for Convex keys, WorkOS secrets
- Built-in Web Analytics and Speed Insights

**Deployment flow:**
1. GitHub push → Vercel build (Next.js + Convex deploy)
2. Convex functions deployed via Convex CLI in build step
3. Environment variables injected (CONVEX_DEPLOYMENT, WORKOS_CLIENT_ID, etc.)
4. Preview URL or production URL returned

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **react-hook-form** | 7.x | Form handling | Contact form, admin forms. Performant (uncontrolled), built-in validation, excellent TypeScript support. |
| **zod** | 3.x | Schema validation | Validate form inputs (client + server), enforce data types for Convex schemas. Works perfectly with react-hook-form via `@hookform/resolvers`. |
| **lucide-react** | 0.x | Icon library | Tree-shakable React icons. Modern, consistent design. Alternatives: heroicons, react-icons. |
| **next-themes** | 0.x | Theme management (optional) | If you want persistent dark/light toggle beyond system preference. Handles SSR flashing. 2KB overhead. |
| **date-fns** | 3.x | Date formatting | Format dates for changelog, project dates. Lighter than moment.js, more intuitive than native Intl. |
| **sharp** | 0.x | Image optimization | Auto-installed by Next.js for `next/image`. Handles WebP conversion, responsive images. |

**Confidence:** MEDIUM - Versions based on training data (Jan 2025 cutoff). Verify current versions on npm.

**Form handling pattern:**
```typescript
// Admin form with validation
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  stack: z.array(z.string()),
  featured: z.boolean(),
})

type ProjectForm = z.infer<typeof projectSchema>

function AdminProjectForm() {
  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await convexMutation(api.projects.create, data)
  })
}
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Framework** | Next.js 16 App Router | Remix | Next.js has better ecosystem, Vercel integration, more mature App Router. Remix is excellent but smaller community for portfolio sites. |
| **Framework** | Next.js 16 App Router | Astro | Astro is great for content-heavy sites, but lacks interactive admin panel story. No built-in server functions. |
| **Framework** | Next.js 16 App Router | Next.js Pages Router | App Router is the future. Server Components reduce bundle size. Layouts eliminate duplication. |
| **Backend** | Convex | Supabase | Supabase requires more setup (Postgres, RLS policies, auth config). Convex is simpler for portfolio scale. |
| **Backend** | Convex | Firebase | Firebase has NoSQL data modeling quirks, weaker TypeScript story. Convex is more modern. |
| **Backend** | Convex | tRPC + Prisma | Massive overkill. Requires API routes, ORM migrations, database hosting. Convex eliminates all this. |
| **Backend** | Convex | Contentful/Sanity CMS | Heavy CMS is overkill for 3-6 projects. Convex gives you custom admin panel. |
| **Auth** | WorkOS AuthKit | NextAuth (Auth.js) | NextAuth requires more configuration for email allowlist. WorkOS handles this natively. |
| **Auth** | WorkOS AuthKit | Clerk | Similar capability. WorkOS chosen per project spec. Clerk is valid alternative. |
| **Styling** | Tailwind CSS | CSS Modules | Tailwind is faster for building dark minimalist aesthetic. No naming decisions. |
| **Styling** | Tailwind CSS | Styled Components | CSS-in-JS has runtime cost. Tailwind is zero-runtime as of v4. |
| **Animation** | Framer Motion | GSAP | GSAP is powerful but heavier API. Framer Motion is more React-idiomatic. |
| **Animation** | Framer Motion | CSS transitions | CSS can't handle complex orchestration (page transitions, scroll reveals). Framer Motion is declarative. |
| **Hosting** | Vercel | Netlify | Vercel is built by Next.js team, has better Next.js integration, preview deployments are faster. |
| **Hosting** | Vercel | Cloudflare Pages | Cloudflare doesn't support full Next.js feature set (limited server functions). Vercel is gold standard. |

## Installation

```bash
# Initialize Next.js project with TypeScript
npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir --import-alias "@/*"

cd portfolio

# Core dependencies
npm install framer-motion convex @workos-inc/authkit-nextjs

# Form handling & validation
npm install react-hook-form @hookform/resolvers zod

# UI utilities
npm install clsx lucide-react date-fns

# Optional: Theme management
npm install next-themes

# Dev dependencies (included in create-next-app)
npm install -D @types/node @types/react @types/react-dom typescript eslint eslint-config-next

# Initialize Convex
npx convex dev
```

**Post-install configuration:**

1. **Tailwind config** (tailwind.config.ts):
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // or 'media' for system only
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom dark minimalist palette
    },
  },
  plugins: [],
}
export default config
```

2. **Convex setup**:
```bash
# Run Convex dev (creates convex/ directory)
npx convex dev

# Follow prompts to create Convex project
# Sets up convex.json, convex/schema.ts, .env.local with CONVEX_DEPLOYMENT
```

3. **WorkOS setup**:
- Create WorkOS account at workos.com
- Configure AuthKit application
- Set email allowlist in WorkOS dashboard
- Add env vars: `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`, `WORKOS_REDIRECT_URI`

4. **Environment variables** (.env.local):
```bash
# Convex
CONVEX_DEPLOYMENT=dev:... # auto-generated by convex dev
NEXT_PUBLIC_CONVEX_URL=https://... # auto-generated

# WorkOS
WORKOS_CLIENT_ID=client_...
WORKOS_API_KEY=sk_...
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback

# Production uses Vercel environment variables
```

## Architecture Patterns

### Server vs Client Components

**Default to Server Components** (Next.js App Router best practice):
- Project list pages → Server Component (static rendering)
- Project detail pages → Server Component (ISR or dynamic)
- Admin forms → Client Component (needs interactivity)
- Navigation → Server Component (links only)
- Animated sections → Client Component (Framer Motion)

**Rule of thumb:**
- Use Server Component unless you need: useState, useEffect, event handlers, browser APIs, or Framer Motion
- Convex queries work in both (Server = fetch at build/request, Client = real-time)

### Data Fetching Strategy

**Public pages (read-only):**
```typescript
// app/projects/page.tsx (Server Component)
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.listPublished)
  return <ProjectList projects={projects} />
}
```

**Admin pages (real-time):**
```typescript
// app/admin/projects/page.tsx (Client Component)
'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function AdminProjects() {
  const projects = useQuery(api.projects.listAll) // real-time
  const deleteProject = useMutation(api.projects.delete)

  // Updates reflected immediately via reactivity
}
```

### File Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public layout group
│   │   │   ├── page.tsx       # Home
│   │   │   ├── about/
│   │   │   ├── resume/
│   │   │   ├── projects/
│   │   │   ├── stack/
│   │   │   └── contact/
│   │   ├── admin/             # Protected layout
│   │   │   ├── layout.tsx     # Auth middleware
│   │   │   ├── projects/
│   │   │   ├── resume/
│   │   │   └── changelog/
│   │   ├── api/               # Route handlers (if needed)
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── animated/          # Framer Motion wrappers
│   │   └── forms/             # react-hook-form forms
│   └── lib/
│       ├── convex.ts          # Convex client setup
│       └── utils.ts           # Helpers
├── convex/
│   ├── schema.ts              # Database schema
│   ├── projects.ts            # Project queries/mutations
│   ├── resume.ts              # Resume queries/mutations
│   ├── changelog.ts           # Changelog queries
│   └── auth.ts                # Auth helpers
├── public/
│   └── projects/              # Project images
└── convex.json                # Convex config
```

## Performance Optimizations

### Image Optimization
```typescript
// Use next/image for all images
import Image from 'next/image'

<Image
  src="/projects/project-1/hero.jpg"
  alt="Project screenshot"
  width={1200}
  height={630}
  quality={90}
  priority={false} // true for above-fold images
  placeholder="blur" // requires blurDataURL
/>
```

**Sharp** (auto-installed by Next.js) handles:
- WebP/AVIF conversion
- Responsive srcset
- Lazy loading
- Blur placeholder generation

### Metadata & SEO
```typescript
// app/projects/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await fetchQuery(api.projects.getBySlug, { slug: params.slug })

  return {
    title: `${project.title} | Your Name`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.screenshots[0]],
    },
  }
}
```

### Animation Performance
```typescript
// Use transform and opacity for animations (GPU-accelerated)
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  // Avoid animating: width, height, top, left (triggers layout)
>
```

### Convex Query Optimization
```typescript
// Convex queries are reactive and cached
// Avoid over-fetching: use specific queries
export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('projects')
      .filter(q => q.eq(q.field('status'), 'published'))
      .order('desc')
      .take(100)
  }
})

// Indexes for fast queries (schema.ts)
defineSchema({
  projects: defineTable({
    // fields...
  }).index('by_status', ['status'])
    .index('by_featured', ['featured', 'status'])
})
```

## Development Workflow

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Convex dev (syncs schema, watches functions)
npx convex dev

# Open http://localhost:3000
# Changes hot-reload automatically
# Convex functions update on save
```

## CI/CD Integration

**Vercel deployment** (automatic on push to main):
1. Build Next.js app (`npm run build`)
2. Deploy Convex functions (`npx convex deploy`)
3. Deploy to Vercel edge network

**Required environment variables** (Vercel dashboard):
- `CONVEX_DEPLOYMENT` (production deployment URL)
- `NEXT_PUBLIC_CONVEX_URL` (public Convex API URL)
- `WORKOS_CLIENT_ID` (WorkOS client ID)
- `WORKOS_API_KEY` (WorkOS API key - secret)
- `WORKOS_REDIRECT_URI` (production callback URL)

**Preview deployments** (automatic on PR):
- Each PR gets unique URL: `portfolio-git-branch-name-username.vercel.app`
- Uses separate Convex dev deployment or production data (configurable)
- WorkOS callback URL must allow preview domains (use wildcard: `*.vercel.app`)

## Version Management

**Keep updated:**
- `npm outdated` to check for updates
- `npm update` for minor/patch updates
- Test major updates in separate branch

**Critical for security:**
- `next`, `react`, `react-dom` (framework updates)
- `@workos-inc/authkit-nextjs` (auth security patches)
- `convex` (backend updates)

**Update cadence:**
- Major versions: quarterly review (test thoroughly)
- Minor versions: monthly (usually safe)
- Patch versions: weekly (security fixes)

## Sources

### Verified (HIGH confidence):
- [Next.js Documentation](https://nextjs.org/docs) - Verified v16.1.3, App Router features, TypeScript integration (Jan 2026)
- [React Documentation](https://react.dev/) - Verified v19.2, Server Components, Suspense (Jan 2026)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Verified v4.1, dark mode, Vite integration (Jan 2026)
- [Vercel Documentation](https://vercel.com/docs) - Verified Next.js hosting, preview deployments, environment variables (Jan 2026)

### Unverified (MEDIUM confidence):
- Convex features and API - based on training data (Jan 2025), verify at [docs.convex.dev](https://docs.convex.dev)
- WorkOS AuthKit email allowlist - based on training data (Jan 2025), verify at [workos.com/docs](https://workos.com/docs)
- Framer Motion v11.x - based on training data (Jan 2025), verify at [www.framer.com/motion](https://www.framer.com/motion)
- Supporting library versions (react-hook-form, zod, etc.) - based on training data (Jan 2025), verify on npm

**Recommendation:** Before implementation, verify Convex, WorkOS, and Framer Motion current versions and feature set via official documentation.
