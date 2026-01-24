# Phase 6: SEO & Deployment - Research

**Researched:** 2026-01-24
**Domain:** Next.js 16 App Router SEO & Vercel Production Deployment
**Confidence:** HIGH

## Summary

Next.js 16 provides comprehensive built-in SEO capabilities through the Metadata API, eliminating the need for third-party libraries. The App Router uses file-based conventions (sitemap.ts, robots.ts, opengraph-image.tsx) and async `generateMetadata()` functions for dynamic metadata generation. All metadata exports work exclusively in Server Components and benefit from automatic fetch request memoization.

Vercel deployment for Next.js projects is zero-configuration for basic setup, with automatic HTTPS/SSL provisioning for custom domains, Git-triggered deployments, and preview URLs for pull requests. The critical integration point is Convex backend deployment via deploy keys: separate keys for Production and Preview environments ensure isolated backends per environment.

WorkOS AuthKit requires explicit redirect URI configuration per environment (production domain + preview deployment URLs), with CORS settings in the WorkOS Dashboard matching all deployment URLs.

**Primary recommendation:** Use Next.js built-in metadata APIs (not third-party SEO libraries), implement sitemap.ts and robots.ts using the MetadataRoute API, configure separate Convex deploy keys for production and preview environments, and override Vercel's build command to `npx convex deploy --cmd 'npm run build'` to ensure backend deploys before frontend.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js Metadata API | 16.1+ | SEO metadata, OG images, sitemap, robots | Built-in, zero dependencies, Server Component optimized |
| next/og | 16.1+ (built-in) | Dynamic OG image generation | Official ImageResponse API, supports JSX-style image creation |
| Vercel | Platform | Hosting, automatic deployments, preview URLs | Zero-config Next.js optimization, automatic HTTPS, edge network |
| Convex Deploy Keys | N/A | Backend deployment automation | Environment-isolated deployments, automatic preview backend creation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| MetadataRoute types | 16.1+ | Type-safe sitemap/robots generation | Always (included in next) |
| Vercel System Env Vars | N/A | Dynamic redirect URIs for WorkOS | Preview deployments with authentication |
| generateSitemaps() | 16.1+ | Multi-sitemap generation | Sites with >50k URLs (Google's limit) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Built-in Metadata API | next-seo library | Adds dependency, less type-safe, incompatible with App Router patterns |
| Built-in sitemap.ts | next-sitemap package | Extra build step, more configuration, less integrated |
| next/og | @vercel/og (deprecated) | @vercel/og is deprecated, next/og is the official replacement |
| Convex deploy keys | Manual backend deployment | No preview environment isolation, requires manual coordination |

**Installation:**
```bash
# No additional packages needed - all SEO features built into Next.js 16
# Deployment uses Vercel dashboard configuration + Convex CLI
npm install # Already includes next@16.1.3
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── layout.tsx                 # Root metadata (template, default title/description)
├── sitemap.ts                 # Dynamic sitemap generation from Convex data
├── robots.ts                  # Robots.txt with sitemap reference
├── opengraph-image.tsx        # Default OG image (optional)
├── page.tsx                   # Home page with static metadata export
├── about/
│   └── page.tsx              # Static metadata export
├── projects/
│   ├── page.tsx              # Projects index with metadata
│   └── [slug]/
│       ├── page.tsx          # generateMetadata + generateStaticParams
│       └── opengraph-image.tsx  # Dynamic OG images per project (optional)
└── contact/
    └── page.tsx              # Contact page metadata
```

### Pattern 1: Static Metadata (Non-Dynamic Pages)
**What:** Export const metadata object for pages with fixed content
**When to use:** Home, About, Contact, Stack - pages without dynamic route parameters
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my background, experience, and approach to software engineering',
  openGraph: {
    title: 'About',
    description: 'Learn about my background, experience, and approach to software engineering',
    type: 'website',
    url: 'https://yourdomain.com/about',
  },
  alternates: {
    canonical: 'https://yourdomain.com/about',
  },
}

