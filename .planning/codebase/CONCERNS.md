# Codebase Concerns

**Analysis Date:** 2026-01-18

## Project Status

**Current State:** Pre-implementation (planning phase only)
- Files: `automated-portfolio-prd.md`, `CLAUDE.md`, `README.md`
- No source code, dependencies, or infrastructure implemented yet
- Repository initialized with documentation only

## Implementation Risks to Mitigate

### Changelog Infinite Loop

**Risk:** Automated changelog updates triggering new PRs/commits that trigger more changelog updates
- Files: Future automation scripts in `.claude/commands/release-note`, GitHub Actions workflows
- Impact: Could create infinite loop of commits, exhaust CI/CD resources, spam repository
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Detect bot commits via commit message patterns (`[skip ci]`, `[bot]`, or specific author)
  - Skip changelog generation for commits that only modify `CHANGELOG.md` or changelog table
  - Add explicit guards in workflow: `if: !contains(github.event.head_commit.message, '[bot]')`
  - Test changelog automation thoroughly before enabling on `main` branch

### WorkOS AuthKit Email Allowlist Management

**Risk:** No clear strategy for managing admin email allowlist in production
- Files: Future `convex/auth.ts`, middleware files
- Impact: Could lock out legitimate admin or fail to block unauthorized access
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Store allowlist in Convex database table (not hardcoded)
  - Create initial admin bootstrap mechanism
  - Add audit logging for auth attempts
  - Document emergency access recovery procedure
  - Consider multi-factor authentication for production

### Draft Content Visibility Leaks

**Risk:** Draft projects accidentally exposed through API endpoints, RSS feeds, sitemaps, or search indexing
- Files: Future Convex queries, sitemap generation, API routes
- Impact: Confidential client work or incomplete projects become public
- Current mitigation: Documentation specifies "Draft projects never appear on public pages"
- Recommendations:
  - Default all Convex queries to filter `status === 'published'`
  - Add explicit `isDraft` checks in all public-facing queries
  - Exclude drafts from sitemap.xml generation
  - Add robots meta tag to draft preview pages
  - Create integration test verifying drafts never appear in public API responses

### Contact Form Spam/Abuse

**Risk:** Contact form vulnerable to spam bots and abuse without implemented protections
- Files: Future `app/contact/page.tsx`, Convex mutations for contact submissions
- Impact: Database filled with spam, potential DoS, email notification spam
- Current mitigation: PRD specifies "honeypot + rate limit"
- Recommendations:
  - Implement honeypot field (hidden input that bots will fill)
  - Rate limit by IP address (Convex has no native rate limiting - use external service or custom implementation)
  - Consider Cloudflare Turnstile or similar CAPTCHA for high-risk scenarios
  - Add submission size limits
  - Create admin panel for marking submissions as spam
  - Monitor submission patterns for abuse

### Sensitive Client Information Exposure

**Risk:** Project descriptions accidentally include client names, metrics, or confidential details
- Files: Future project content in Convex `projects` table
- Impact: Breach of confidentiality, potential legal issues, client trust damage
- Current mitigation: CLAUDE.md specifies "Projects must not reveal client names or confidential data"
- Recommendations:
  - Create content guidelines checklist for admin panel
  - Add warning banner when creating/editing projects
  - Use generic company size descriptors ("Fortune 500", "Series B startup") instead of names
  - Anonymize all metrics or use percentages/ratios
  - Review all project content before publishing
  - Consider content review workflow (draft → reviewed → published)

## Security Considerations

### Environment Variable Management

**Risk:** API keys and secrets not properly secured across environments
- Files: Future `.env.local`, `.env.production`, Vercel environment variables
- Impact: Leaked credentials, unauthorized access to Convex, WorkOS, or other services
- Current mitigation: PRD specifies "Secrets only in GitHub/Vercel secret stores"
- Recommendations:
  - Never commit `.env` files (add to `.gitignore`)
  - Use separate Convex deployments for dev/production
  - Rotate WorkOS keys periodically
  - Document all required environment variables in CLAUDE.md
  - Add validation on startup to check required env vars are present

