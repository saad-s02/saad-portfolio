# Plan 04-04 Summary: Projects Admin CRUD Interface

**Phase:** 04-authentication---admin-panel
**Plan:** 04-04
**Status:** Complete
**Completed:** 2026-01-20

---

## Objective

Build complete admin interface for managing projects including list view, create/edit forms, and quick action toggles.

---

## What Was Built

### Projects List Page (`app/admin/projects/page.tsx`)
- Lists all projects (published + draft) in responsive table/card layout
- Desktop: Table view with all fields visible
- Mobile: Card view for better touch interaction
- Includes quick action buttons (Edit, Delete)
- Integrated status and featured toggle components

### Create Project Flow
**Files:**
- `app/admin/projects/new/page.tsx` - Create project page wrapper
- `app/admin/projects/new/ProjectForm.tsx` - Comprehensive project form (320 lines)
- `app/admin/projects/new/schema.ts` - Zod validation schema with array transforms

**Features:**
- All project fields (title, slug, summary, content, status, featured)
- Tech stack input (comma-separated → array transform)
- Tags input (comma-separated → array transform)
- Dynamic links array with add/remove
- Screenshots array (newline-separated)
- Client-side validation with React Hook Form + Zod
- Direct Convex mutation via `useMutation` (bypasses server actions for auth token)

### Edit Project Flow
**Files:**
- `app/admin/projects/[id]/edit/page.tsx` - Edit project page with data loading
- `app/admin/projects/[id]/edit/ProjectForm.tsx` - Edit form (pre-filled with existing data)

**Features:**
- Loads project data via `useQuery(api.projects.listAll)`
- Pre-fills form with existing values
- Same validation schema as create
- Handles Next.js 16 async params with `React.use()`

### Quick Action Components
**Files:**
- `components/admin/DeleteProjectButton.tsx` - Delete with confirmation dialog
- `components/admin/ProjectStatusToggle.tsx` - Toggle draft/published
- `components/admin/ProjectFeaturedToggle.tsx` - Toggle featured flag

**Features:**
- Optimistic UI updates
- Convex `useMutation` hooks for auth token inclusion
- Toast notifications on success/error
- Confirmation dialogs for destructive actions

---

## Key Technical Decisions

### Client-Side Mutations Instead of Server Actions
**Decision:** Use `useMutation(api.projects.create)` directly in client components
**Rationale:** Server actions with `fetchMutation` don't have access to client auth tokens from `ConvexProviderWithAuth`. Client-side mutations automatically include WorkOS access tokens.
**Files:** ProjectForm.tsx (both create and edit)

### Zod Schema with Transform for Array Inputs
**Decision:** Accept strings or arrays, transform strings to arrays during validation
**Rationale:** HTML text inputs return strings, but Convex mutations expect arrays. Schema handles transformation transparently.
**Implementation:**
```typescript
stack: z.union([
  z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  z.array(z.string())
]).refine(val => Array.isArray(val) && val.length > 0)
```

### Next.js 16 Async Params Handling
**Decision:** Use `React.use()` to unwrap params Promise
**Rationale:** Next.js 16 changed dynamic route params to be async. Must unwrap with `use()` before accessing.
**File:** app/admin/projects/[id]/edit/page.tsx:16

---

## Tasks Completed

| # | Task | Status | Time | Commits |
|---|------|--------|------|---------|
| 1-6 | All auto tasks | ✓ | 60min | Multiple (auth fixes) |
| 7 | Human verification | ✓ | 10min | Schema fix, params fix |

**Total:** 7 tasks, 70 minutes (including orchestrator auth debugging)

---

## Deviations from Plan

### Auth Integration Fixes (Orchestrator)
**Issue:** Convex queries/mutations returning "Unauthorized" errors
**Root cause:** `ConvexProviderWithAuth` not properly bridging WorkOS → Convex auth tokens

**Fixes applied:**
1. **app/ConvexClientProvider.tsx** - Created `useAuthFromAuthKit` adapter hook:
   - Uses `useAuth` + `useAccessToken` from WorkOS
   - Converts to Convex's expected interface (`isLoading`, `isAuthenticated`, `fetchAccessToken`)
   - Uses stable ref to prevent unnecessary re-fetches