export default function AboutPage() {
  // Page component
}
```

### Pattern 2: Dynamic Metadata (Route Parameters + External Data)
**What:** Async generateMetadata function fetching data for dynamic routes
**When to use:** Project detail pages ([slug]), any page needing metadata from database
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await fetchQuery(api.projects.getBySlug, { slug })

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      images: ['/og-image-fallback.png'], // Or dynamic OG image route
    },
    alternates: {
      canonical: `https://yourdomain.com/projects/${slug}`,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  // Convex fetch is automatically memoized - no duplicate calls
  const { slug } = await params
  const project = await fetchQuery(api.projects.getBySlug, { slug })
  // Render project...
}
```

### Pattern 3: Dynamic Sitemap from Database
**What:** sitemap.ts file exporting async function returning MetadataRoute.Sitemap
**When to use:** Always - include all public pages dynamically
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com'

  // Fetch all published projects from Convex
  const projects = await fetchQuery(api.projects.listPublished)

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stack`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project._creationTime),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages]
}
```

### Pattern 4: Robots.txt Configuration
**What:** robots.ts file defining crawl rules and sitemap reference
**When to use:** Always - prevent admin routes from indexing, reference sitemap
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/', '/api/'],
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

### Pattern 5: Convex + Vercel Build Integration
**What:** Override Vercel build command to deploy Convex before frontend build
**When to use:** Always when using Convex backend
**Configuration:**
```javascript
// Vercel Project Settings > Build & Development Settings > Build Command Override:
npx convex deploy --cmd 'npm run build'

// Environment Variables (Vercel Dashboard):
// Production:
CONVEX_DEPLOY_KEY=<production-deploy-key>  // Environment: Production only

// Preview:
CONVEX_DEPLOY_KEY=<preview-deploy-key>     // Environment: Preview only

// Result: CONVEX_URL is automatically set by Convex deploy based on environment
```

### Pattern 6: WorkOS Dynamic Redirect URI (Preview Deployments)
**What:** Use Vercel system environment variables for dynamic WorkOS redirect URIs
**When to use:** When preview deployments need authentication
**Example:**
```typescript
// middleware.ts or auth configuration
import { authkitMiddleware } from '@workos-inc/authkit-nextjs'

export default authkitMiddleware({
  redirectUri: process.env.VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI // Static production URI
    : `https://${process.env.VERCEL_URL}/auth/callback`, // Dynamic preview URI
})
```

### Anti-Patterns to Avoid

- **Mixing metadata export types:** Cannot export both `export const metadata` and `export async function generateMetadata` from same route segment. Choose one based on whether data is static or dynamic.

- **Using metadata in Client Components:** Metadata API only works in Server Components. If you need client interactivity, keep page as Server Component and move interactive parts to separate Client Components.

- **Assuming duplicate API calls:** Don't implement custom caching for `generateMetadata` and page component. Next.js automatically memoizes identical fetch requests across both functions.

- **Blocking assets in robots.txt:** Never disallow `/_next/` or `/static/` paths - this breaks your site's styling and functionality.

- **Forgetting canonical URLs:** Always set `alternates.canonical` to prevent duplicate content issues, especially for paginated or filtered views.

- **Using next-seo library:** The App Router's built-in Metadata API replaced next-seo. Using both causes conflicts and duplicate meta tags.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dynamic OG images | Canvas/image manipulation on server | next/og ImageResponse API | Supports JSX-style declarative syntax, handles fonts/encoding, automatically optimized |
| Sitemap generation | Custom XML builder with file writes | MetadataRoute.Sitemap type + sitemap.ts | Built-in route handler, automatic caching, type-safe, no build step needed |
| Environment-specific config | Custom env switching logic | Vercel system env vars (VERCEL_ENV, VERCEL_URL) | Automatically injected, reliable, works in all deployment contexts |
| Metadata deduplication | React.cache() wrapper | Native fetch() in Server Components | Next.js automatically deduplicates identical fetch requests across metadata/page/layouts |
| Preview backend isolation | Shared backend with feature flags | Convex preview deploy keys | Isolated database per branch, automatic cleanup, zero coordination needed |
| SEO metadata management | Custom <head> manipulation | Metadata API (metadata object / generateMetadata) | Type-safe, automatic merging, streaming-optimized, Server Component native |

**Key insight:** Next.js 16 App Router shifted SEO from "library problem" to "platform feature." Using third-party solutions adds complexity without benefits. The platform handles streaming metadata (for performance), automatic request deduplication, type safety, and optimal HTML structure.

## Common Pitfalls

### Pitfall 1: Metadata Shallow Merging Wipes Nested Objects
**What goes wrong:** Setting `openGraph.title` in a child route completely replaces parent's `openGraph` object, losing `openGraph.images` and other inherited fields.

**Why it happens:** Next.js uses shallow merge for metadata objects. Nested objects like `openGraph`, `twitter`, and `robots` are replaced entirely, not deeply merged.

**How to avoid:** Extract shared nested metadata into a separate variable and spread it in child routes:
```typescript
// app/shared-metadata.ts
export const baseOpenGraph = {
  images: ['/default-og-image.png'],
  siteName: 'Portfolio',
}

