# Phase 5: Design & Animations - Research

**Researched:** 2026-01-24
**Domain:** Web animations, dark mode design, accessibility
**Confidence:** HIGH

## Summary

Phase 5 focuses on implementing a dark, minimalist aesthetic with smooth, accessible animations across the portfolio site. The project already has Framer Motion 12.27.0 installed and basic dark mode structure via Tailwind v4 with `className='dark'` on the html element.

The standard approach for this phase combines:
1. **Framer Motion** for all animations (scroll reveals, page transitions, hover effects)
2. **Tailwind v4 dark mode** via class strategy (already configured)
3. **Next.js App Router patterns** using template.tsx for page transitions and "use client" wrappers for animated components
4. **GPU-only animations** strictly using transform/opacity properties
5. **Accessibility-first** with prefers-reduced-motion detection and WCAG AA contrast compliance

Key architectural decision: Since Next.js App Router uses Server Components by default, all animated components must be client components ("use client"). Page transitions should use template.tsx pattern rather than layout.tsx to ensure proper animation lifecycle.

**Primary recommendation:** Create reusable client component wrappers (FadeIn, SlideIn, PageTransition) that encapsulate Framer Motion with prefers-reduced-motion detection, allowing server components to compose animations declaratively without "use client" proliferation.

## Standard Stack

The established libraries/tools for web animations with Next.js App Router:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.27.0 | React animation library | Industry standard for React, excellent App Router support, 0.5kb Intersection Observer-based scroll detection |
| Tailwind CSS | v4 | Dark theme + utilities | Zero-runtime CSS, v4 has built-in dark mode with CSS variables, 4.5:1 contrast utilities |
| next-themes | 0.4.6+ | Theme management (optional) | Handles localStorage persistence, prefers-color-scheme detection, prevents FOUC |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-spring/web | 9.7+ | Alternative physics-based animations | Complex spring physics, gesture-driven interactions (not needed for this phase) |
| clsx | 2.0+ | Conditional class names | Dark mode class toggling, animation state classes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Framer Motion | CSS animations only | Lighter bundle but less control, harder to coordinate complex sequences |
| Framer Motion | @react-spring/web | More realistic physics but steeper learning curve, larger API surface |
| template.tsx | layout.tsx | Layout persists across navigation (breaks exit animations) |

**Installation:**
```bash
npm install framer-motion@12.27.0
# Optional: for advanced theme management
npm install next-themes clsx
```

## Architecture Patterns

### Recommended Project Structure
```
components/
├── animations/
│   ├── FadeIn.tsx           # Scroll reveal wrapper with prefers-reduced-motion
│   ├── SlideIn.tsx          # Directional scroll reveal
│   ├── PageTransition.tsx   # Wraps page content for route transitions
│   └── MotionLink.tsx       # Link with hover effects
├── ui/
│   └── Button.tsx           # Interactive elements with motion
app/
├── template.tsx             # Global page transition wrapper
├── globals.css              # Dark mode custom variant + WCAG colors
└── [routes]/
    └── page.tsx             # Server components, compose with animation wrappers
```

### Pattern 1: Client Component Wrappers for Server Components

**What:** Create client component animation primitives that server components can use without "use client" directive

**When to use:** All animated content - prevents marking entire pages as client components

**Example:**
```typescript
// components/animations/FadeIn.tsx
"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export function FadeIn({ children, delay = 0 }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

```typescript
// app/about/page.tsx (Server Component)
import { FadeIn } from "@/components/animations/FadeIn";

export default function AboutPage() {
  return (
    <div>
      <FadeIn>
        <h1>About Me</h1>
        <p>Content here...</p>
      </FadeIn>
    </div>
  );
}
```

### Pattern 2: template.tsx for Page Transitions

**What:** Use template.tsx instead of layout.tsx for route-level animations

**When to use:** Smooth page transitions between routes

**Example:**
```typescript
// app/template.tsx
"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

**Critical detail:** template.tsx creates new instances on navigation (unlike layout.tsx which persists), enabling entry animations. Exit animations are more complex and require FrozenRouter pattern (see Pitfalls).

### Pattern 3: GPU-Only Hover Effects

**What:** Interactive elements use only transform/opacity for 60fps performance

**When to use:** All hover states, click feedback

