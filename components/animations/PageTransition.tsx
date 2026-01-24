"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * PageTransition - Route-level fade transition wrapper
 *
 * Wraps page content with Framer Motion fade-in animation that triggers
 * on route navigation. Designed to be used in app/template.tsx for
 * smooth page transitions across the entire application.
 *
 * Uses animate (not whileInView) because this is for route changes,
 * not scroll-based reveals. Short duration (0.3s) ensures page
 * transitions feel fast, not sluggish on frequent navigation.
 *
 * Automatically respects prefers-reduced-motion for accessibility.
 *
 * @param children - Page content to animate
 *
 * @example
 * ```tsx
 * // app/template.tsx
 * export default function Template({ children }) {
 *   return <PageTransition>{children}</PageTransition>;
 * }
 * ```
 */
export function PageTransition({ children }: PageTransitionProps) {
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
