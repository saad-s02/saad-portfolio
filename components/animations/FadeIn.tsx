"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
};

/**
 * FadeIn - Scroll reveal wrapper with accessibility support
 *
 * Wraps content with Framer Motion scroll reveal animation that fades in
 * content from below when it enters the viewport. Automatically respects
 * prefers-reduced-motion for accessibility compliance (WCAG 2.1).
 *
 * @param children - Content to animate
 * @param delay - Animation delay in seconds (default: 0)
 *
 * @example
 * ```tsx
 * <FadeIn delay={0.2}>
 *   <h2>This will fade in on scroll</h2>
 * </FadeIn>
 * ```
 */
export function FadeIn({ children, delay = 0 }: FadeInProps) {
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
