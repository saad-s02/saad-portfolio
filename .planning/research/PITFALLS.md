# Domain Pitfalls

**Domain:** Personal Portfolio Website with Admin Panel
**Researched:** 2026-01-18

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Infinite Changelog Loop
**What goes wrong:** Bot commits trigger changelog automation, which creates another commit, triggering automation again

**Why it happens:**
- GitHub Actions workflow triggers on all pushes to `main`
- Changelog update creates a commit
- That commit triggers the workflow again
- Loop continues indefinitely

**Consequences:**
- Rapid-fire commits (dozens per minute)
- GitHub Actions bill explosion
- Repository becomes unusable
- Rate limiting from GitHub

**Prevention:**
```yaml
# .github/workflows/changelog-update.yml
name: Update Changelog
on:
  push:
    branches: [main]
jobs:
  update:
    # Skip if commit message contains skip marker
    if: "!contains(github.event.head_commit.message, '[skip changelog]')"
    runs-on: ubuntu-latest
    steps:
      - name: Update changelog
        run: ./scripts/update-changelog.sh
      - name: Commit with skip marker
        run: |
          git add CHANGELOG.md
          git commit -m "Update changelog [skip changelog]"
          git push

# OR: Check if commit author is bot
if: "github.actor != 'github-actions[bot]'"
```

**Detection:**
- Check `git log` for rapid commits
- Monitor GitHub Actions usage
- Look for duplicate changelog entries

### Pitfall 2: Server Component Hydration Mismatch
**What goes wrong:** Next.js throws hydration errors when server-rendered HTML doesn't match client expectations

**Why it happens:**
- Rendering different content server vs client
- Using browser APIs (localStorage, window) in Server Components
- Dynamic data that changes between server render and hydration
- Date/time rendering without timezone handling

**Consequences:**
- Console errors in browser
- Visual flicker/flash of wrong content
- Broken interactivity
- Poor user experience

**Prevention:**
```typescript
// ❌ BAD: Using browser API in Server Component
export default function Header() {
  const theme = localStorage.getItem('theme') // Error: localStorage is not defined
  return <div className={theme}>...</div>
}

// ✅ GOOD: Use Client Component for browser APIs
'use client'
export function ThemeProvider() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
    }
    return 'dark'
  })
  return <ThemeContext.Provider value={theme}>...</ThemeContext.Provider>
}

// ❌ BAD: Date rendering without consistent timezone
export default function Footer() {
  return <div>© {new Date().getFullYear()}</div> // Different on server vs client
}

// ✅ GOOD: Use suppressHydrationWarning for time-sensitive content
export default function Footer() {
  return <div suppressHydrationWarning>© {new Date().getFullYear()}</div>
}
```

**Detection:**
- Console warnings about hydration mismatch
- Visual content flashing
- React DevTools warnings

### Pitfall 3: Auth Middleware Not Matching Admin Routes
**What goes wrong:** Admin routes are not protected, or protected routes are accidentally public

**Why it happens:**
- Middleware matcher pattern is wrong
- Typo in path pattern
- Not testing auth protection
- Adding new admin routes without updating middleware

