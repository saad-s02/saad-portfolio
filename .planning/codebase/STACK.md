# Technology Stack

**Analysis Date:** 2026-01-18

## Languages

**Primary:**
- TypeScript - All application code (frontend and backend functions)

**Secondary:**
- None detected

## Runtime

**Environment:**
- Node.js (version to be determined based on Vercel + Convex compatibility)

**Package Manager:**
- npm
- Lockfile: package-lock.json (to be created during scaffolding)

## Frameworks

**Core:**
- Next.js 14+ (App Router) - Frontend framework and routing
- React 18+ - UI library (Next.js dependency)
- Tailwind CSS - Utility-first CSS framework
- Framer Motion - Animation library for page transitions, scroll reveals, and interactions

**Testing:**
- Testing framework not yet specified in PRD/CLAUDE.md

**Build/Dev:**
- Next.js built-in dev server and build system
- TypeScript compiler (tsc) - Type checking
- ESLint - Linting

## Key Dependencies

**Critical:**
- `next` - Core framework
- `react` and `react-dom` - UI rendering
- `typescript` - Language support
- `tailwindcss` - Styling framework
- `framer-motion` - Animation library
- `convex` - Backend SDK for database and server functions
- `@workos-inc/authkit-nextjs` (or similar WorkOS package) - Authentication

**Infrastructure:**
- Convex SDK - Database client and server function runtime
- WorkOS AuthKit - Authentication provider SDK

## Configuration

**Environment:**
- Environment variables configured via `.env.local` (local dev) and Vercel environment variables (production)
- Required variables:
  - Convex deployment URL and API keys
  - WorkOS AuthKit credentials
  - Email allowlist for admin access

**Build:**
- `next.config.js` or `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` or `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration (for Tailwind)
- `.eslintrc.json` or `eslint.config.js` - ESLint rules
- `convex.json` - Convex project configuration

## Platform Requirements

**Development:**
- Node.js (LTS version recommended)
- npm package manager
- Convex CLI (`npx convex`)

**Production:**
- Vercel deployment platform
- Convex cloud backend (managed service)

---

*Stack analysis: 2026-01-18*