2. **convex/auth.config.ts** - Updated to full JWT config:
   - Added `type: "customJwt"`, `algorithm: "RS256"`
   - Configured JWKS URL for token validation
   - Dual issuer support (SSO + user management)

3. **Refactored forms** - Switched from server actions to client mutations:
   - Server actions (`fetchMutation`) run server-side without client auth context
   - Client mutations (`useMutation`) automatically include auth tokens from provider

### Form Validation Schema Update
**Issue:** "Invalid input: expected array, received string" errors
**Fix:** Updated Zod schema to accept strings and transform to arrays
**File:** app/admin/projects/new/schema.ts

### Edit Page Params Handling
**Issue:** "params must be unwrapped with React.use()" error
**Fix:** Changed `params: { id: string }` to `params: Promise<{ id: string }>` and unwrapped with `use()`
**File:** app/admin/projects/[id]/edit/page.tsx

---

## Testing Results

### Manual Testing (User Verified)
✓ Projects list loads with no data (empty state)
✓ Create new project with stack/tags (comma-separated)
✓ Project appears in list after creation
✓ Edit project form pre-fills correctly
✓ Update project saves changes
✓ Delete project with confirmation removes from list
✓ Status toggle changes draft ↔ published
✓ Featured toggle marks/unmarks for homepage
✓ Form validation shows errors for missing fields
✓ Auth token correctly passed to all mutations

---

## Files Modified

**Created:**
- `app/admin/projects/page.tsx` (155 lines)
- `app/admin/projects/new/page.tsx` (10 lines)
- `app/admin/projects/new/ProjectForm.tsx` (320 lines)
- `app/admin/projects/new/schema.ts` (60 lines)
- `app/admin/projects/[id]/edit/page.tsx` (42 lines)
- `app/admin/projects/[id]/edit/ProjectForm.tsx` (331 lines)
- `components/admin/DeleteProjectButton.tsx` (45 lines)
- `components/admin/ProjectStatusToggle.tsx` (38 lines)
- `components/admin/ProjectFeaturedToggle.tsx` (36 lines)

**Modified (Orchestrator Fixes):**
- `app/ConvexClientProvider.tsx` - Added useAuthFromAuthKit adapter
- `convex/auth.config.ts` - Full JWT configuration
- `app/admin/projects/new/schema.ts` - Array transform unions

---

## Verification

### Must-Haves Checklist
- [x] Admin can view all projects (published and draft) in list
- [x] Admin can create new project via form
- [x] Admin can edit existing project via form
- [x] Admin can delete project with confirmation dialog
- [x] Admin can toggle draft/published status
- [x] Admin can toggle featured flag
- [x] Form validates input and shows error messages

### Artifacts Verified
- [x] `app/admin/projects/page.tsx` exists (155 lines)
- [x] `app/admin/projects/new/page.tsx` exists (10 lines)
- [x] `app/admin/projects/new/ProjectForm.tsx` exists (320 lines)
- [x] `app/admin/projects/new/schema.ts` exports projectSchema, ProjectFormData
- [x] `app/admin/projects/[id]/edit/page.tsx` exists (42 lines)
- [x] `app/admin/projects/[id]/edit/ProjectForm.tsx` exists (331 lines)
- [x] Delete/status/featured components exist and functional

---

## Issues Encountered

### Auth Token Not Passing (Fixed)
Convex queries/mutations failed with "Unauthorized". Root cause: incomplete WorkOS → Convex auth bridge. Fixed with custom adapter hook and proper JWT config.

### Form Validation Errors (Fixed)
Zod schema expected arrays but received strings from text inputs. Fixed with union types that transform strings to arrays.

### Next.js 16 Params Breaking Change (Fixed)
Dynamic route params became async Promises in Next.js 16. Fixed by unwrapping with `React.use()`.

---

## Next Steps

Plan 04-05: Resume, Changelog, and Contact Submissions admin interfaces (Wave 3)

---

*Summary completed: 2026-01-20*
