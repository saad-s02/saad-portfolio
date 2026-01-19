# External Integrations

**Analysis Date:** 2026-01-18

## APIs & External Services

**Backend Infrastructure:**
- Convex - Backend-as-a-service for database and server functions
  - SDK/Client: `convex` npm package
  - Auth: `CONVEX_DEPLOYMENT` and `CONVEX_DEPLOY_KEY` environment variables
  - Purpose: Database queries/mutations, server-side logic, real-time subscriptions

**Authentication:**
- WorkOS AuthKit - Authentication provider
  - SDK/Client: `@workos-inc/authkit-nextjs` (or similar WorkOS Next.js package)
  - Auth: WorkOS API key and client ID environment variables
  - Purpose: Admin-only authentication with email allowlist

**Automation:**
- GitHub API - For Claude Code automation workflows
  - SDK/Client: GitHub Actions, `gh` CLI
  - Auth: GitHub tokens (GITHUB_TOKEN)
  - Purpose: Issue-to-PR automation, PR review gate, auto-labeling, changelog generation

## Data Storage

**Databases:**
- Convex
  - Connection: Convex SDK with deployment URL
  - Client: Convex query/mutation functions
  - Tables: `projects`, `resume`, `changelog`, `contactSubmissions`

**File Storage:**
- Local filesystem (static files) - v1 approach for project screenshots
  - Location: Next.js public directory or static assets folder
  - Future consideration: External CDN or object storage

**Caching:**
- Next.js built-in caching (App Router cache)
- Convex automatic query caching

## Authentication & Identity

**Auth Provider:**
- WorkOS AuthKit
  - Implementation: Email-based authentication with allowlist
  - Protected routes: `/admin/*` via Next.js middleware
  - Session management: WorkOS session handling via AuthKit SDK

## Monitoring & Observability

**Error Tracking:**
- None specified in PRD (potential future addition)

**Logs:**
- Vercel deployment logs (production)
- Convex function logs (backend)
- Console logs (development)

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Platform: Vercel Cloud
  - Integration: GitHub repository connection
  - Preview deployments: Automatic for all PRs
  - Production deployment: Automatic on merge to `main`

**CI Pipeline:**
- GitHub Actions
  - Required checks: lint, typecheck, tests, build
  - Custom workflows: Claude author bot, Claude reviewer bot, auto-labeling, changelog generator
  - Branch protection: Requires CI pass + Claude review APPROVE verdict

**Backend Deployment:**
- Convex deploy
  - Integration: Convex CLI via Vercel build process
  - Environment variables: Convex deploy key in Vercel environment

## Environment Configuration

**Required env vars:**

**Convex:**
- `CONVEX_DEPLOYMENT` - Convex deployment URL
- `CONVEX_DEPLOY_KEY` - Deploy key for production deployment

**WorkOS:**
- `WORKOS_API_KEY` - WorkOS API authentication
- `WORKOS_CLIENT_ID` - WorkOS client identifier
- `ADMIN_EMAIL_ALLOWLIST` - Comma-separated list of allowed admin emails

**GitHub (for automation):**
- `GITHUB_TOKEN` - GitHub API access for automation workflows

**Secrets location:**
- Development: `.env.local` (gitignored)
- Production: Vercel environment variables (encrypted)
- GitHub Actions: GitHub repository secrets

## Webhooks & Callbacks

**Incoming:**
- GitHub webhooks (Issue opened, PR opened/synchronized) - Triggers Claude automation workflows
- WorkOS auth callbacks - OAuth flow redirect URIs

**Outgoing:**
- Contact form submissions - Stored in Convex `contactSubmissions` table (no external webhook)
- Potential future: Email notification service integration

## Rate Limiting & Spam Protection

**Contact Form:**
- Honeypot field (frontend)
- Rate limiting (Convex server function)
- No external service (implemented in-app)

## Automation Workflows

**Claude Code Integration:**
- GitHub Actions workflows in `.github/workflows/`
- Slash commands in `.claude/commands/`:
  - `/spec` - Issue to specification
  - `/implement` - Plan implementation
  - `/review` - PR review with verdict
  - `/release-note` - Changelog generation

**Triggers:**
- Issue opened with "Feature Request" form or `feature` label → Claude author bot
- PR opened/synchronized → Claude reviewer bot
- PR merged to `main` → Changelog updater + Vercel deploy

---

*Integration audit: 2026-01-18*
