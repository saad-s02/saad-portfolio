# PRD: Automated Personal Portfolio Website (Claude Code–Driven)

## 1) Overview

Build a personal portfolio/resume website with an **admin panel** and a highly visible **Stack/Automation** section showing an end-to-end automated engineering workflow driven by **Claude Code**:

- Issue → PR authored by Claude
- PR review by Claude (required merge gate)
- CI required checks
- Merge → deploy + changelog update

## 2) Goals

- Deliver a polished portfolio/resume site with pages: **Home, About, Resume, Projects, Stack/Automation, Contact, Admin**
- Demonstrate a verifiable automated workflow (evidence in repo + on-site)
- Admin-only ability (you only) to manage Projects + Resume content

## 3) Non-goals

- No blog/writing section in v1
- No multi-environment (staging) beyond PR previews
- No accessibility requirements beyond basic usability

## 4) Audience

- Recruiters (fast scan)
- Hiring managers (deep dive on automation + engineering enablement)

---

## 5) Tech Stack (v1)

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Framer Motion** for animations (page transitions, scroll reveals, hover interactions)
- **Convex** for database + server functions
- **WorkOS AuthKit** for authentication (protect Admin)
- **Hosting:** Vercel (frontend) + Convex deploy integration
- **Automation:** Claude Code GitHub Actions + repo slash commands

---

## 6) Information Architecture & Requirements

### Pages (v1)

- Home
- About
- Resume
- Projects (index + detail)
- Stack/Automation
- Contact
- Admin (protected)

### Home

**Purpose:** 15-second summary + navigation to strongest evidence  
**Sections:**

- Hero (name + role + 1–2 line positioning)
- Highlights (3–6 bullets)
- Featured projects (top 3)
- Automation teaser (link to Stack/Automation)
- Contact CTA

**Acceptance criteria**

- Looks premium in dark + minimalist aesthetic
- Mobile + desktop responsive
- Smooth animations and fast load

### About

Short narrative + strengths + enablement framing.

### Resume

Web-resume rendered from structured data (editable in Admin). Optional PDF later.

### Projects (index + detail)

**Project fields:** title, summary, stack, tags, dates, links, screenshots  
**Acceptance criteria**

- Filter/search by tags/stack
- Project detail page: problem → approach → constraints → impact → stack → links

### Stack/Automation

**Must include**

- Architecture diagram: Next.js/Vercel + Convex + WorkOS
- Automation pipeline diagram: Issue → Claude PR → Claude Review Gate → CI → Merge → Deploy → Changelog
- Evidence widgets:
  - Latest deployment commit
  - CI badge(s)
  - “Last Claude approval” (from PR metadata or changelog)

### Contact

- Contact form stored in Convex + mailto fallback
- Basic spam protection (honeypot + rate limit)

### Admin (protected)

**Capabilities**

- Create/edit projects
- Update resume sections
- Manage drafts/publish
- Manage changelog visibility/notes

**Access control**

- Only you can log in (email allowlist)
- Admin pages and drafts only viewable when logged in

---

## 7) Data Model (Convex)

### `projects`

- slug (unique)
- title
- summary
- stack[] (strings)
- tags[] (strings)
- startDate, endDate (or dateRangeText)
- links[]: { label, url }
- screenshots[]: static file paths (v1)
- content: rich text / markdown-like string
- status: draft | published
- featured: boolean
- updatedAt

### `resume`

- highlights[]
- experience[]: { company, role, dates, bullets[] }
- education[]
- skills[] (grouped)
- certs[] (optional)
- updatedAt

### `contactSubmissions`

- name, email, message
- createdAt
- status: new | archived

### `changelog`

- date
- title
- summary
- prNumber
- commitSha
- type: feature | fix | chore
- visible: boolean

---

## 8) Automation Requirements (Claude Code)

### 8.1 Claude “Author” bot (Issue → PR)

**Trigger**

- When a new GitHub Issue is opened using the “Feature Request” form or labeled `feature`

**Behavior**

- Claude creates a branch, commits changes, opens a PR referencing the issue
- PR description includes summary, files changed, testing notes, acceptance criteria checklist

### 8.2 Claude “Reviewer” bot (PR merge gate)

**Trigger**

- Always run on PR opened / synchronize

**Behavior**

- Claude posts a structured review + final verdict: APPROVE or REQUEST_CHANGES
- Workflow fails (required check) unless verdict is APPROVE
- Merge blocked unless both CI + Claude Reviewer pass

### 8.3 Auto-labeling

- Claude applies labels for issues/PRs: `frontend`, `backend`, `content`, `infra`, `bug`, `feature`, etc.

### 8.4 Changelog on merge

**Trigger**

- On PR merged to `main`

**Behavior**

- Update `CHANGELOG.md` (or create a `changelog` table row)
- Entry includes: PR title, summary, PR number, date
- Prevent loops (ignore changelog-only commits or detect bot commits)

### 8.5 Repo slash commands

Create `.claude/commands/`:

- `/spec` — issue → mini spec + plan + acceptance criteria
- `/implement` — implement plan + open/update PR
- `/review` — review rubric + APPROVE/REQUEST_CHANGES
- `/release-note` — changelog entry

---

## 9) CI/CD Requirements

### CI required checks (PR)

- lint
- typecheck
- tests
- build

### Preview deployments

- Vercel preview deploy for every PR

### Production deploy

- Automatic on merge to `main` (Vercel)
- Convex deploy integrated with Vercel (via deploy key in env vars)

---

## 10) Security & Privacy

- Do not name clients or sensitive metrics publicly
- Secrets only in GitHub/Vercel secret stores
- Contact form rate limiting; no public exposure of submissions
- Admin-only for drafts and editing

---

## 11) UX/Design Requirements

- Dark, minimalist, high-contrast
- Premium animations (Framer Motion)
- Fully responsive (mobile + desktop)

---

## 12) SEO (baseline)

- Per-page title/description
- OpenGraph tags
- Sitemap + robots
- Canonical URLs

---

## 13) Deliverables

1. Live site on Vercel with all pages
2. WorkOS-protected Admin panel
3. Convex-backed Projects + Resume management
4. Claude automation:
   - Issue→PR authoring
   - PR review merge gate
   - auto-labeling
   - changelog on merge
5. Stack/Automation page with diagrams + live evidence

---

## 14) Recommended Implementation Order

1. Scaffold (Next.js + Tailwind + Framer Motion)
2. Convex schema + read paths
3. Public pages (Home/About/Resume/Projects/Contact)
4. WorkOS auth + Admin UI
5. Claude automation (author + reviewer) + branch protection required checks
6. Stack/Automation evidence page
7. Polish and harden (spam protection, edge cases, performance)

---

## 15) Global Acceptance Criteria

- New feature requests can be filed as GitHub Issues and produce PRs without manual coding
- PR cannot merge unless CI passes AND Claude Reviewer approves
- Production deploy occurs automatically on merge to `main`