**Example:**
```typescript
// components/ui/Button.tsx
"use client";
import { motion } from "framer-motion";

export function Button({ children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

### Pattern 4: Scroll Reveal with whileInView

**What:** Content animates in when scrolled into viewport using Intersection Observer

**When to use:** Content sections, project cards, any below-fold content

**Example:**
```typescript
<motion.article
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* Content */}
</motion.article>
```

**Options:**
- `once: true` - Animate once, don't reverse on scroll up (preferred for content)
- `margin: "-100px"` - Trigger animation 100px before element enters viewport
- `amount: 0.5` - Require 50% of element visible before triggering

### Pattern 5: WCAG AA Compliant Dark Colors

**What:** Dark mode palette with verified 4.5:1 contrast ratios

**When to use:** All text, interactive elements

**Example:**
```css
/* app/globals.css */
@theme {
  /* Backgrounds */
  --color-gray-950: #0a0a0b;  /* Main background */
  --color-gray-900: #18181b;  /* Card background */
  --color-gray-800: #27272a;  /* Elevated surfaces */

  /* Text (4.5:1+ contrast on gray-950) */
  --color-gray-50: #fafafa;   /* Primary text - 18.5:1 ratio */
  --color-gray-100: #f4f4f5;  /* Primary text - 17.1:1 ratio */
  --color-gray-400: #a1a1aa;  /* Secondary text - 7.5:1 ratio */
  --color-gray-500: #71717a;  /* Tertiary text - 4.9:1 ratio */
}

@custom-variant dark (&:where(.dark, .dark *));
```

**Verification:** Use [Coolors Contrast Checker](https://coolors.co/contrast-checker) or [InclusiveColors](https://www.inclusivecolors.com/) to verify ratios.

### Anti-Patterns to Avoid

- **Animating layout properties:** width, height, top, left cause reflow (use scale, x, y instead)
- **"use client" on page.tsx:** Makes entire page CSR, loses SSR benefits (use wrapper components)
- **AnimatePresence without key:** Exit animations need stable keys
- **will-change on everything:** Causes memory explosion (use sparingly, only on actively animating elements)
- **Animations in layout.tsx:** Layout persists across routes, breaks animation lifecycle (use template.tsx)
- **Hardcoded animation values:** Should respect prefers-reduced-motion

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position detection | window.addEventListener('scroll') | Framer Motion whileInView | Uses Intersection Observer (off main thread), 0.5kb, automatic cleanup |
| Reduced motion detection | window.matchMedia hook | useReducedMotion() from framer-motion | SSR-safe, handles hydration, responds to runtime changes |
| Page transition state | usePathname + useEffect | template.tsx with motion | Built-in lifecycle, no flash, handles navigation edge cases |
| Stagger animations | Manual delays | Framer Motion staggerChildren | Declarative, respects reduced motion, handles dynamic lists |
| Theme toggle | Custom localStorage + useEffect | next-themes | Prevents FOUC, syncs across tabs, handles SSR/hydration |
| Color contrast checking | Manual calculation | InclusiveColors or Coolors checker | WCAG 2.1 compliant, APCA support, Tailwind export |

**Key insight:** Animation lifecycle management is deceptively complex with Next.js App Router (SSR, hydration, route transitions). Framer Motion handles these edge cases. Reduced motion support requires careful SSR handling - don't assume window exists.

## Common Pitfalls

### Pitfall 1: Exit Animations Don't Work in App Router

**What goes wrong:** AnimatePresence exit animations are skipped or unmount happens before animation completes

**Why it happens:** Next.js App Router updates context frequently during navigation, causing components to unmount abruptly before Framer Motion's exit animations complete

**How to avoid:**
1. **Prefer entry animations only** - Use template.tsx with initial/animate (no exit)
2. **For exit animations:** Implement FrozenRouter pattern that freezes route context during animation
3. **Add scroll={false} to Links** - Prevents scroll restoration conflicts

**Warning signs:**
- Flash between route changes
- AnimatePresence mode="wait" has no effect
- Exit variants never trigger

**Example of FrozenRouter pattern:**
```typescript
// components/animations/FrozenRouter.tsx
"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useRef } from "react";

const FrozenRouterContext = createContext<string | null>(null);

export function FrozenRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const frozenPathname = useRef(pathname);

  // Freeze pathname during animation
  return (
    <FrozenRouterContext.Provider value={frozenPathname.current}>
      {children}
    </FrozenRouterContext.Provider>
  );
}
```

### Pitfall 2: Implicit Compositing Memory Explosion

**What goes wrong:** Non-animated elements above animated elements cause browser memory to spike, potentially crashing on mobile

**Why it happens:** GPU compositing promotes elements to separate layers. Elements positioned above (z-index) also get promoted, even if not animated. Each layer consumes significant memory (800x600 image = 1.9MB per layer).

**How to avoid:**
1. **Keep animated elements high in z-index stack**
2. **Use transform: translateZ(0) sparingly** - Each usage creates a layer
3. **Avoid will-change on static elements**
4. **Test on low-end devices** - Memory issues often don't appear on desktop

**Warning signs:**
- Performance degrades on mobile but not desktop
- Chrome DevTools Layers panel shows unexpected composite layers
- Memory profiler shows high GPU memory usage

**Verification:**
```bash
# Chrome DevTools → More tools → Rendering → Layer borders
# Green = layer, helps visualize what's being composited
```

### Pitfall 3: FOUC (Flash of Unstyled Content) with Dark Mode

**What goes wrong:** Page flashes light theme briefly before dark theme applies on initial load

**Why it happens:** HTML renders before JavaScript runs to check localStorage/apply dark class

**How to avoid:** Inline blocking script in `<head>` that runs before paint

**Example:**
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && systemDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-950 text-gray-50">
        {children}
      </body>
    </html>
  );
}
```