// app/projects/[slug]/page.tsx
export async function generateMetadata() {
  return {
    title: 'Project Title',
    openGraph: {
      ...baseOpenGraph,  // Inherit images and siteName
      title: 'Project Title',
      description: 'Project description',
    },
  }
}
```

**Warning signs:** Social media shares missing images after adding custom metadata to child routes.

### Pitfall 2: Environment Variables Not Redeploying After Changes
**What goes wrong:** Adding or changing environment variables in Vercel dashboard doesn't update deployed site until manual redeploy triggered.

**Why it happens:** Vercel builds capture environment variables at build time. Changing variables in dashboard doesn't automatically rebuild.

**How to avoid:** After adding/modifying environment variables in Vercel dashboard, trigger a new deployment via "Redeploy" button or pushing a commit. For critical variables like API keys during initial setup, set all variables BEFORE first deployment.

**Warning signs:** "Environment variable undefined" errors in production despite being set in Vercel dashboard.

### Pitfall 3: WorkOS Preview Deployment Authentication Failures
**What goes wrong:** Preview deployments fail authentication with "redirect_uri mismatch" errors despite correct production setup.

**Why it happens:** WorkOS requires explicit allowlist of redirect URIs. Each Vercel preview deployment gets unique URL (https://project-git-branch-team.vercel.app), but WorkOS redirect URI is configured for production domain only.

**How to avoid:**
- Use dynamic redirect URI based on `VERCEL_URL` system variable for preview environments
- In WorkOS Dashboard > Authentication > Sessions > CORS, add `*.vercel.app` pattern
- Configure `authkitMiddleware` to use `process.env.VERCEL_URL` when `VERCEL_ENV !== 'production'`

**Warning signs:** Auth works in production but fails in preview deployments with redirect URI errors.

### Pitfall 4: Convex Preview Deployments Using Production Database
**What goes wrong:** Preview deployments modify production Convex database instead of using isolated preview backend.

**Why it happens:** Only using production CONVEX_DEPLOY_KEY for all environments, or not overriding Vercel build command to run `npx convex deploy`.

**How to avoid:**
- Generate separate "Preview Deploy Key" in Convex Dashboard
- Add two CONVEX_DEPLOY_KEY variables in Vercel: one for Production environment, one for Preview environment
- Override build command to: `npx convex deploy --cmd 'npm run build'`
- Verify by checking Convex Dashboard after preview deployment - should see new deployment named after Git branch

**Warning signs:** Testing in preview deployments affects production data; Convex Dashboard shows only prod/dev deployments, no branch-named deployments.

### Pitfall 5: Missing Canonical URLs Causing Duplicate Content
**What goes wrong:** Search engines index multiple versions of same page (http vs https, with/without trailing slash, different query params), splitting ranking signals.

**Why it happens:** Not setting `alternates.canonical` in metadata, or setting it to relative URL instead of absolute.

**How to avoid:** Always set canonical URL in metadata using absolute URL:
```typescript
export const metadata = {
  alternates: {
    canonical: 'https://yourdomain.com/projects', // Absolute URL
  },
}
```

**Warning signs:** Google Search Console shows "Duplicate, submitted URL not selected as canonical" warnings.

### Pitfall 6: Forgetting `await params` in generateMetadata
**What goes wrong:** Metadata shows "Project Not Found" or undefined values for all dynamic routes, even valid ones.

**Why it happens:** Next.js 15+ changed params from object to Promise. Not awaiting params before accessing properties returns undefined.

**How to avoid:** Always destructure params with await at the start of generateMetadata:
```typescript
export async function generateMetadata({ params }: Props) {
  const { slug } = await params // Must await!
  const project = await fetchQuery(api.projects.getBySlug, { slug })
  // ...
}
```

**Warning signs:** Dynamic route pages render correctly but all have same generic metadata; params.slug is undefined in generateMetadata.

### Pitfall 7: Blocking Too Much in robots.txt
**What goes wrong:** Site styling breaks, images don't load, or JavaScript fails - but only for search engine crawlers.

**Why it happens:** Over-aggressive robots.txt disallow rules blocking `/_next/`, `/static/`, or other asset paths that Googlebot needs to render page properly.

**How to avoid:** Only disallow actual non-public routes (admin, auth, API). Never block:
- `/_next/` (Next.js assets)
- `/static/` or `/public/` (static files)
- `/api/` that serves public data (only block admin APIs)

```typescript
// Good robots.txt configuration
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/'], // Only block truly private routes
    },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

**Warning signs:** Google Search Console shows "Page is not mobile-friendly" despite site working fine in browser; Googlebot screenshots show unstyled page.

