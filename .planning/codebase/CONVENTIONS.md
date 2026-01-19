# Coding Conventions

**Analysis Date:** 2026-01-18

## Project Status

**Note:** This is a greenfield project. Source code has not been implemented yet. These conventions represent the planned standards based on the tech stack (Next.js 14+, TypeScript, Tailwind CSS, Convex) and industry best practices for these technologies.

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `ProjectCard.tsx`, `AdminPanel.tsx`)
- Page routes: lowercase with kebab-case for multi-word (e.g., `page.tsx`, `[slug]/page.tsx`)
- Utilities/helpers: camelCase with `.ts` extension (e.g., `formatDate.ts`, `apiHelpers.ts`)
- Convex functions: camelCase with `.ts` extension (e.g., `getProjects.ts`, `createProject.ts`)
- Types/interfaces: PascalCase in `.ts` files or co-located (e.g., `types.ts`, `Project.types.ts`)

**Functions:**
- camelCase for all functions and methods (e.g., `fetchProjects`, `handleSubmit`, `validateEmail`)
- React components: PascalCase (e.g., `ProjectCard`, `ContactForm`)
- Convex queries: descriptive names (e.g., `query.getPublishedProjects`, `mutation.updateResume`)

**Variables:**
- camelCase for local variables and parameters (e.g., `projectSlug`, `isAuthenticated`, `userData`)
- UPPER_SNAKE_CASE for constants (e.g., `MAX_PROJECTS`, `API_TIMEOUT`)
- Descriptive names preferred over abbreviations

**Types:**
- PascalCase for interfaces and types (e.g., `Project`, `ResumeData`, `ContactSubmission`)
- Prefix with `I` optional but not required (modern TypeScript convention)
- Use `type` for unions/aliases, `interface` for object shapes

## Code Style

**Formatting:**
- Tool: Prettier (to be configured)
- Expected settings:
  - 2 spaces indentation
  - Single quotes for strings
  - Trailing commas in multi-line
  - Semi-colons required
  - 80-100 character line width

**Linting:**
- Tool: ESLint with Next.js recommended config
- Key rules (standard Next.js setup):
  - `@next/next/no-html-link-for-pages` - Use Next.js Link component
  - TypeScript strict mode enabled
  - No unused variables
  - Consistent imports ordering

## Import Organization

**Order:**
1. External packages (React, Next.js, third-party)
2. Internal absolute imports (components, utils)
3. Relative imports from parent/sibling directories
4. Style imports (if any CSS modules)
5. Type-only imports at the end

**Path Aliases:**
- `@/components/*` - UI components
- `@/lib/*` - Utility functions and helpers
- `@/app/*` - App Router pages and layouts
- `@/convex/*` - Convex backend functions
- `@/types/*` - Shared TypeScript types

**Example:**
```typescript
import { useState } from 'react';
import { useQuery } from 'convex/react';

import { ProjectCard } from '@/components/ProjectCard';
import { formatDate } from '@/lib/utils';

import { api } from '../convex/_generated/api';
import type { Project } from '@/types';
```

## Error Handling

**Patterns:**
- Use try-catch blocks for async operations and Convex mutations
- Return error objects from server functions rather than throwing when appropriate
- Display user-friendly error messages on frontend
- Log errors with context for debugging (avoid exposing internals to users)

**Convex mutations:**
```typescript
// Preferred pattern
export const createProject = mutation({
  handler: async (ctx, args) => {
    try {
      // Validate input
      if (!args.title) {
        throw new Error('Title is required');
      }

      // Perform operation
      const projectId = await ctx.db.insert('projects', args);
      return { success: true, projectId };
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error; // Re-throw for Convex error handling
    }
  }
});
```

**Frontend error boundaries:**
- Use Next.js error.tsx for route-level error handling
- Implement fallback UI for failed data fetches

## Logging

**Framework:** console (standard)

**Patterns:**
- `console.log()` for development debugging (remove before commit)
- `console.error()` for error conditions that need attention
- `console.warn()` for deprecated patterns or potential issues
- Avoid logging sensitive data (tokens, passwords, email addresses)
- Include context in logs (function name, operation type)

**Example:**
```typescript
console.error('[ProjectService] Failed to fetch project:', { slug, error: e.message });
```

## Comments

**When to Comment:**
- Complex business logic that isn't immediately obvious
- Workarounds or temporary solutions (mark with `// TODO:` or `// FIXME:`)
- Public API functions and exported utilities
- Non-obvious TypeScript type assertions
- Avoid commenting obvious code (let code be self-documenting)