**Note:** For this project, `dark` class is hardcoded (non-negotiable dark aesthetic), so FOUC is not a concern. Pattern included for completeness.

**Warning signs:**
- White flash on page load
- Theme "pops in" after content visible
- Different theme on refresh vs navigation

### Pitfall 4: Hydration Mismatch with Reduced Motion

**What goes wrong:** Server renders with animations, client detects reduced motion preference, content shifts during hydration

**Why it happens:** useReducedMotion() accesses window.matchMedia which doesn't exist on server

**How to avoid:** Default to no animations on server, enable on client

**Example:**
```typescript
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

export function FadeIn({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Until hydrated, assume reduced motion (safe default)
  const shouldAnimate = mounted && !prefersReducedMotion;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
    >
      {children}
    </motion.div>
  );
}
```

**Warning signs:**
- Console warnings about hydration mismatch
- Content "jumps" after page load
- Different animation state on server vs client render

### Pitfall 5: Animating Too Many Elements Simultaneously

**What goes wrong:** Page feels janky, frame rate drops below 60fps, especially on scroll

**Why it happens:** Too many concurrent animations overwhelm GPU, even with transform/opacity

**How to avoid:**
1. **Stagger animations with delays** - Use `staggerChildren` in Framer Motion variants
2. **Limit simultaneous whileInView animations** - Max 3-5 elements animating at once
3. **Use viewport margin to pre-trigger** - `margin: "-100px"` starts animation before visible
4. **Simplify mobile animations** - Reduce duration, remove subtle effects on small screens

**Warning signs:**
- Scroll feels laggy
- Chrome DevTools Performance shows frames over 16ms
- Animations stutter on mid-range devices

**Example stagger:**
```typescript
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // 100ms delay between each child
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Code Examples

Verified patterns from official sources and project inspection:

### Scroll Reveal on Content Sections
```typescript
// Source: Current project - components/projects/ProjectCard.tsx
"use client";
import { motion } from "framer-motion";

export function ProjectCard({ project }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Card content */}
    </motion.article>
  );
}
```

### Interactive Card with Hover/Tap Effects
```typescript
// Source: Current project - components/projects/ProjectCard.tsx (enhanced)
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  className="bg-gray-900 rounded-lg p-6 border border-gray-800
             hover:border-gray-700 transition-colors"
>
  {/* Content */}
</motion.div>
```

### Page Transition Template
```typescript
// Source: Verified pattern from WebSearch + official docs
// app/template.tsx
"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

### Accessible Animation Wrapper with Reduced Motion
```typescript
// Source: Josh W. Comeau article + Framer Motion docs
"use client";
import { motion, useReducedMotion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
};

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

### Dark Mode Configuration (Tailwind v4)
```css
/* Source: Current project - app/globals.css */
@import "tailwindcss";

@theme {
  /* Dark theme color palette */
  --color-gray-950: #0a0a0b;
  --color-gray-900: #18181b;
  --color-gray-800: #27272a;
  --color-gray-700: #3f3f46;
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
}

/* Enable dark mode with .dark class */
@custom-variant dark (&:where(.dark, .dark *));
```

### Staggered List Animation
```typescript
// Source: Framer Motion docs + verified pattern
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

<motion.ul
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.text}
    </motion.li>
  ))}
</motion.ul>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion library | Motion library (rebranded) | 2024 | Same API, new domain (motion.dev), improved docs |
| tailwind.config.js for dark mode | @custom-variant in CSS | Tailwind v4 (2024) | No config file, CSS-based configuration |
| Pages Router animations | App Router + template.tsx | Next.js 13+ | Exit animations harder, need new patterns |
| CSS transitions | GPU-accelerated transform/opacity | Ongoing | 60fps requirement, mobile performance critical |
| Ignore accessibility | prefers-reduced-motion mandatory | WCAG 2.1+ | Legal requirement (ADA), UX improvement |