### Pitfall 8: Sitemap Exceeding 50,000 URLs
**What goes wrong:** Google ignores sitemap or only partially indexes site when sitemap has too many URLs.

**Why it happens:** Google's limit is 50,000 URLs per sitemap file. Exceeding this makes sitemap non-compliant.

**How to avoid:** Use `generateSitemaps()` for sites with >50k pages:
```typescript
export async function generateSitemaps() {
  const totalProjects = await fetchQuery(api.projects.count)
  const sitemapsNeeded = Math.ceil(totalProjects / 50000)
  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const projects = await fetchQuery(api.projects.listPublished, { start, limit: 50000 })
  return projects.map(project => ({
    url: `https://yourdomain.com/projects/${project.slug}`,
    lastModified: new Date(project._creationTime),
  }))
}
```

**Warning signs:** Sitemap submission in Google Search Console shows warnings about size; only portion of pages getting indexed.

## Code Examples

Verified patterns from official sources:

### Complete Metadata Implementation (Root Layout)
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Portfolio', // Page titles will be "About | Portfolio", etc.
    default: 'Portfolio', // Fallback when page doesn't set title
  },
  description: 'Personal portfolio showcasing projects and engineering automation',
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Portfolio',
    images: ['/og-image-default.png'], // 1200x630px default OG image
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Dynamic Metadata with Error Handling
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/projects/[slug]/page.tsx
import type { Metadata } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await fetchQuery(api.projects.listPublished)
  return projects.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await fetchQuery(api.projects.getBySlug, { slug })

  if (!project) {
    return {
      title: 'Project Not Found',
      robots: { index: false }, // Don't index 404 pages
    }
  }

  const baseUrl = 'https://yourdomain.com'

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      url: `${baseUrl}/projects/${slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(project.title)}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await fetchQuery(api.projects.getBySlug, { slug })

  if (!project) notFound()

  return <article>{/* Project content */}</article>
}
```

### Production-Ready Sitemap with Error Handling
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const dynamic = 'force-dynamic' // Regenerate on every request
export const revalidate = 3600 // Or cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  try {
    const projects = await fetchQuery(api.projects.listPublished)

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/resume`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/stack`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      },
    ]

    const projectPages: MetadataRoute.Sitemap = projects.map(project => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project._creationTime),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...projectPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return minimal sitemap on error - better than failing build
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
      },
    ]
  }
}
```