**Consequences:**
- Security vulnerability (unauthorized access to admin panel)
- Broken auth flow (users can't access admin)
- Draft content exposed publicly

**Prevention:**
```typescript
// ❌ BAD: Matcher doesn't cover all admin routes
export const config = {
  matcher: ['/admin'] // Only matches /admin, not /admin/projects
}

// ✅ GOOD: Matcher covers all admin subroutes
export const config = {
  matcher: ['/admin/:path*'] // Matches /admin and all subroutes
}

// ✅ BETTER: Test auth protection
describe('Auth Middleware', () => {
  it('redirects unauthenticated users from admin routes', async () => {
    const res = await fetch('/admin/projects')
    expect(res.status).toBe(302) // Redirect to login
  })

  it('allows authenticated users to access admin', async () => {
    const res = await fetch('/admin/projects', {
      headers: { Cookie: validSessionCookie }
    })
    expect(res.status).toBe(200)
  })
})
```

**Detection:**
- Try accessing `/admin/*` routes without logging in
- Check middleware logs
- Inspect redirect behavior

### Pitfall 4: Convex Schema Changes Without Migrations
**What goes wrong:** Changing Convex schema breaks existing data or queries

**Why it happens:**
- Renaming fields without data migration
- Changing field types (string → array)
- Adding non-optional fields to tables with existing data
- Removing fields still used in queries

**Consequences:**
- Runtime errors in production
- Data corruption or loss
- Admin panel breaks
- Type errors not caught until runtime

**Prevention:**
```typescript
// ❌ BAD: Adding required field to existing table
export default defineSchema({
  projects: defineTable({
    title: v.string(),
    tags: v.array(v.string()), // NEW FIELD - existing rows don't have this!
  })
})

// ✅ GOOD: Make new fields optional
export default defineSchema({
  projects: defineTable({
    title: v.string(),
    tags: v.optional(v.array(v.string())), // Optional for backward compatibility
  })
})

// ✅ BETTER: Write migration script
// convex/migrations/001-add-tags.ts
import { internalMutation } from './_generated/server'

export default internalMutation(async (ctx) => {
  const projects = await ctx.db.query('projects').collect()
  for (const project of projects) {
    if (!project.tags) {
      await ctx.db.patch(project._id, { tags: [] })
    }
  }
})
```

**Detection:**
- TypeScript errors in queries/mutations
- Runtime errors: "field X is undefined"
- Missing data in admin panel

### Pitfall 5: Exposing Client Names or Sensitive Data
**What goes wrong:** Portfolio publicly displays confidential client information or metrics

**Why it happens:**
- Copy-pasting project descriptions from internal docs
- Not anonymizing screenshots
- Including client logos without permission
- Showing user counts, revenue, or other metrics under NDA

**Consequences:**
- Legal liability (NDA violations)
- Damaged professional reputation
- Client complaints or legal action
- Loss of future opportunities

**Prevention:**
```markdown
# ❌ BAD: Exposes client name and metrics
## Meditech Healthcare Platform
Built HIPAA-compliant patient portal for Meditech Corp.
Reduced claim processing time 40% (from 12 hours to 7 hours).
Serving 50,000 patients across 15 hospitals.

# ✅ GOOD: Anonymized
## Healthcare SaaS Platform
Built HIPAA-compliant patient portal for a healthcare technology company.
Reduced claim processing time 40% through workflow automation.
Platform serves enterprise-scale healthcare organization.
```

**Checklist before publishing:**
- [ ] No client company names
- [ ] No specific user counts or revenue
- [ ] Screenshots have sensitive data redacted
- [ ] No internal project codenames
- [ ] No proprietary architecture details
- [ ] Metrics are relative (%), not absolute numbers

**Detection:**
- Google your project descriptions
- Ask: "Would my client approve this?"
- Review NDAs and contracts

### Pitfall 6: Building Admin Panel Before Public Pages
**What goes wrong:** Spending weeks on CMS without anything to show visitors

**Why it happens:**
- "I need to manage content" mindset
- Treating portfolio like production SaaS
- Perfectionism about content workflow
- Ignoring that you're the only admin

**Consequences:**
- Wasted time building tools instead of content
- No public site to show recruiters
- Delayed launch
- Over-engineering for single-user use case

**Prevention:**
- **Build public pages first** (Home, About, Projects, Resume)
- **Hardcode initial content** (JSON files, markdown, or direct in components)
- **Launch with static content** (recruiters don't care if you have a CMS)
- **Build admin panel after** public pages are live and working

**Rule of thumb:** If you're the only admin, admin panel is a nice-to-have, not a must-have.

**Detection:**
- Weeks of work with no public URL
- "I'm still building the admin" after month 1
- Complex CRUD UI but empty public pages

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

### Pitfall 1: Over-Optimizing Images Too Early
**What goes wrong:** Spending hours on image optimization before confirming design

**Why it happens:**
- Reading performance best practices
- Wanting perfect Lighthouse scores
- Premature optimization

**Consequences:**
- Time spent optimizing images that get replaced
- Complexity before it's needed
- Delayed launch

**Prevention:**
- Use Next.js `<Image>` component (automatic optimization)
- Start with reasonable sizes (1200px wide for desktop)
- Optimize when Lighthouse reports actual problems
- Let Vercel/Next.js handle WebP conversion automatically

**When to optimize:**
- Lighthouse performance score < 80
- LCP > 2.5s
- Large images (>500KB) causing slow loads

### Pitfall 2: Treating Convex Like REST API
**What goes wrong:** Creating dozens of tiny query/mutation functions

**Why it happens:**
- REST API mental model
- Not leveraging Convex's query capabilities
- Fear of "fat" functions

**Consequences:**
- Network overhead (multiple round trips)
- Poor performance
- Hard to maintain

**Prevention:**
```typescript
// ❌ BAD: Too granular
export const getProjectTitle = query(...)
export const getProjectSummary = query(...)
export const getProjectStack = query(...)
export const getProjectTags = query(...)

// Client needs 4 network requests
const title = useQuery(api.projects.getProjectTitle, { id })
const summary = useQuery(api.projects.getProjectSummary, { id })
const stack = useQuery(api.projects.getProjectStack, { id })
const tags = useQuery(api.projects.getProjectTags, { id })

// ✅ GOOD: Single query
export const getProject = query({
  args: { id: v.id('projects') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  }
})

// Client needs 1 network request
const project = useQuery(api.projects.getProject, { id })
```

### Pitfall 3: Not Using TypeScript Strict Mode
**What goes wrong:** Runtime errors that TypeScript could have caught

**Why it happens:**
- Existing project wasn't strict
- Lazy about fixing type errors
- Using `any` everywhere

**Consequences:**
- Runtime errors in production
- Harder refactoring
- No autocomplete benefits

**Prevention:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true, // Extra safety
    "noImplicitAny": true
  }
}
```

**Fix gradually:**
- Enable strict mode
- Fix errors file by file
- Use `// @ts-expect-error` temporarily if needed