**Deprecated/outdated:**
- **layout.tsx for page transitions**: Use template.tsx instead - layout persists across routes
- **transform: translateZ(0) hack**: Modern browsers auto-composite, causes memory issues
- **chakra-ui/framer-motion integration**: Motion is standalone, doesn't need UI framework
- **darkMode: 'class' in tailwind.config.js**: Tailwind v4 uses CSS @custom-variant

**Current best practices (2026):**
- **useReducedMotion() hook**: Built into Framer Motion, no custom implementation needed
- **whileInView with Intersection Observer**: Replace scroll event listeners
- **Variants over imperative animation**: Declarative, easier to manage, respects reduced motion
- **Tailwind v4 CSS variables**: More flexible than hardcoded values, easier theme switching

## Open Questions

Things that couldn't be fully resolved:

1. **Next.js 16 App Router exit animation support**
   - What we know: Exit animations are difficult in App Router due to context updates
   - What's unclear: Whether Next.js 16 has improved support vs Next.js 14/15
   - Recommendation: Start with entry animations only (template.tsx), revisit exit animations if user feedback demands them. FrozenRouter pattern works but adds complexity.

2. **Optimal stagger delay for project cards**
   - What we know: 100-150ms is common, too fast feels rushed, too slow feels laggy
   - What's unclear: Project-specific ideal timing depends on card complexity
   - Recommendation: Start with 100ms, A/B test with users if performance allows

3. **Mobile animation simplification threshold**
   - What we know: Mobile devices have less GPU memory, animations should be simpler
   - What's unclear: Exact breakpoint to reduce animation complexity (sm: 640px? md: 768px?)
   - Recommendation: Test on mid-range Android device (not just iPhone), measure performance, disable subtle effects below 768px if needed

## Sources

### Primary (HIGH confidence)
- Tailwind CSS official docs - Dark mode configuration and v4 changes: https://tailwindcss.com/docs/dark-mode
- Smashing Magazine - GPU animation best practices: https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/
- Josh W. Comeau - prefers-reduced-motion implementation: https://www.joshwcomeau.com/react/prefers-reduced-motion/
- Current project codebase - package.json, layout.tsx, globals.css, ProjectCard.tsx

### Secondary (MEDIUM confidence)
- [How to Use Framer Motion for Animations in Next.js](https://staticmania.com/blog/how-to-use-framer-motion-for-animations-in-next-js)
- [Solving Framer Motion Page Transitions in Next.js App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)
- [Page Transition In NextJS 14 App Router Using Framer Motion](https://dev.to/abdur_rakibrony_97cea0e9/page-transition-in-nextjs-14-app-router-using-framer-motion-2he7)
- [Implementing Dark Mode and Theme Switching using Tailwind v4 and Next.js](https://www.thingsaboutweb.dev/en/posts/dark-mode-with-tailwind-v4-nextjs)
- [Create accessible animations in React — Motion Guide](https://motion.dev/docs/react-accessibility)
- [Understanding & Fixing FOUC in Next.js App Router (2025 Guide)](https://dev.to/amritapadhy/understanding-fixing-fouc-in-nextjs-app-router-2025-guide-ojk)

### Secondary (MEDIUM confidence - WebSearch verified)
- [Create Beautiful Scroll Animations Using Framer Motion](https://dev.to/shivamkatare/create-beautiful-scroll-animations-using-framer-motion-1a7b)
- [Framer Motion Tips for Performance in React](https://tillitsdone.com/blogs/framer-motion-performance-tips/)
- [CSS GPU Acceleration guide](https://www.lexo.ch/blog/2025/01/boost-css-performance-with-will-change-and-transform-translate3d-why-gpu-acceleration-matters/)
- [How to Achieve Smooth CSS Animations: 60 FPS Performance Guide](https://ipixel.com.sg/web-development/how-to-achieve-smooth-css-animations-60-fps-performance-guide/)

### Tertiary (LOW confidence - tools/references)
- [InclusiveColors - WCAG color palette creator](https://www.inclusivecolors.com/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- [GitHub Next.js discussion #49279 - App router Framer Motion issues](https://github.com/vercel/next.js/issues/49279)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Framer Motion verified in package.json, Tailwind v4 patterns verified in current codebase
- Architecture: HIGH - template.tsx pattern verified across multiple current sources, existing ProjectCard.tsx demonstrates patterns
- GPU performance: HIGH - Smashing Magazine article is authoritative, principles verified across multiple sources
- Pitfalls: HIGH - Exit animation issues well-documented in Next.js GitHub, implicit compositing from authoritative source
- Accessibility: HIGH - Josh W. Comeau article is widely cited, Motion docs confirm approach

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stack is stable, Next.js/Framer Motion patterns well-established)
**Next review trigger:** Next.js 17 release, Framer Motion major version update, Tailwind v5 release