### Admin Panel Authorization

**Risk:** Authorization checks missing or bypassable on admin routes/mutations
- Files: Future middleware, Convex mutations with admin checks
- Impact: Unauthorized users could modify content, delete projects, access submissions
- Current mitigation: Architecture specifies auth middleware for `/admin/*` routes
- Recommendations:
  - Implement defense in depth: check auth in both middleware AND Convex mutations
  - Never trust client-side authorization state
  - Create reusable `requireAdmin()` helper for Convex mutations
  - Add audit logging for all admin actions
  - Test authorization bypasses: direct API calls, URL manipulation, etc.

### Convex Query Injection

**Risk:** User input in search/filter functionality could exploit Convex query patterns
- Files: Future project search/filter Convex queries
- Impact: Unauthorized data access, performance degradation
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Sanitize all user input before using in queries
  - Use Convex's built-in query validators
  - Avoid dynamic query construction from user input
  - Implement query result pagination to prevent large result sets
  - Add query timeouts

## Performance Bottlenecks

### Framer Motion Animation Performance

**Risk:** Excessive animations causing jank on lower-end devices
- Files: Future page components with Framer Motion animations
- Impact: Poor mobile experience, increased bounce rate
- Current mitigation: PRD requires "smooth animations and fast load"
- Recommendations:
  - Use `will-change` CSS property sparingly
  - Prefer `transform` and `opacity` animations (GPU-accelerated)
  - Add `@media (prefers-reduced-motion)` support
  - Lazy load animations for below-the-fold content
  - Test on low-end Android devices
  - Consider disabling complex animations on mobile

### Image Loading and Optimization

**Risk:** Large project screenshots causing slow page loads
- Files: Future `app/projects/[slug]/page.tsx`, static assets
- Impact: Slow time-to-interactive, high bandwidth usage, poor Core Web Vitals
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Use Next.js Image component for automatic optimization
  - Implement responsive images with srcset
  - Use WebP format with fallbacks
  - Add lazy loading for images below fold
  - Compress images before upload (add to admin panel workflow)
  - Consider CDN for static assets
  - Set maximum image dimensions in admin panel

### Convex Query Over-fetching

**Risk:** Fetching all projects/changelog entries without pagination
- Files: Future Convex queries for project lists, changelog
- Impact: Slow queries, high database load, poor scalability
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Implement cursor-based pagination for all list queries
  - Add `take()` limits to queries (e.g., 20 items per page)
  - Use Convex indexes for frequently queried fields (tags, featured, status)
  - Cache expensive queries using React Query or similar
  - Monitor Convex function execution time

## Fragile Areas

### CI/CD Pipeline Dependencies

**Risk:** Automation workflow depends on multiple external services with potential failure points
- Files: Future GitHub Actions workflows, Vercel integration, Convex deploy
- Impact: Broken deployments, failed PR checks blocking merges, inconsistent state
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Make CI checks idempotent (can run multiple times safely)
  - Add retry logic for transient failures
  - Create manual fallback procedures for each automated step
  - Monitor CI success rates and failure patterns
  - Separate critical checks (tests, build) from nice-to-have (Claude review)
  - Document how to bypass automation in emergency

### Claude Review as Merge Gate

**Risk:** AI-based review could produce false negatives, block valid PRs, or fail unpredictably
- Files: Future `.claude/commands/review`, GitHub Actions workflow
- Impact: Development velocity blocked by automation, false confidence in approval
- Current mitigation: Architecture specifies Claude review as "required check"
- Recommendations:
  - Provide manual override mechanism for repository admins
  - Combine with traditional CI checks (lint, test, build must still pass)
  - Log all review decisions for debugging
  - Add timeout fallback (if review takes >10 minutes, require manual review)
  - Monitor false negative rate and adjust review criteria
  - Document criteria for when to override Claude review

### Convex Schema Migrations