### Pitfall 4: Forgetting to Test Auth Edge Cases
**What goes wrong:** Auth breaks in unexpected scenarios

**Edge cases:**
- User logs out while on admin page
- Session expires during form fill
- Multiple tabs with different auth states
- Direct URL access to protected routes

**Consequences:**
- Broken admin panel
- Data loss (form submission fails)
- Confusing user experience

**Prevention:**
```typescript
// Test session expiration
export function ProjectEditor() {
  const updateProject = useMutation(api.projects.update)

  const handleSubmit = async (data) => {
    try {
      await updateProject(data)
    } catch (error) {
      if (error.message.includes('Unauthenticated')) {
        // Session expired
        alert('Your session expired. Please log in again.')
        window.location.href = '/login?return_to=' + window.location.pathname
      } else {
        throw error
      }
    }
  }
}
```

### Pitfall 5: Hardcoding Allowlist Emails in Code
**What goes wrong:** Need to redeploy to add/remove admin users

**Why it happens:**
- Not thinking about future changes
- Convenience of hardcoding

**Consequences:**
- Can't add admin without deployment
- Emergency access requires code change
- Secrets in git history

**Prevention:**
```typescript
// ❌ BAD: Hardcoded in code
const ADMIN_EMAILS = ['you@example.com']

// ✅ GOOD: Environment variable
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

// ✅ BETTER: Store in Convex (manageable via admin panel)
export const admins = defineTable({
  email: v.string(),
  role: v.union(v.literal('admin'), v.literal('viewer')),
})
```

### Pitfall 6: Not Handling Contact Form Spam
**What goes wrong:** Inbox flooded with spam submissions

**Why it happens:**
- Launching without spam protection
- Bots find form via sitemap/crawling

**Consequences:**
- Wasted time sorting spam
- Real inquiries buried
- Database fills with garbage

**Prevention (progressive layers):**
1. **Honeypot field** (catches simple bots) - LOW effort
2. **Rate limiting** (5 per email per day) - LOW effort
3. **reCAPTCHA** (if spam persists) - MEDIUM effort
4. **Email verification** (if critical) - HIGH effort

```typescript
// Honeypot pattern
export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    website: v.string(), // Honeypot (hidden field)
  },
  handler: async (ctx, args) => {
    // Bots fill all fields, humans skip hidden field
    if (args.website) {
      throw new Error('Spam detected')
    }

    // Rate limiting
    const recent = await ctx.db
      .query('contactSubmissions')
      .withIndex('by_email', q => q.eq('email', args.email))
      .filter(q => q.gt(q.field('createdAt'), Date.now() - 86400000)) // 24 hours
      .collect()

    if (recent.length >= 5) {
      throw new Error('Too many submissions. Try again tomorrow.')
    }

    // Store submission
    await ctx.db.insert('contactSubmissions', {
      name: args.name,
      email: args.email,
      message: args.message,
      status: 'new',
      createdAt: Date.now(),
    })
  }
})
```

### Pitfall 7: Poor Mobile Testing
**What goes wrong:** Site looks great on desktop, breaks on mobile

**Why it happens:**
- Developing on desktop only
- Not testing on real devices
- Assuming responsive CSS "just works"

**Consequences:**
- Broken layouts on mobile
- Recruiter views on phone, sees mess
- Lost opportunities

**Prevention:**
- Test on real iPhone and Android
- Use Chrome DevTools mobile emulation
- Test touch interactions (not just hover)
- Check font sizes (readable without zoom)

**Common mobile issues:**
- Horizontal scrolling
- Tiny text
- Buttons too small to tap
- Hover-only interactions

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### Pitfall 1: Missing Alt Text on Images
**What goes wrong:** Screen readers can't describe images

