# Testing Patterns

**Analysis Date:** 2026-01-18

## Project Status

**Note:** This is a greenfield project. Tests have not been written yet. These patterns represent the planned testing strategy based on the tech stack (Next.js 14+, TypeScript, Convex) and modern testing best practices.

## Test Framework

**Runner:**
- Jest (recommended for Next.js projects)
- Config: `jest.config.js` or `jest.config.ts` (to be created)
- Integration with Next.js: `@testing-library/react` + `@testing-library/jest-dom`

**Assertion Library:**
- Jest built-in assertions (`expect`)
- `@testing-library/jest-dom` for DOM matchers

**Run Commands:**
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
npm run typecheck     # TypeScript validation (supplement to tests)
```

## Test File Organization

**Location:**
- Co-located with source files (recommended pattern for Next.js)
- Test files adjacent to implementation files

**Naming:**
- Pattern: `{filename}.test.ts` or `{filename}.test.tsx`
- Examples:
  - `ProjectCard.test.tsx` (component tests)
  - `formatDate.test.ts` (utility tests)
  - `getProjects.test.ts` (Convex function tests)

**Structure:**
```
src/
├── components/
│   ├── ProjectCard/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectCard.test.tsx
│   │   └── index.ts
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
convex/
├── projects.ts
└── projects.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    title: 'Test Project',
    summary: 'A test project',
    stack: ['Next.js', 'TypeScript'],
    slug: 'test-project',
  };

  describe('rendering', () => {
    it('displays project title', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('shows stack tags', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('navigates to project detail on click', () => {
      // Test implementation
    });
  });
});
```

**Patterns:**
- Group related tests with nested `describe()` blocks
- Use descriptive test names that explain expected behavior
- Arrange-Act-Assert pattern within tests
- One assertion focus per test when possible

## Mocking

**Framework:** Jest built-in mocking

**Patterns:**
```typescript
// Mocking Convex queries
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Example usage in test
import { useQuery } from 'convex/react';

beforeEach(() => {
  (useQuery as jest.Mock).mockReturnValue({
    data: mockProjects,
    isLoading: false,
  });
});
```

```typescript
// Mocking Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
}));
```

```typescript
// Mocking utility functions
jest.mock('@/lib/utils', () => ({
  formatDate: jest.fn((date) => '2026-01-18'),
}));
```

**What to Mock:**
- External API calls (Convex queries/mutations during component tests)
- Next.js router and navigation
- Browser APIs (localStorage, fetch)
- Date/time functions for deterministic tests
- Third-party services (WorkOS auth, external APIs)

**What NOT to Mock:**
- Pure utility functions (test them directly)
- Simple React components (use real implementations)
- Type definitions
- Constants and configuration

## Fixtures and Factories

**Test Data:**
```typescript
// __fixtures__/projects.ts
export const mockProject = {
  _id: 'test-id-1',
  _creationTime: Date.now(),
  slug: 'test-project',
  title: 'Test Project',
  summary: 'A test project summary',
  stack: ['Next.js', 'TypeScript'],
  tags: ['web', 'frontend'],
  status: 'published' as const,
  featured: false,
  content: 'Project content here',
  startDate: '2026-01-01',
  endDate: null,
  links: [
    { label: 'GitHub', url: 'https://github.com/test/repo' }
  ],
  screenshots: [],
  updatedAt: Date.now(),
};

export const createMockProject = (overrides?: Partial<typeof mockProject>) => ({
  ...mockProject,
  ...overrides,
});
```

**Factory Pattern:**
```typescript
// Test factories for creating varied test data
export function buildProject(overrides = {}) {
  return {
    _id: `project-${Math.random()}`,
    slug: 'test-project',
    title: 'Test Project',
    status: 'published',
    ...overrides,
  };
}
```

**Location:**
- `__fixtures__/` directory at package root or within test directories
- Co-located with test files for specific fixtures

## Coverage

**Requirements:**
- Target: 80% coverage for critical paths
- Enforce minimum coverage in CI (to be configured)

**View Coverage:**
```bash
npm test -- --coverage
# Opens HTML report in coverage/lcov-report/index.html
```

**Coverage Focus Areas:**
- All Convex mutations (data integrity critical)
- Authentication/authorization logic
- Form validation and submission
- Utility functions with complex logic
- Error handling paths

## Test Types

**Unit Tests:**
- Scope: Individual functions, components in isolation
- Approach: Mock all dependencies
- Example files:
  - `lib/formatDate.test.ts` - Pure utility functions
  - `components/ProjectCard.test.tsx` - Component rendering
  - `convex/projects.test.ts` - Convex query/mutation logic

**Integration Tests:**
- Scope: Multiple components working together, or Convex queries with database
- Approach: Minimal mocking, test interactions between units
- Example scenarios:
  - Contact form submission flow (form component → validation → Convex mutation)
  - Admin panel project creation (form → mutation → query refetch)
  - Authentication flow (WorkOS → middleware → protected route)

**E2E Tests:**
- Framework: Playwright (recommended for Next.js)
- Scope: Critical user journeys
- Example scenarios:
  - Visitor views homepage and navigates to project detail
  - Admin logs in, creates draft project, publishes it
  - Contact form submission and spam protection

**E2E Test Setup (to be implemented):**
```bash
npm install -D @playwright/test
npx playwright install
```

**E2E Test Pattern:**
```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('visitor can view featured projects', async ({ page }) => {
  await page.goto('/');

  // Check hero section
  await expect(page.locator('h1')).toContainText('Saad');

  // Check featured projects
  const projects = page.locator('[data-testid="featured-project"]');
  await expect(projects).toHaveCount(3);
});
```

## Common Patterns

**Async Testing:**
```typescript
// Testing async operations with React Testing Library
import { render, screen, waitFor } from '@testing-library/react';

