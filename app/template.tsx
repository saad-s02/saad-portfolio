"use client";
import { PageTransition } from "@/components/animations/PageTransition";

/**
 * Template - Global page transition wrapper
 *
 * Next.js template.tsx creates a new instance on every route navigation
 * (unlike layout.tsx which persists across routes), enabling entry animations.
 *
 * Wraps all page content with PageTransition component for smooth 300ms
 * fade-in effect when navigating between routes.
 *
 * Critical: Must be template.tsx, NOT layout.tsx. Layout persists across
 * routes and breaks animation lifecycle. Template creates new instances,
 * allowing animation to trigger on each navigation.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/template
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