**Prevention:** Always add descriptive alt text
```tsx
<Image src="/project.jpg" alt="Dashboard showing analytics charts" />
```

### Pitfall 2: Forgetting Meta Tags
**What goes wrong:** Ugly social media previews

**Prevention:** Add OpenGraph tags to all pages
```typescript
export const metadata: Metadata = {
  title: 'Project Name | Your Name',
  description: 'Brief project description',
  openGraph: {
    title: 'Project Name',
    description: 'Brief project description',
    images: ['/project/hero.jpg'],
  },
}
```

### Pitfall 3: Dead Links
**What goes wrong:** GitHub repos or live demos go offline

**Prevention:**
- Regular link checking (quarterly)
- Archive demos if project ends
- Use Wayback Machine for archived sites

### Pitfall 4: Broken Dark Mode Contrast
**What goes wrong:** Text unreadable in dark theme

**Prevention:**
- Test all text colors on dark background
- Use Tailwind's dark: prefix
- Ensure contrast ratio ≥ 4.5:1

### Pitfall 5: No Loading States
**What goes wrong:** Blank page while data loads

**Prevention:**
```typescript
export default function Projects() {
  const projects = useQuery(api.projects.listPublished)

  if (projects === undefined) {
    return <ProjectsSkeleton />
  }

  return <ProjectList projects={projects} />
}
```

### Pitfall 6: Committing .env to Git
**What goes wrong:** Secrets leaked publicly

**Prevention:**
- Add `.env*` to `.gitignore`
- Use Vercel env vars for production
- Rotate secrets if accidentally committed

### Pitfall 7: Not Testing in Safari
**What goes wrong:** Works in Chrome, breaks in Safari

**Prevention:**
- Test on macOS Safari (or iOS Safari)
- Check for CSS compatibility
- Test animations and interactions

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Foundation setup** | Infinite Convex dev loop | Check convex.json, ensure single deployment |
| **Convex schema** | Breaking changes without migrations | Make new fields optional, write migrations |
| **Public pages** | Hydration mismatch | Don't use browser APIs in Server Components |
| **Auth integration** | Middleware not matching routes | Test auth protection, use `matcher: ['/admin/:path*']` |
| **Admin panel** | Building before public pages | Launch public pages first, admin is post-MVP |
| **Contact form** | Spam flood | Add honeypot + rate limiting from day 1 |
| **Animations** | Over-animating | Subtle is better, test on slow devices |
| **Automation** | Infinite changelog loop | Add skip markers or check commit author |
| **Deployment** | Secrets in code | Use environment variables, never hardcode |
| **Performance** | Premature optimization | Use Next.js defaults, optimize when Lighthouse reports issues |

## Testing Checklist

Before launching, test these scenarios:

### Auth
- [ ] Can log in with allowlisted email
- [ ] Cannot log in with non-allowlisted email
- [ ] Redirect to /admin after login
- [ ] Cannot access /admin without login
- [ ] Logout works, cannot access /admin after
- [ ] Session persists across browser refresh

### Admin Panel
- [ ] Can create new project
- [ ] Can edit existing project
- [ ] Can delete project (with confirmation)
- [ ] Can toggle draft/published
- [ ] Can toggle featured
- [ ] Changes reflect on public pages immediately

### Public Pages
- [ ] Home page loads
- [ ] Projects page shows only published projects
- [ ] Project detail pages load
- [ ] Resume page loads
- [ ] About page loads
- [ ] Contact form submits
- [ ] All links work

### Mobile
- [ ] Site looks good on iPhone
- [ ] Site looks good on Android
- [ ] No horizontal scrolling
- [ ] Text readable without zoom
- [ ] Buttons tappable

### Performance
- [ ] Lighthouse performance > 80
- [ ] LCP < 2.5s
- [ ] No hydration errors

### Security
- [ ] No secrets in git history
- [ ] Admin protected by auth
- [ ] Drafts not visible publicly
- [ ] Contact form has spam protection

## Sources

**Based on:**
- Common Next.js App Router pitfalls (training data + official docs)
- Convex integration challenges (training data)
- Auth middleware patterns (Next.js middleware docs)
- Portfolio-specific mistakes (domain knowledge)
- GitHub Actions automation pitfalls (CI/CD experience)

**Confidence:** MEDIUM-HIGH
- High confidence: Next.js, React, TypeScript pitfalls (well-documented)
- Medium confidence: Convex-specific pitfalls (training data, verify in production)
- High confidence: Security and auth pitfalls (established best practices)

**Verification needed:**
- Convex migration patterns (check latest docs)
- WorkOS email allowlist implementation (verify current API)
- Specific error messages from tools (may have changed in 2026)