it('loads and displays projects', async () => {
  render(<ProjectList />);

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  // Assert on loaded content
  expect(screen.getByText('Test Project')).toBeInTheDocument();
});
```

```typescript
// Testing Convex mutations
it('creates project successfully', async () => {
  const mutation = jest.fn().mockResolvedValue({ success: true });

  await act(async () => {
    await mutation({ title: 'New Project' });
  });

  expect(mutation).toHaveBeenCalledWith({ title: 'New Project' });
});
```

**Error Testing:**
```typescript
// Testing error states
it('displays error message on failed submission', async () => {
  const mockMutation = jest.fn().mockRejectedValue(
    new Error('Network error')
  );

  render(<ContactForm submitFn={mockMutation} />);

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

```typescript
// Testing error boundaries
import { ErrorBoundary } from '@/components/ErrorBoundary';

it('catches and displays errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

**User Interaction Testing:**
```typescript
import userEvent from '@testing-library/user-event';

it('filters projects by tag', async () => {
  const user = userEvent.setup();
  render(<ProjectFilter />);

  const tagButton = screen.getByRole('button', { name: /frontend/i });
  await user.click(tagButton);

  expect(screen.getByText('Filter: frontend')).toBeInTheDocument();
});
```

**Component Snapshot Testing:**
```typescript
// Use sparingly - snapshots are fragile
it('matches snapshot', () => {
  const { container } = render(<ProjectCard project={mockProject} />);
  expect(container.firstChild).toMatchSnapshot();
});
```

## Testing Convex Functions

**Convex Query Testing:**
```typescript
// convex/projects.test.ts
import { query } from './_generated/server';
import { getPublishedProjects } from './projects';

// Mock Convex context
const mockCtx = {
  db: {
    query: jest.fn(),
  },
  auth: {
    getUserIdentity: jest.fn(),
  },
};

describe('getPublishedProjects', () => {
  it('returns only published projects', async () => {
    const mockProjects = [
      { ...mockProject, status: 'published' },
      { ...mockProject, status: 'draft' },
    ];

    mockCtx.db.query.mockResolvedValue(
      mockProjects.filter(p => p.status === 'published')
    );

    const result = await getPublishedProjects(mockCtx, {});
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('published');
  });
});
```

**Convex Mutation Testing:**
```typescript
// Test mutation validation
describe('createProject mutation', () => {
  it('throws error when title is missing', async () => {
    await expect(
      createProject(mockCtx, { title: '' })
    ).rejects.toThrow('Title is required');
  });

  it('creates project with valid data', async () => {
    mockCtx.db.insert = jest.fn().mockResolvedValue('new-id');

    const result = await createProject(mockCtx, {
      title: 'New Project',
      summary: 'Summary',
      stack: ['Next.js'],
    });

    expect(mockCtx.db.insert).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });
});
```

## Testing Authentication

**Testing Protected Routes:**
```typescript
// Middleware/auth testing
import { getUser } from '@/lib/auth';

jest.mock('@/lib/auth');

describe('Admin route protection', () => {
  it('redirects unauthenticated users', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    // Test middleware or component behavior
    // Assert redirect occurs
  });

  it('allows authenticated admin users', async () => {
    (getUser as jest.Mock).mockResolvedValue({
      email: 'admin@example.com',
    });

    // Assert access granted
  });
});
```

## CI Integration

**GitHub Actions Configuration:**
```yaml
# .github/workflows/test.yml (to be created)
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run typecheck
      - run: npm test -- --coverage
      - run: npm run build
```

## Testing Checklist

When adding new features, ensure:
- [ ] Unit tests for new utility functions
- [ ] Component tests for new React components
- [ ] Integration tests for new features with multiple moving parts
- [ ] Convex function tests for new queries/mutations
- [ ] Error state coverage
- [ ] Loading state coverage (for async operations)
- [ ] Authentication checks (for protected features)
- [ ] Edge cases and boundary conditions

---

*Testing analysis: 2026-01-18*

*Note: This testing strategy will be implemented as the codebase is built. Patterns and tooling choices may be refined based on actual implementation needs.*