### Robots.txt with Multiple User Agents
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: ['/admin/', '/auth/'],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Dynamic OG Image Generation (Optional Advanced Feature)
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
// app/projects/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const runtime = 'edge'
export const alt = 'Project'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await fetchQuery(api.projects.getBySlug, { slug })

  if (!project) {
    return new ImageResponse(
      (
        <div style={{ fontSize: 64, background: 'black', color: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Project Not Found
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.7 }}>Projects</div>
        <div style={{ fontSize: 72, fontWeight: 'bold', lineHeight: 1.2 }}>{project.title}</div>
        {project.stack.length > 0 && (
          <div style={{ fontSize: 32, marginTop: 40, display: 'flex', gap: 16 }}>
            {project.stack.slice(0, 4).map((tech: string) => (
              <span key={tech} style={{ background: '#333', padding: '8px 16px', borderRadius: 8 }}>
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-seo library | Built-in Metadata API | Next.js 13 (App Router) | Zero dependencies, better type safety, Server Component native |
| Pages Router Head component | Metadata exports in Server Components | Next.js 13+ | Streaming metadata support, no client bundle size impact |
| @vercel/og | next/og (built-in) | Next.js 13.3+ | Simplified imports, better integration, no extra package |
| Manual sitemap.xml files | sitemap.ts with MetadataRoute API | Next.js 13.3+ | Dynamic generation from database, no build step |
| Manual robots.txt files | robots.ts with MetadataRoute API | Next.js 13.3+ | Type-safe, can use environment variables |
| Static metadata + client fetch | generateMetadata with automatic memoization | Next.js 13+ | Single fetch for both metadata and page rendering |
| Vercel Secrets CLI | Vercel Dashboard environment variables | 2020+ | Better UX, automatic encryption, team management |
| Manual Convex backend switching | Convex preview deploy keys | 2023+ | Automatic branch-based backend isolation |
| Generic viewport meta tags | viewport configuration object (separate from metadata) | Next.js 14 | themeColor/colorScheme deprecated from metadata |

**Deprecated/outdated:**
- **next-seo library**: Incompatible with App Router, causes duplicate meta tags, no longer maintained for App Router patterns
- **@vercel/og**: Deprecated in favor of built-in next/og
- **Manual Head manipulation**: Using `<Head>` component or direct meta tags instead of Metadata API loses streaming benefits and SSR optimization
- **metadata.themeColor and metadata.colorScheme**: Moved to separate viewport export in Next.js 14+
- **Vercel secrets CLI**: Still works but deprecated in favor of dashboard environment variable management

## Open Questions

Things that couldn't be fully resolved:

1. **Custom Domain Setup Timeline**
   - What we know: Vercel auto-provisions SSL certificates after DNS verification; process typically takes 5-60 minutes
   - What's unclear: Exact domain registrar for this project; whether domain already exists or needs purchase
   - Recommendation: Defer domain configuration to post-v1 deployment phase; initial deploy uses Vercel-provided domain (https://project-name.vercel.app); custom domain addition is non-destructive change requiring only DNS configuration

2. **OpenGraph Image Strategy**
   - What we know: Can use static image (simpler, faster builds) OR dynamic opengraph-image.tsx per route (personalized, larger bundle)
   - What's unclear: Whether project detail pages should have unique OG images or share single branded image
   - Recommendation: Start with single static OG image in app/opengraph-image.png (1200x630px, dark theme); if analytics show high social sharing rates, upgrade to dynamic per-project OG images in Phase 7+

3. **Sitemap Caching Strategy**
   - What we know: sitemap.ts is cached by default; can force dynamic with `export const dynamic = 'force-dynamic'` or set revalidate interval
   - What's unclear: Expected project publication frequency and whether sitemap staleness matters for SEO
   - Recommendation: Set `export const revalidate = 3600` (1 hour cache) as balance between freshness and performance; Google typically recrawls sitemaps every few days anyway, so perfect freshness unnecessary

4. **Vercel Build Command for Initial Setup**
   - What we know: Production requires build command override to `npx convex deploy --cmd 'npm run build'`
   - What's unclear: Whether Vercel's automatic Next.js detection will work correctly on first push before environment variables are set
   - Recommendation: First deployment will fail - this is expected. Process: (1) Push to main, (2) wait for initial failed deploy, (3) add CONVEX_DEPLOY_KEY environment variable, (4) override build command, (5) redeploy. Document this in deployment runbook.

5. **WorkOS CORS Configuration for Preview Deployments**
   - What we know: WorkOS Dashboard requires CORS allowlist; preview deployments use *.vercel.app URLs
   - What's unclear: Whether WorkOS supports wildcard CORS patterns or requires explicit URL per preview deployment
   - Recommendation: Test with single preview deployment first; if wildcard not supported, may need to make admin panel unavailable in preview deployments (public pages only) or manually add preview URLs to WorkOS Dashboard per PR

## Sources

### Primary (HIGH confidence)
- [Next.js generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Complete metadata function documentation
- [Next.js Sitemap API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Sitemap generation patterns
- [Next.js Robots.txt API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - Robots.txt configuration
- [Convex Vercel Integration Guide](https://docs.convex.dev/production/hosting/vercel) - Official Vercel deployment setup
- [Next.js OpenGraph Image API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - Dynamic OG image generation
- [Convex Preview Deployments](https://docs.convex.dev/production/hosting/preview-deployments) - Preview environment isolation

### Secondary (MEDIUM confidence)
- [Vercel Custom Domain Configuration](https://vercel.com/docs/domains/working-with-domains/add-a-domain) - Domain setup process
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) - Environment configuration best practices
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/environments) - Automatic preview URL generation
- [Next.js SEO Best Practices 2026](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16) - Common mistakes and patterns
- [Next.js Metadata Guide 2025](https://www.boar.is/p/nextjs-metadata) - Comprehensive metadata patterns
- [WorkOS AuthKit Next.js Integration](https://github.com/workos/authkit-nextjs/issues/103) - Preview deployment strategies

### Tertiary (LOW confidence - marked for validation)
- OpenGraph image size recommendations (1200x630px) - Verified across multiple sources but not from official Next.js docs
- Google sitemap 50k URL limit - Industry standard but not explicitly documented in Next.js docs
- changeFrequency and priority ignored by Google - Community consensus but may not apply to all search engines

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations from official Next.js 16 and Convex documentation
- Architecture: HIGH - Patterns verified in Next.js App Router official docs and project's existing code
- Pitfalls: MEDIUM-HIGH - Mix of official documentation warnings and verified community issues (GitHub discussions, Stack Overflow with official responses)
- Deployment setup: HIGH - Convex and Vercel official integration guides
- WorkOS integration: MEDIUM - Based on official docs but preview deployment patterns less documented

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days) - Next.js and Vercel are stable; re-validate if Next.js 17 releases or Convex changes preview deployment model