**Risk:** No schema migration strategy for production database changes
- Files: Future `convex/schema.ts`
- Impact: Breaking changes could cause data loss or application crashes
- Current mitigation: None (not yet implemented)
- Recommendations:
  - Never remove fields (mark deprecated instead)
  - Add new fields as optional with defaults
  - Create migration scripts for data transformations
  - Test schema changes in Convex dev environment first
  - Maintain backward compatibility for at least one deploy cycle
  - Document schema change process

## Scaling Limits

### Contact Form Submissions Storage

**Risk:** Unbounded growth of contact submissions table
- Files: Future Convex `contactSubmissions` table
- Current capacity: 0 (not implemented)
- Limit: Convex free tier has storage limits
- Scaling path:
  - Implement auto-archiving after 90 days
  - Export submissions to external storage periodically
  - Add pagination to admin submissions view
  - Consider separate analytics database for long-term storage

### Project Screenshot Storage

**Risk:** Large media files stored in Convex or repository
- Files: Future project images
- Current capacity: 0 (not implemented)
- Limit: Convex file storage limits, Git repo size
- Scaling path:
  - Use external file storage (Cloudflare R2, S3, Vercel Blob)
  - Implement image compression pipeline
  - Store only thumbnails in Convex, full-size externally
  - Add CDN caching

### Changelog Table Growth

**Risk:** Every PR merge adds changelog entry indefinitely
- Files: Future Convex `changelog` table
- Current capacity: 0 (not implemented)
- Limit: Convex query performance degrades with large tables
- Scaling path:
  - Add pagination to changelog queries
  - Archive old entries (e.g., >1 year) to separate table
  - Implement `visible: false` for minor changes
  - Add changelog entry limits (e.g., 100 most recent)

## Dependencies at Risk

### No Dependencies Yet

**Status:** Project has no `package.json` or dependencies installed
- Risk: Will depend on multiple external packages (Next.js, Convex, WorkOS, Framer Motion, Tailwind)
- Impact: Version conflicts, security vulnerabilities, breaking changes
- Migration plan:
  - Lock versions in `package.json` with exact versions or `^` for minors
  - Add Dependabot for automated security updates
  - Test dependency updates in preview environment before production
  - Pin critical dependencies (auth, database) to specific versions
  - Document major version upgrade procedures

## Missing Critical Features

### No Error Monitoring/Observability

**Problem:** No production error tracking or monitoring planned
- Blocks: Debugging production issues, understanding user experience problems
- Recommendations:
  - Integrate Sentry or similar error tracking
  - Add Convex function execution logging
  - Implement client-side error boundaries
  - Set up Vercel Analytics or similar
  - Create alert thresholds for error rates

### No Backup/Disaster Recovery

**Problem:** No backup strategy for Convex database
- Blocks: Recovery from data loss, accidental deletions, schema mistakes
- Recommendations:
  - Document Convex backup/export procedures
  - Create scheduled exports of critical data (projects, resume)
  - Test restoration from backup
  - Add soft-delete for projects (status: archived instead of delete)
  - Version control for resume content (track changes)

### No Testing Strategy Defined

**Problem:** PRD mentions CI test checks but no testing approach specified
- Blocks: Confident refactoring, preventing regressions, validating automation
- Recommendations:
  - Define testing strategy (unit, integration, e2e)
  - Create tests for critical paths (auth, admin mutations, public queries)
  - Add Playwright or Cypress for e2e tests
  - Test automation workflows (changelog loop prevention)
  - Set minimum coverage thresholds

## Test Coverage Gaps

### Pre-Implementation Phase

**Status:** No tests exist yet
- What's not tested: Everything (no code implemented)
- Risk: Could launch with zero test coverage
- Priority: High

**Critical areas requiring tests:**
- Authentication flows (login, logout, session management)
- Authorization checks (admin-only mutations and routes)
- Draft content filtering (ensure never exposed publicly)
- Contact form validation and rate limiting
- Changelog generation (loop prevention)
- Convex schema validators
- Admin panel mutations (create, update, delete projects)

---

*Concerns audit: 2026-01-18*