**JSDoc/TSDoc:**
- Use for exported functions and React components with non-trivial props
- Include parameter descriptions and return types
- Document edge cases or important behavior

**Example:**
```typescript
/**
 * Filters projects by tags and publication status.
 *
 * @param projects - Array of all projects
 * @param tags - Tags to filter by (OR logic)
 * @param includesDrafts - Whether to include draft projects (admin only)
 * @returns Filtered project array
 */
export function filterProjects(
  projects: Project[],
  tags: string[],
  includeDrafts = false
): Project[] {
  // Implementation
}
```

## Function Design

**Size:**
- Keep functions focused on a single responsibility
- Aim for functions under 50 lines; refactor if exceeding 100 lines
- Extract complex logic into smaller helper functions

**Parameters:**
- Use object parameters for functions with more than 3 arguments
- Destructure parameters for clarity
- Provide default values where appropriate
- Use TypeScript to enforce required vs optional parameters

**Return Values:**
- Consistent return types (avoid mixed returns)
- Prefer explicit returns over implicit undefined
- Use discriminated unions for success/error states when appropriate

**Example:**
```typescript
// Good: object parameter with defaults
interface FetchProjectsOptions {
  includesDrafts?: boolean;
  tags?: string[];
  limit?: number;
}

async function fetchProjects({
  includeDrafts = false,
  tags = [],
  limit = 10
}: FetchProjectsOptions = {}) {
  // Implementation
}
```

## Module Design

**Exports:**
- Named exports preferred over default exports (better for refactoring)
- Exception: Next.js pages and layouts require default exports
- Export types alongside implementation when relevant

**Barrel Files:**
- Use `index.ts` for component directories to simplify imports
- Re-export from barrel files to create clean public APIs
- Example: `components/index.ts` exports all components

**Example structure:**
```typescript
// components/ProjectCard/ProjectCard.tsx
export function ProjectCard(props: ProjectCardProps) { }

// components/ProjectCard/index.ts
export { ProjectCard } from './ProjectCard';
export type { ProjectCardProps } from './ProjectCard';

// Usage elsewhere
import { ProjectCard } from '@/components/ProjectCard';
```

## React Patterns

**Component Structure:**
- Prefer function components with hooks
- Keep components pure when possible
- Extract complex state logic into custom hooks
- Use TypeScript for props validation

**State Management:**
- React useState for local component state
- Convex queries/mutations for server state
- Avoid prop drilling; use composition or context for deep trees

**Styling:**
- Tailwind utility classes for styling
- Use `className` with template literals for conditional styles
- Extract repeated patterns into reusable components
- Dark mode support via Tailwind dark: prefix

## Next.js App Router Patterns

**Server Components:**
- Default to Server Components for data fetching
- Use Client Components only when needed (interactivity, browser APIs)
- Mark Client Components with `'use client'` directive at top of file

**Data Fetching:**
- Use Convex `useQuery` hook in Client Components
- Use Convex `fetchQuery` in Server Components
- Handle loading states explicitly

**Routing:**
- File-based routing in `app/` directory
- Use route groups `(groupName)` for organization without URL impact
- Dynamic routes with `[param]` syntax

## Convex Patterns

**Schema Definition:**
- Define all tables in `convex/schema.ts`
- Use Convex validators for type safety
- Include indexes for frequently queried fields

**Queries vs Mutations:**
- Queries for read operations (cacheable, reactive)
- Mutations for write operations (transactional)
- Keep functions focused and composable

**Authentication:**
- Check `ctx.auth.getUserIdentity()` in protected mutations
- Return early if unauthorized
- Use allowlist for admin-only operations

## TypeScript Guidelines

**Strictness:**
- Enable TypeScript strict mode
- No implicit any
- Strict null checks enabled
- No unused locals/parameters

**Type Definitions:**
- Prefer interfaces for objects that may be extended
- Use types for unions, intersections, and utility types
- Co-locate types with usage when specific to one file
- Share common types in `@/types` directory

**Type Assertions:**
- Avoid `as any` - prefer proper typing
- Use type guards for narrowing
- Document non-obvious assertions with comments

## Performance Considerations

**React Performance:**
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to children with `useCallback`
- Avoid inline object/array creation in render
- Use React.memo for expensive pure components

**Next.js Optimization:**
- Use next/image for all images (automatic optimization)
- Lazy load below-the-fold content with dynamic imports
- Minimize client-side JavaScript bundle

**Convex Optimization:**
- Index frequently queried fields
- Paginate large result sets
- Avoid N+1 queries by batching

---

*Convention analysis: 2026-01-18*

*Note: These conventions will be refined as the codebase is implemented. This document represents planned standards based on the technology stack and best practices.*
